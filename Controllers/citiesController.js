// controllers/citiesController.js
const Amadeus = require("amadeus");

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const searchCities = async (req, res) => {
  try {
    const { 
      keyword, 
      limit = 10, 
      offset = 0, 
      sort = "analytics.travelers.score",
      view = "FULL" 
    } = req.query;

    // Validate required parameters
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword parameter is required",
      });
    }

    // Validate limit parameter
    const pageLimit = parseInt(limit, 10);
    if (isNaN(pageLimit) || pageLimit < 1 || pageLimit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit parameter must be a number between 1 and 100",
      });
    }

    // Validate offset parameter
    const pageOffset = parseInt(offset, 10);
    if (isNaN(pageOffset) || pageOffset < 0) {
      return res.status(400).json({
        success: false,
        message: "Offset parameter must be a non-negative number",
      });
    }

    // Use Amadeus SDK to call the locations API with subType=AIRPORT
    const response = await amadeus.referenceData.locations.get({
      subType: "AIRPORT",
      keyword,
      "page[limit]": pageLimit,
      "page[offset]": pageOffset,
      sort,
      view,
    });

    // Return the response data directly from Amadeus API
    return res.status(200).json({
      success: true,
      message: "Airports retrieved successfully",
      data: response.result,
    });
    
  } catch (error) {
    console.error("Error searching airports:", error);

    // Handle Amadeus API errors
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage =
        error.response.data?.errors?.[0]?.detail ||
        error.response.data?.error_description ||
        "Amadeus API error";

      return res.status(statusCode).json({
        success: false,
        message: `Amadeus API Error: ${errorMessage}`,
        error: error.response.data,
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error while searching airports",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
};

module.exports = { searchCities };
