const express = require("express");
const { searchFlights } = require("../Controllers/flightsController");

const router = express.Router();

router.get("/search", searchFlights);

module.exports = router;


