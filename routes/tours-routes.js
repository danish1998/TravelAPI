// routes/tours-routes.js
const express = require("express");
const { searchActivities, getActivityById } = require("../Controllers/toursController");
const { asyncHandler } = require("../middleware/ErrorHandler");

const router = express.Router();

// GET /api/v1/tours/activities - Search for activities by location
router.get("/activities", asyncHandler(searchActivities));

// GET /api/v1/tours/activities/:activityId - Get specific activity details
router.get("/activities/:activityId", asyncHandler(getActivityById));

module.exports = router;
