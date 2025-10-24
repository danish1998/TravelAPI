// controllers/pointsOfInterestController.js
const Amadeus = require("amadeus");

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const searchPointsOfInterest = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 20,
      category = 'SIGHTS',
      page_limit = 10,
      page_offset = 0
    } = req.query;

    // Validate required parameters
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required parameters",
      });
    }

    // Validate latitude
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "latitude must be a number between -90 and 90",
      });
    }

    // Validate longitude
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: "longitude must be a number between -180 and 180",
      });
    }

    // Validate radius
    const radiusNum = parseInt(radius, 10);
    if (isNaN(radiusNum) || radiusNum < 1 || radiusNum > 500) {
      return res.status(400).json({
        success: false,
        message: "radius must be a number between 1 and 500 kilometers",
      });
    }

    // Validate category
    const validCategories = [
      'SIGHTS', 'NIGHTLIFE', 'RESTAURANT', 'SHOPPING', 'CASINO', 'SPA', 'LIKELY_TO_GO'
    ];
    if (category && !validCategories.includes(category.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "category must be one of: SIGHTS, NIGHTLIFE, RESTAURANT, SHOPPING, CASINO, SPA, LIKELY_TO_GO",
      });
    }

    // Validate page_limit
    const pageLimit = parseInt(page_limit, 10);
    if (isNaN(pageLimit) || pageLimit < 1 || pageLimit > 20) {
      return res.status(400).json({
        success: false,
        message: "page_limit must be a number between 1 and 20",
      });
    }

    // Validate page_offset
    const pageOffset = parseInt(page_offset, 10);
    if (isNaN(pageOffset) || pageOffset < 0) {
      return res.status(400).json({
        success: false,
        message: "page_offset must be a number greater than or equal to 0",
      });
    }

    // Build search parameters
    const searchParams = {
      latitude: lat,
      longitude: lng,
      radius: radiusNum,
      category: category.toUpperCase(),
      page: {
        limit: pageLimit,
        offset: pageOffset
      }
    };

    // Search for points of interest
    const response = await amadeus.referenceData.locations.pointsOfInterest.get(searchParams);

    return res.status(200).json({
      success: true,
      message: "Points of interest retrieved successfully",
      data: response.result.data,
      meta: response.result.meta,
    });
  } catch (error) {
    console.error("Error searching points of interest:", error);

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
      message: "Internal server error while searching points of interest",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getPointOfInterestById = async (req, res) => {
  try {
    const { poiId } = req.params;

    // Validate poiId parameter
    if (!poiId) {
      return res.status(400).json({
        success: false,
        message: "poiId parameter is required",
      });
    }

    // Get point of interest by ID
    const response = await amadeus.referenceData.locations.pointsOfInterest.byId.get({
      id: poiId
    });

    return res.status(200).json({
      success: true,
      message: "Point of interest retrieved successfully",
      data: response.result.data,
    });
  } catch (error) {
    console.error("Error getting point of interest by ID:", error);

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
      message: "Internal server error while getting point of interest",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const searchPointsOfInterestBySquare = async (req, res) => {
  try {
    const {
      north,
      west,
      south,
      east,
      category = 'SIGHTS',
      page_limit = 10,
      page_offset = 0
    } = req.query;

    // Validate required parameters
    if (!north || !west || !south || !east) {
      return res.status(400).json({
        success: false,
        message: "north, west, south, and east coordinates are required parameters",
      });
    }

    // Validate coordinates
    const northNum = parseFloat(north);
    const westNum = parseFloat(west);
    const southNum = parseFloat(south);
    const eastNum = parseFloat(east);

    if (isNaN(northNum) || northNum < -90 || northNum > 90) {
      return res.status(400).json({
        success: false,
        message: "north must be a number between -90 and 90",
      });
    }

    if (isNaN(westNum) || westNum < -180 || westNum > 180) {
      return res.status(400).json({
        success: false,
        message: "west must be a number between -180 and 180",
      });
    }

    if (isNaN(southNum) || southNum < -90 || southNum > 90) {
      return res.status(400).json({
        success: false,
        message: "south must be a number between -90 and 90",
      });
    }

    if (isNaN(eastNum) || eastNum < -180 || eastNum > 180) {
      return res.status(400).json({
        success: false,
        message: "east must be a number between -180 and 180",
      });
    }

    // Validate that north > south
    if (northNum <= southNum) {
      return res.status(400).json({
        success: false,
        message: "north coordinate must be greater than south coordinate",
      });
    }

    // Validate that east > west (considering longitude wrapping)
    if (eastNum <= westNum && (eastNum - westNum) <= 0) {
      return res.status(400).json({
        success: false,
        message: "east coordinate must be greater than west coordinate",
      });
    }

    // Validate category
    const validCategories = [
      'SIGHTS', 'NIGHTLIFE', 'RESTAURANT', 'SHOPPING', 'CASINO', 'SPA', 'LIKELY_TO_GO'
    ];
    if (category && !validCategories.includes(category.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "category must be one of: SIGHTS, NIGHTLIFE, RESTAURANT, SHOPPING, CASINO, SPA, LIKELY_TO_GO",
      });
    }

    // Validate page_limit
    const pageLimit = parseInt(page_limit, 10);
    if (isNaN(pageLimit) || pageLimit < 1 || pageLimit > 20) {
      return res.status(400).json({
        success: false,
        message: "page_limit must be a number between 1 and 20",
      });
    }

    // Validate page_offset
    const pageOffset = parseInt(page_offset, 10);
    if (isNaN(pageOffset) || pageOffset < 0) {
      return res.status(400).json({
        success: false,
        message: "page_offset must be a number greater than or equal to 0",
      });
    }

    // Build search parameters
    const searchParams = {
      north: northNum,
      west: westNum,
      south: southNum,
      east: eastNum,
      category: category.toUpperCase(),
      page: {
        limit: pageLimit,
        offset: pageOffset
      }
    };

    // Search for points of interest by square
    const response = await amadeus.referenceData.locations.pointsOfInterest.bySquare.get(searchParams);

    return res.status(200).json({
      success: true,
      message: "Points of interest retrieved successfully",
      data: response.result.data,
      meta: response.result.meta,
    });
  } catch (error) {
    console.error("Error searching points of interest by square:", error);

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
      message: "Internal server error while searching points of interest",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { 
  searchPointsOfInterest, 
  getPointOfInterestById, 
  searchPointsOfInterestBySquare 
};
