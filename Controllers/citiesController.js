// controllers/citiesController.js
const Amadeus = require("amadeus");

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const searchCities = async (req, res) => {
  try {
    const { keyword, max = 10, include = "AIRPORTS" } = req.query;

    // Validate required parameters
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword parameter is required",
      });
    }

    // Validate max parameter
    const maxResults = parseInt(max, 10);
    if (isNaN(maxResults) || maxResults < 1 || maxResults > 20) {
      return res.status(400).json({
        success: false,
        message: "Max parameter must be a number between 1 and 20",
      });
    }

    // Use Amadeus SDK directly
    const response = await amadeus.referenceData.locations.cities.get({
      keyword,
      max: maxResults,
      include,
    });

    // Return exactly like Amadeus API Explorer
    return res.status(200).json({
      success: true,
      message: "Airports retrieved successfully",
      included: response.result.included,
    });
  } catch (error) {
    console.error("Error searching cities:", error);

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
      message: "Internal server error while searching cities",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
};

module.exports = { searchCities };
