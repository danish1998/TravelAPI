const express = require("express");
const { searchHotels } = require("../Controllers/hotelsController");

const router = express.Router();

router.post("/search", searchHotels);

module.exports = router;


