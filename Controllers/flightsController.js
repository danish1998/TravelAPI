// controllers/flightsController.js
const Amadeus = require("amadeus");

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const searchFlights = async (req, res) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      travelClass,
      includedAirlineCodes,
      excludedAirlineCodes,
      nonStop,
      currencyCode,
      maxPrice,
      max,
    } = req.query;

    // Validate required parameters
    if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
      return res.status(400).json({
        success: false,
        message: "originLocationCode, destinationLocationCode, departureDate, and adults are required",
      });
    }

    // Validate adults parameter
    const adultsCount = parseInt(adults, 10);
    if (isNaN(adultsCount) || adultsCount < 1) {
      return res.status(400).json({
        success: false,
        message: "adults parameter must be at least 1",
      });
    }

    // Validate children parameter
    const childrenCount = children ? parseInt(children, 10) : 0;
    if (children && (isNaN(childrenCount) || childrenCount < 0)) {
      return res.status(400).json({
        success: false,
        message: "children parameter must be greater than or equal to 0",
      });
    }

    // Validate infants parameter
    const infantsCount = infants ? parseInt(infants, 10) : 0;
    if (infants && (isNaN(infantsCount) || infantsCount < 0)) {
      return res.status(400).json({
        success: false,
        message: "infants parameter must be greater than or equal to 0",
      });
    }

    // Validate total seated travelers (adults + children) <= 9
    if (adultsCount + childrenCount > 9) {
      return res.status(400).json({
        success: false,
        message: "Total number of seated travelers (adults + children) cannot exceed 9",
      });
    }

    // Validate infants <= adults
    if (infantsCount > adultsCount) {
      return res.status(400).json({
        success: false,
        message: "Number of infants cannot exceed number of adults",
      });
    }

    // Validate travelClass
    const validTravelClasses = ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"];
    if (travelClass && !validTravelClasses.includes(travelClass.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "travelClass must be one of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST",
      });
    }

    // Validate that includedAirlineCodes and excludedAirlineCodes are not both present
    if (includedAirlineCodes && excludedAirlineCodes) {
      return res.status(400).json({
        success: false,
        message: "includedAirlineCodes and excludedAirlineCodes cannot be used together",
      });
    }

    // Validate maxPrice
    if (maxPrice) {
      const maxPriceNum = parseInt(maxPrice, 10);
      if (isNaN(maxPriceNum) || maxPriceNum < 1) {
        return res.status(400).json({
          success: false,
          message: "maxPrice must be a positive number with no decimals",
        });
      }
    }

    // Validate max parameter
    if (max) {
      const maxResults = parseInt(max, 10);
      if (isNaN(maxResults) || maxResults < 1 || maxResults > 250) {
        return res.status(400).json({
          success: false,
          message: "max parameter must be a number between 1 and 250",
        });
      }
    }

    // Build search parameters
    const searchParams = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults: adultsCount,
    };

    // Add optional parameters if provided
    if (returnDate) searchParams.returnDate = returnDate;
    if (children) searchParams.children = childrenCount;
    if (infants) searchParams.infants = infantsCount;
    if (travelClass) searchParams.travelClass = travelClass.toUpperCase();
    if (includedAirlineCodes) searchParams.includedAirlineCodes = includedAirlineCodes;
    if (excludedAirlineCodes) searchParams.excludedAirlineCodes = excludedAirlineCodes;
    if (nonStop !== undefined) searchParams.nonStop = nonStop === "true" || nonStop === true;
    if (currencyCode) searchParams.currencyCode = currencyCode;
    if (maxPrice) searchParams.maxPrice = parseInt(maxPrice, 10);
    if (max) searchParams.max = parseInt(max, 10);

    // Search for flight offers
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);

    return res.status(200).json({
      success: true,
      message: "Flight offers retrieved successfully",
      data: response.result.data,
      dictionaries: response.result.dictionaries,
      meta: response.result.meta,
    });
  } catch (error) {
    console.error("Error searching flights:", error);

    // Handle Amadeus API errors
    if (error.response) {
      const statusCode = error.response.statusCode || 500;
      const errorMessage =
        error.response.result?.errors?.[0]?.detail ||
        error.response.description ||
        "Amadeus API error";

      return res.status(statusCode).json({
        success: false,
        message: `Amadeus API Error: ${errorMessage}`,
        errors: error.response.result?.errors,
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error while searching flights",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const searchFlightsTravelPayouts = async (req, res) => {
  try {
    const {
      origin,
      destination,
      depart_date,
      return_date,
      adults = 1,
      currency = 'INR',
      token,
      marker,
      limit = 30  // Add limit parameter with default value
    } = req.query;

    // Validate required parameters
    if (!origin || !destination || !depart_date) {
      return res.status(400).json({
        success: false,
        message: "origin, destination, and depart_date are required parameters",
      });
    }

    // Validate adults parameter
    const adultsCount = parseInt(adults, 10);
    if (isNaN(adultsCount) || adultsCount < 1 || adultsCount > 9) {
      return res.status(400).json({
        success: false,
        message: "adults parameter must be between 1 and 9",
      });
    }

    // Validate currency
    const validCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    if (currency && !validCurrencies.includes(currency.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "currency must be one of: INR, USD, EUR, GBP, CAD, AUD",
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(depart_date)) {
      return res.status(400).json({
        success: false,
        message: "depart_date must be in YYYY-MM-DD format",
      });
    }

    if (return_date && !dateRegex.test(return_date)) {
      return res.status(400).json({
        success: false,
        message: "return_date must be in YYYY-MM-DD format",
      });
    }

    // Validate that return_date is after depart_date
    if (return_date && new Date(return_date) <= new Date(depart_date)) {
      return res.status(400).json({
        success: false,
        message: "return_date must be after depart_date",
      });
    }

    const fetch = require('node-fetch');
    const baseUrl = 'https://api.travelpayouts.com/aviasales/v3/prices_for_dates';

    // Helper function to build API URL
    const buildApiUrl = (orig, dest, date) => {
      const params = new URLSearchParams({
        origin: orig.toUpperCase(),
        destination: dest.toUpperCase(),
        departure_at: date,  // Changed from depart_date to departure_at
        unique: false,
        sorting: 'price',
        direct: false,
        cy: currency.toUpperCase(),
        limit: parseInt(limit) || 30,  // Use limit from query or default to 30
      });

      if (token) {
        params.append('token', token);
      }

      if (marker) {
        params.append('marker', marker);
      }

      return `${baseUrl}?${params.toString()}`;
    };

    // Fetch outbound flights
    const outboundUrl = buildApiUrl(origin, destination, depart_date);
    let outboundFlights = [];
    let returnFlights = [];

    // Make API calls
    if (return_date) {
      // Round-trip: fetch both outbound and return flights
      const [outboundResponse, returnResponse] = await Promise.all([
        fetch(outboundUrl),
        fetch(buildApiUrl(destination, origin, return_date)) // Swap origin/destination for return
      ]);

      if (!outboundResponse.ok) {
        throw new Error(`TravelPayouts API error (outbound): ${outboundResponse.status} ${outboundResponse.statusText}`);
      }

      if (!returnResponse.ok) {
        throw new Error(`TravelPayouts API error (return): ${returnResponse.status} ${returnResponse.statusText}`);
      }

      const outboundData = await outboundResponse.json();
      const returnData = await returnResponse.json();

      outboundFlights = outboundData.data || [];
      returnFlights = returnData.data || [];

    } else {
      // One-way: fetch only outbound flights
      const outboundResponse = await fetch(outboundUrl);

      if (!outboundResponse.ok) {
        throw new Error(`TravelPayouts API error: ${outboundResponse.status} ${outboundResponse.statusText}`);
      }

      const outboundData = await outboundResponse.json();
      outboundFlights = outboundData.data || [];
    }

    // Transform the data to match your API format
    const transformedData = {
      success: true,
      message: "Flight search completed successfully",
      data: {
        trip_type: return_date ? 'round-trip' : 'one-way',
        outbound_flights: outboundFlights,
        return_flights: return_date ? returnFlights : null,
        currency: currency.toUpperCase(),
        search_params: {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          depart_date,
          return_date: return_date || null,
          adults: adultsCount,
          currency: currency.toUpperCase()
        }
      },
      meta: {
        total_outbound_flights: outboundFlights.length,
        total_return_flights: return_date ? returnFlights.length : 0,
        source: 'TravelPayouts',
        timestamp: new Date().toISOString()
      }
    };

    return res.status(200).json(transformedData);

  } catch (error) {
    console.error("Error searching flights with TravelPayouts:", error);

    // Handle fetch errors
    if (error.message.includes('TravelPayouts API error')) {
      return res.status(502).json({
        success: false,
        message: "External API error",
        error: error.message,
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error while searching flights",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { searchFlights, searchFlightsTravelPayouts };