const express = require("express");
const { 
  searchPointsOfInterest, 
  getPointOfInterestById, 
  searchPointsOfInterestBySquare 
} = require("../Controllers/pointsOfInterestController");

const router = express.Router();

// Search points of interest by latitude and longitude
router.get("/search", searchPointsOfInterest);

// Search points of interest by square coordinates
router.get("/search-by-square", searchPointsOfInterestBySquare);

// Get specific point of interest by ID
router.get("/:poiId", getPointOfInterestById);

module.exports = router;
