const express = require("express");
const router = express.Router();
const { searchAirports } = require("../Controllers/airportsController");

// GET /api/v1/airports/search - Search airports by name, IATA, city, or country
router.get("/search", searchAirports);

module.exports = router;
