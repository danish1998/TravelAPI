const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// POST /api/v1/flights/search
// Required body: origin, destination, departureDate (YYYY-MM-DD)
// Optional body: returnDate, adults, children, infants, currencyCode, nonStop, maxPrice,
//   travelClass (ECONOMY|PREMIUM_ECONOMY|BUSINESS|FIRST),
//   includedAirlines (comma list), excludedAirlines (comma list),
//   maxStops (per itinerary), sortBy (price|duration|departure), sortOrder (asc|desc), limit
const searchFlights = async (req, res, next) => {
    try {
        const body = req.body || {};
        const {
            origin,
            destination,
            departureDate,
            returnDate,
            adults = 1,
            children = 0,
            infants = 0,
            currencyCode,
            nonStop,
            maxPrice,
            travelClass,
            includedAirlines,
            excludedAirlines,
            maxStops,
            sortBy,
            sortOrder = 'asc',
            limit,
        } = body;

        if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
            return res.status(500).json({ message: 'Missing Amadeus credentials' });
        }
        if (!origin || !destination || !departureDate) {
            return res.status(400).json({ message: 'origin, destination, departureDate are required' });
        }

        const params = {
            originLocationCode: String(origin).toUpperCase(),
            destinationLocationCode: String(destination).toUpperCase(),
            departureDate,
            adults: String(adults),
        };
        if (returnDate) params.returnDate = returnDate;
        if (currencyCode) params.currencyCode = String(currencyCode).toUpperCase();
        if (typeof nonStop !== 'undefined') params.nonStop = String(nonStop) === 'true' || nonStop === true ? 'true' : 'false';
        if (maxPrice) params.maxPrice = String(maxPrice);
        if (travelClass) params.travelClass = String(travelClass).toUpperCase();
        if (includedAirlines) params.includedAirlineCodes = String(includedAirlines).toUpperCase();
        if (excludedAirlines) params.excludedAirlineCodes = String(excludedAirlines).toUpperCase();

        // Passenger mix
        const childrenCount = parseInt(String(children), 10);
        const infantsCount = parseInt(String(infants), 10);
        if (!Number.isNaN(childrenCount) && childrenCount > 0) params.children = String(childrenCount);
        if (!Number.isNaN(infantsCount) && infantsCount > 0) params.infants = String(infantsCount);

        const response = await amadeus.shopping.flightOffersSearch.get(params);
        const data = response.data || [];

        // Build unique carrier code set
        const carrierSet = new Set();
        for (const offer of data) {
            for (const it of offer.itineraries || []) {
                for (const s of it.segments || []) {
                    if (s.carrierCode) carrierSet.add(s.carrierCode);
                }
            }
        }
        const carrierCodes = Array.from(carrierSet);

        // Fetch airline names via Amadeus reference data (best-effort)
        const codeToAirline = {};
        if (carrierCodes.length > 0) {
            try {
                const ref = await amadeus.referenceData.airlines.get({ airlineCodes: carrierCodes.join(',') });
                const list = ref.data || [];
                for (const a of list) {
                    if (a.iataCode) {
                        codeToAirline[a.iataCode] = a.businessName || a.commonName || a.name || a.iataCode;
                    }
                }
            } catch (e) {
                // Ignore enrichment errors
            }
        }
        const logoUrlFor = (iataCode) => iataCode ? `https://pics.avs.io/200/50/${iataCode}.png` : undefined;

        // Helpers
        const toMinutes = (isoDuration) => {
            // PT#H#M
            if (!isoDuration) return Infinity;
            const h = /([0-9]+)H/.exec(isoDuration)?.[1];
            const m = /([0-9]+)M/.exec(isoDuration)?.[1];
            return (h ? parseInt(h, 10) * 60 : 0) + (m ? parseInt(m, 10) : 0);
        };
        const getItineraryStops = (itinerary) => {
            const segs = itinerary?.segments || [];
            return Math.max(0, segs.length - 1);
        };
        const getEarliestDeparture = (offer) => {
            const firstSeg = offer?.itineraries?.[0]?.segments?.[0];
            return firstSeg?.departure?.at ? new Date(firstSeg.departure.at).getTime() : Number.MAX_SAFE_INTEGER;
        };
        const getTotalDurationMinutes = (offer) => {
            return (offer.itineraries || []).reduce((sum, it) => sum + toMinutes(it.duration), 0);
        };

        // Simplify
        let simplified = data.map((offer) => ({
            id: offer.id,
            oneWay: !offer.itineraries || offer.itineraries.length === 1,
            price: offer.price?.grandTotal ? Number(offer.price.grandTotal) : undefined,
            currency: offer.price?.currency,
            passengerMix: {
                adults: Number(adults),
                children: !Number.isNaN(childrenCount) ? Math.max(0, childrenCount) : 0,
                infants: !Number.isNaN(infantsCount) ? Math.max(0, infantsCount) : 0,
                travelClass: travelClass ? String(travelClass).toUpperCase() : undefined,
            },
            carrierCodes: Array.from(
                new Set((offer.itineraries || []).flatMap((it) => (it.segments || []).map((s) => s.carrierCode)))
            ),
            carrierNames: Array.from(
                new Set((offer.itineraries || []).flatMap((it) => (it.segments || []).map((s) => codeToAirline[s.carrierCode] || s.carrierCode)))
            ),
            primaryCarrierLogo: logoUrlFor(offer?.itineraries?.[0]?.segments?.[0]?.carrierCode),
            totalDurationMin: getTotalDurationMinutes(offer),
            earliestDepartureTs: getEarliestDeparture(offer),
            itineraries: (offer.itineraries || []).map((it) => ({
                duration: it.duration,
                stops: getItineraryStops(it),
                segments: it.segments?.map((s) => ({
                    carrierCode: s.carrierCode,
                    carrierName: codeToAirline[s.carrierCode] || s.carrierCode,
                    carrierLogo: logoUrlFor(s.carrierCode),
                    number: s.number,
                    departure: s.departure,
                    arrival: s.arrival,
                    aircraft: s.aircraft,
                    duration: s.duration,
                    id: s.id,
                })),
            })),
        }));

        // Post-filtering
        if (typeof maxStops !== 'undefined') {
            const allowedStops = parseInt(String(maxStops), 10);
            if (!Number.isNaN(allowedStops)) {
                simplified = simplified.filter((o) => o.itineraries.every((it) => it.stops <= allowedStops));
            }
        }

        // Sorting
        if (sortBy === 'price') {
            simplified.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        } else if (sortBy === 'duration') {
            simplified.sort((a, b) => a.totalDurationMin - b.totalDurationMin);
        } else if (sortBy === 'departure') {
            simplified.sort((a, b) => a.earliestDepartureTs - b.earliestDepartureTs);
        }
        if (String(sortOrder).toLowerCase() === 'desc') simplified.reverse();

        // Limit
        let limited = simplified;
        if (limit) {
            const n = parseInt(String(limit), 10);
            if (!Number.isNaN(n) && n > 0) limited = simplified.slice(0, n);
        }

        return res.json({ count: limited.length, offers: limited });
    } catch (err) {
        // Amadeus SDK errors often have response details
        if (err.response && err.response.result) {
            return res.status(err.code || 500).json(err.response.result);
        }
        next(err);
    }
};

module.exports = { searchFlights };


