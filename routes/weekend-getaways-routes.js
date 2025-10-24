const express = require("express");
const { searchWeekendGetaways, getAllWeekendTypes, getDestinationsByType } = require("../Controllers/weekendGetawaysController");

const router = express.Router();

// GET /api/v1/weekend-getaways/search - Returns 12 most visited Indian places
// GET /api/v1/weekend-getaways/search?category=historical places - Filter by category
// GET /api/v1/weekend-getaways/search?limit=5 - Limit results
router.get("/search", searchWeekendGetaways);

// GET /api/v1/weekend-getaways/types
router.get("/types", getAllWeekendTypes);

// GET /api/v1/weekend-getaways/destinations/:weekendType?limit=10
router.get("/destinations/:weekendType", getDestinationsByType);

module.exports = router;
