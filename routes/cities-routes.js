const express = require("express");
const router = express.Router();
const { searchCities } = require("../Controllers/citiesController");

// Route to search cities using Amadeus API
router.get("/search", searchCities);

module.exports = router;