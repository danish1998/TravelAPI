const express = require("express");
const { searchFlights } = require("../Controllers/flightsController");

const router = express.Router();

router.post("/search", searchFlights);

module.exports = router;


