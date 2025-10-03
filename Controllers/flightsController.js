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

module.exports = { searchFlights };