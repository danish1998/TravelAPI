// routes/favorites-routes.js
const express = require("express");
const {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
  checkFavorite,
  clearFavorites
} = require("../Controllers/favoritesController");
const { asyncHandler } = require("../middleware/ErrorHandler");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(verifyToken());

// Add item to favorites
// POST /api/v1/favorites
router.post("/", asyncHandler(addToFavorites));

// Get user's favorites with optional filtering and pagination
// GET /api/v1/favorites?type=product&page=1&limit=20
router.get("/", asyncHandler(getFavorites));

// Check if specific item is in favorites
// GET /api/v1/favorites/check/:id/:type
router.get("/check/:id/:type", asyncHandler(checkFavorite));

// Remove specific item from favorites
// DELETE /api/v1/favorites/:id/:type
router.delete("/:id/:type", asyncHandler(removeFromFavorites));

// Clear all favorites
// DELETE /api/v1/favorites/clear
router.delete("/clear", asyncHandler(clearFavorites));

module.exports = router;
