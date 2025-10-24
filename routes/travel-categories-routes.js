const express = require("express");
const { searchByCategory, getAllCategories, getDestinationsByCategory } = require("../Controllers/travelCategoriesController");

const router = express.Router();

// GET /api/v1/travel-categories/search?category=beach escape&city=Mumbai&radius=500&limit=5
router.get("/search", searchByCategory);

// GET /api/v1/travel-categories/categories
router.get("/categories", getAllCategories);

// GET /api/v1/travel-categories/destinations/:category?limit=5
router.get("/destinations/:category", getDestinationsByCategory);

module.exports = router;
