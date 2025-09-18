const express = require("express");
const { 
    searchByContinent, 
    getAllContinents, 
    getCountriesByContinent,
    getCitiesByContinent 
} = require("../Controllers/continentsController");

const router = express.Router();

// GET /api/v1/continents/search?continent=europe&limit=10&includeWeather=true
router.get("/search", searchByContinent);

// GET /api/v1/continents/continents
router.get("/continents", getAllContinents);

// GET /api/v1/continents/countries/:continent?limit=20
router.get("/countries/:continent", getCountriesByContinent);

// GET /api/v1/continents/cities/:continent?limit=15&includeWeather=true
router.get("/cities/:continent", getCitiesByContinent);

module.exports = router;