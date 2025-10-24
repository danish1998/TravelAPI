// routes/activities.js
const express = require("express");
const router = express.Router();
const amadeusService = require("../services/amadeusService");

// Search activities by location
router.get("/search", async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Latitude and longitude are required",
      });
    }

    const params = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    // Add optional radius if provided
    if (radius) {
      params.radius = parseInt(radius);
    }

    const response = await amadeusService.searchActivities(params);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error searching activities:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message || "Failed to search activities",
      details: error.response?.data || null,
    });
  }
});

// Get activity by ID
router.get("/:activityId", async (req, res) => {
  try {
    const { activityId } = req.params;

    if (!activityId) {
      return res.status(400).json({
        error: "Activity ID is required",
      });
    }

    const response = await amadeusService.getActivityById(activityId);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    
    // Handle 404 specifically
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Activity not found",
      });
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message || "Failed to fetch activity",
      details: error.response?.data || null,
    });
  }
});

// Search activities by square area
router.get("/search/square", async (req, res) => {
  try {
    const { north, west, south, east } = req.query;

    if (!north || !west || !south || !east) {
      return res.status(400).json({
        error: "North, West, South, and East coordinates are required",
      });
    }

    const params = {
      north: parseFloat(north),
      west: parseFloat(west),
      south: parseFloat(south),
      east: parseFloat(east),
    };

    const response = await amadeusService.searchActivitiesBySquare(params);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error searching activities by square:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message || "Failed to search activities",
      details: error.response?.data || null,
    });
  }
});

module.exports = router;