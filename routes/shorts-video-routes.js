const express = require("express");
const { getShortsVideo } = require("../Controllers/shortsVideoController");
const { asyncHandler } = require("../middleware/ErrorHandler");

const router = express.Router();

// GET /api/v1/shorts/video/:city - Get shorts videos for a specific city
router.get("/video/:city", asyncHandler(getShortsVideo));

module.exports = router;
