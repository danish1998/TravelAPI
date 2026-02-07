const express = require("express");
const router = express.Router();
const { searchTravelPlace } = require("../Controllers/travelController");

router.get("/:place", searchTravelPlace);

module.exports = router;
