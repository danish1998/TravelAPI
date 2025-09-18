const express = require("express");
const { searchWeekendGetaways, getAllWeekendTypes, getDestinationsByType } = require("../Controllers/weekendGetawaysController");

const router = express.Router();

// GET /api/v1/weekend-getaways/search?city=Delhi&radius=300&limit=10&weekendType=hill stations
router.get("/search", searchWeekendGetaways);

// GET /api/v1/weekend-getaways/types
router.get("/types", getAllWeekendTypes);

// GET /api/v1/weekend-getaways/destinations/:weekendType?limit=10
router.get("/destinations/:weekendType", getDestinationsByType);

module.exports = router;
