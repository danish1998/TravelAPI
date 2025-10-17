// controllers/toursController.js
const Amadeus = require("amadeus");
const axios = require("axios");

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// Token caching variables
let cachedToken = null;
let tokenExpiry = null;

// Helper function to get access token (with caching)
const getAccessToken = async () => {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('Using cached access token');
    return cachedToken;
  }

  try {
    console.log('Fetching new access token...');
    const tokenResponse = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    cachedToken = tokenResponse.data.access_token;
    // Set expiry to 25 minutes to be safe (tokens expire in ~30 min)
    tokenExpiry = Date.now() + (25 * 60 * 1000);
    
    console.log('New access token obtained and cached');
    return cachedToken;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
};

const searchActivities = async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      radius = 1, 
      limit = 10, 
      offset = 0,
      category = null,
      tags = null
    } = req.query;

    // Validate required parameters
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude parameters are required",
      });
    }

    // Validate latitude
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be a number between -90 and 90",
      });
    }

    // Validate longitude
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be a number between -180 and 180",
      });
    }

    // Validate radius
    const searchRadius = parseFloat(radius);
    if (isNaN(searchRadius) || searchRadius < 0.1 || searchRadius > 50) {
      return res.status(400).json({
        success: false,
        message: "Radius must be a number between 0.1 and 50",
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

    // Build query parameters
    const queryParams = {
      latitude: lat,
      longitude: lng,
      radius: searchRadius,
      "page[limit]": pageLimit,
      "page[offset]": pageOffset,
    };

    // Add optional parameters if provided
    if (category) {
      queryParams.category = category;
    }
    if (tags) {
      queryParams.tags = tags;
    }

    // Use Amadeus SDK to call the activities API
    const response = await amadeus.shopping.activities.get(queryParams);

    // Return the response data directly from Amadeus API
    return res.status(200).json({
      success: true,
      message: "Activities retrieved successfully",
      data: response.result,
      meta: {
        latitude: lat,
        longitude: lng,
        radius: searchRadius,
        limit: pageLimit,
        offset: pageOffset,
      },
    });
    
  } catch (error) {
    console.error("Error searching activities:", error);

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
      message: "Internal server error while searching activities",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
};

const getActivityById = async (req, res) => {
  try {
    const { activityId } = req.params;
    console.log("Getting activity details for ID:", activityId);

    // Validate activity ID
    if (!activityId) {
      return res.status(400).json({
        success: false,
        message: "Activity ID parameter is required",
      });
    }

    // Get access token (cached or new)
    const accessToken = await getAccessToken();

    // Get activity details using direct API call
    const response = await axios.get(
      `https://test.api.amadeus.com/v1/shopping/activities/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Return the response data in the same format as searchActivities
    return res.status(200).json({
      success: true,
      message: "Activity details retrieved successfully",
      data: response.data,
    });
    
  } catch (error) {
    console.error("Error getting activity details:", error.message);
    
    // Handle API errors
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage =
        error.response.data?.errors?.[0]?.detail ||
        error.response.data?.error_description ||
        "API error";

      console.error("API Error Details:", error.response.data);

      return res.status(statusCode).json({
        success: false,
        message: `Amadeus API Error: ${errorMessage}`,
        error: error.response.data,
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error while getting activity details",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
};

module.exports = { 
  searchActivities, 
  getActivityById 
};