const express = require("express");
const { searchFlights, searchFlightsTravelPayouts } = require("../Controllers/flightsController");

const router = express.Router();

router.get("/search", searchFlights);
router.get("/search-travelpayouts", searchFlightsTravelPayouts);

module.exports = router;


