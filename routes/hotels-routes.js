const express = require("express");
const { searchHotels, getHotelDetails, getHotelAvailability } = require("../Controllers/hotelsController");

const router = express.Router();

// Hotel search endpoint
router.post("/search", searchHotels);

// Hotel details endpoint
router.get("/details/:hotelId", getHotelDetails);

// Hotel availability endpoint
router.get("/availability/:hotelId", getHotelAvailability);

module.exports = router;


