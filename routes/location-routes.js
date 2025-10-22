const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { location, geocode, reverseGeocode } = require("../Controllers/locationController");

const router = express.Router();

// IP-based location detection
router.get("/find", location);

// Geocoding endpoints using Geoapify API
router.get("/geocode", geocode);
router.get("/reverse-geocode", reverseGeocode);

module.exports = router;
