// routes/stories-router.js
const express = require("express");
const {
  getStories,
  getStoryBySlug,
  createStory,
  updateStory,
  deleteStory,
  seedStories,
} = require("../Controllers/storiesController");
const { asyncHandler } = require("../middleware/ErrorHandler");

const router = express.Router();

// GET /api/v1/stories - Get all travel stories
router.get("/", asyncHandler(getStories));

// POST /api/v1/stories - Create a new travel story
router.post("/", asyncHandler(createStory));

// POST /api/v1/stories/seed - Seed stories from data file (must be before /:slug)
router.post("/seed", asyncHandler(seedStories));

// GET /api/v1/stories/:slug - Get a single story by slug
router.get("/:slug", asyncHandler(getStoryBySlug));

// PUT /api/v1/stories/:slug - Update an existing story
router.put("/:slug", asyncHandler(updateStory));

// DELETE /api/v1/stories/:slug - Delete a story
router.delete("/:slug", asyncHandler(deleteStory));

module.exports = router;
