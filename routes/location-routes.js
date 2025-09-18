const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { default: location } = require("../Controllers/locationController");

const router = express.Router();

// If a valid token cookie already exists, login returns the current user
router.get("/find", location);

module.exports = router;
