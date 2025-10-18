// routes/viator-routes.js
const express = require("express");
const {
  searchTours,
  getTourDetails,
  getTourPhotos,
  getTourReviews,
  searchDestinations,
  searchAttractionsOnly,
  searchAttractionsByDestination,
  searchMultiple,
  getDestinationDetails,
  getCategories,
  getSubcategories
} = require("../Controllers/viatorController");
const { asyncHandler } = require("../middleware/ErrorHandler");

const router = express.Router();

// Search for tours and activities by city name
// GET /api/v1/viator/tours/search?searchTerm=paris&startDate=2024-01-01&endDate=2024-01-07
router.get("/tours/search", asyncHandler(searchTours));

// Search for destinations (cities)
// GET /api/v1/viator/destinations/search?searchTerm=paris
router.get("/destinations/search", asyncHandler(searchDestinations));

// Search for attractions only
// GET /api/v1/viator/attractions/search?searchTerm=eiffel tower
router.get("/attractions/search", asyncHandler(searchAttractionsOnly));

// Search for attractions by destination ID (POST)
// POST /api/v1/viator/attractions/search
router.post("/attractions/search", asyncHandler(searchAttractionsByDestination));

// Search multiple types at once
// GET /api/v1/viator/search/multiple?searchTerm=london&searchTypes=PRODUCTS,ATTRACTIONS
router.get("/search/multiple", asyncHandler(searchMultiple));

// Get specific tour/activity details
// GET /api/v1/viator/tours/:productCode
router.get("/tours/:productCode", asyncHandler(getTourDetails));

// Get tour photos
// GET /api/v1/viator/tours/:productCode/photos
router.get("/tours/:productCode/photos", asyncHandler(getTourPhotos));

// Get tour reviews
// GET /api/v1/viator/tours/:productCode/reviews?topX=1-10
router.get("/tours/:productCode/reviews", asyncHandler(getTourReviews));

// Get destination details
// GET /api/v1/viator/destinations/:destId
router.get("/destinations/:destId", asyncHandler(getDestinationDetails));

// Get all categories
// GET /api/v1/viator/categories
router.get("/categories", asyncHandler(getCategories));

// Get subcategories for a specific category
// GET /api/v1/viator/categories/:categoryId/subcategories
router.get("/categories/:categoryId/subcategories", asyncHandler(getSubcategories));

module.exports = router;
