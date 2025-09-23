const Amadeus = require('amadeus');

// Initialize Amadeus client lazily to ensure environment variables are loaded
let amadeus = null;

const getAmadeusClient = () => {
    if (!amadeus) {
        if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
            throw new Error('Missing Amadeus credentials: AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be set');
        }
        amadeus = new Amadeus({
            clientId: process.env.AMADEUS_CLIENT_ID,
            clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        });
    }
    return amadeus;
};

// POST /api/v1/hotels/search
// Body params:
// - cityCode (IATA city code, e.g., DEL) OR { latitude, longitude, radius (km), radiusUnit }
// - checkInDate (YYYY-MM-DD)
// - checkOutDate (YYYY-MM-DD)
// - adults (default 1)
// - roomQuantity (default 1)
// - currency (optional)
// Filters (optional): priceMax, ratings (comma: 1-5), amenities (comma list), chainCodes (comma), sortBy(price|rating|distance), sortOrder(asc|desc), limit
const searchHotels = async (req, res, next) => {
    try {
        const body = req.body || {};
        const {
            cityCode,
            latitude,
            longitude,
            radius,
            radiusUnit,
            checkInDate,
            checkOutDate,
            adults = 1,
            roomQuantity = 1,
            currency,
            priceMax,
            ratings,
            amenities,
            chainCodes,
            sortBy,
            sortOrder = 'asc',
            limit,
        } = body;

        // Get Amadeus client (will throw if credentials are missing)
        const amadeusClient = getAmadeusClient();

        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({ message: 'checkInDate and checkOutDate are required' });
        }

        if (!cityCode && !(latitude && longitude)) {
            return res.status(400).json({ message: 'Provide cityCode or latitude/longitude' });
        }

        const params = {
            checkInDate,
            checkOutDate,
            adults: String(adults),
            roomQuantity: String(roomQuantity),
        };
        if (cityCode) params.cityCode = String(cityCode).toUpperCase();
        if (latitude && longitude) {
            params.latitude = String(latitude);
            params.longitude = String(longitude);
            if (radius) params.radius = String(radius);
            if (radiusUnit) params.radiusUnit = String(radiusUnit).toUpperCase(); // KM or MILE
        }
        if (currency) params.currency = String(currency).toUpperCase();
        if (priceMax) params.priceRange = `0-${String(priceMax)}`;
        if (chainCodes) params.chainCodes = String(chainCodes).toUpperCase();

        // Call Amadeus Hotel Offers Search
        const response = await amadeusClient.shopping.hotelOffers.get(params);
        const data = response.data || [];

        const ratingsSet = new Set((String(ratings || '') || '').split(',').map((r) => r.trim()).filter(Boolean));
        const amenitiesSet = new Set((String(amenities || '') || '').split(',').map((a) => a.trim().toUpperCase()).filter(Boolean));

        const toNumber = (v, fallback) => {
            const n = Number(v);
            return Number.isFinite(n) ? n : fallback;
        };

        // Simplify/normalize
        let simplified = (data || []).map((item) => {
            const hotel = item.hotel || {};
            const address = hotel.address || {};
            const offer = (item.offers && item.offers[0]) || {}; // first offer
            const distance = hotel.distance || {};
            const hotelAmenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
            const rating = toNumber(hotel.rating, undefined);
            const price = offer.price?.total ? Number(offer.price.total) : undefined;
            const currencyCode = offer.price?.currency || params.currency;

            return {
                hotelId: hotel.hotelId,
                name: hotel.name,
                chainCode: hotel.chainCode,
                brandCode: hotel.brandCode,
                rating,
                latitude: hotel.latitude,
                longitude: hotel.longitude,
                distance: distance.value,
                distanceUnit: distance.unit,
                address: {
                    cityName: address.cityName,
                    countryCode: address.countryCode,
                    lines: address.lines,
                },
                amenities: hotelAmenities,
                offer: {
                    checkInDate: offer.checkInDate,
                    checkOutDate: offer.checkOutDate,
                    room: offer.room,
                    guests: offer.guests,
                    boardType: offer.boardType,
                    price,
                    currency: currencyCode,
                    policies: offer.policies,
                },
            };
        });

        // Post-filtering not supported by API directly
        if (ratingsSet.size > 0) {
            simplified = simplified.filter((h) => ratingsSet.has(String(h.rating)));
        }
        if (amenitiesSet.size > 0) {
            simplified = simplified.filter((h) => {
                const ams = (h.amenities || []).map((a) => String(a).toUpperCase());
                for (const a of amenitiesSet) if (!ams.includes(a)) return false;
                return true;
            });
        }

        // Sorting
        if (sortBy === 'price') {
            simplified.sort((a, b) => (a.offer.price ?? Infinity) - (b.offer.price ?? Infinity));
        } else if (sortBy === 'rating') {
            simplified.sort((a, b) => (b.rating ?? -Infinity) - (a.rating ?? -Infinity)); // higher first
        } else if (sortBy === 'distance') {
            simplified.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        }
        if (String(sortOrder).toLowerCase() === 'desc') simplified.reverse();

        // Limit
        let limited = simplified;
        if (limit) {
            const n = parseInt(String(limit), 10);
            if (!Number.isNaN(n) && n > 0) limited = simplified.slice(0, n);
        }

        return res.json({ count: limited.length, hotels: limited });
    } catch (err) {
        // Handle missing credentials error
        if (err.message && err.message.includes('Missing Amadeus credentials')) {
            return res.status(500).json({ 
                message: 'Server configuration error: Missing Amadeus API credentials',
                error: 'AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET environment variables must be set'
            });
        }
        // Amadeus SDK errors often have response details
        if (err.response && err.response.result) {
            return res.status(err.code || 500).json(err.response.result);
        }
        next(err);
    }
};

module.exports = { searchHotels };


