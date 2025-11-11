// Controllers/favoritesController.js
const Favorite = require("../Models/Favourites");
const { asyncHandler } = require("../middleware/ErrorHandler");

// Add item to favorites
const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token
    const favoriteData = req.body;

    // Validate required fields
    if (!favoriteData.id || !favoriteData.type) {
      return res.status(400).json({
        success: false,
        message: "Item ID and type are required",
        example: {
          id: "125057P4",
          name: "Capital City, Churches & Forts Of Goa",
          type: "product", // or "attraction", "destination"
          destinationName: "Goa",
          price: "8998.19",
          currency: "INR",
          rating: 4.9,
          reviewCount: 15,
          duration: "6-8 hours",
          location: "Goa, India",
          description: "A view of the breath taking Forts of Goa...",
          productUrl: "https://www.viator.com/tours/Goa/...",
          images: ["https://media-cdn.tripadvisor.com/..."]
        }
      });
    }

    // Check if user already has a favorites document
    let userFavorites = await Favorite.findOne({ userId });

    if (!userFavorites) {
      // Create new favorites document for user
      userFavorites = new Favorite({
        userId,
        favorites: []
      });
    }

    // Check if item already exists in favorites
    const existingFavorite = userFavorites.favorites.find(
      fav => fav.id === favoriteData.id && fav.type === favoriteData.type
    );

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Item already exists in favorites"
      });
    }

    // Add new favorite item
    userFavorites.favorites.push({
      id: favoriteData.id,
      name: favoriteData.name || "",
      type: favoriteData.type,
      destinationName: favoriteData.destinationName || "",
      price: favoriteData.price || "",
      currency: favoriteData.currency || "INR",
      rating: favoriteData.rating || 0,
      reviewCount: favoriteData.reviewCount || 0,
      duration: favoriteData.duration || "",
      location: favoriteData.location || "",
      description: favoriteData.description || "",
      productUrl: favoriteData.productUrl || "",
      images: favoriteData.images || []
    });

    await userFavorites.save();

    res.status(201).json({
      success: true,
      message: "Item added to favorites successfully",
      data: {
        favoriteId: favoriteData.id,
        type: favoriteData.type,
        totalFavorites: userFavorites.favorites.length
      }
    });

  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while adding to favorites",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Get user's favorites
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token
    const { type, page = 1, limit = 20 } = req.query;

    // Find user's favorites
    const userFavorites = await Favorite.findOne({ userId });

    if (!userFavorites || userFavorites.favorites.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No favorites found",
        data: {
          favorites: [],
          pagination: {
            currentPage: 1,
            limit: parseInt(limit),
            totalResults: 0,
            totalPages: 0
          }
        }
      });
    }

    let filteredFavorites = userFavorites.favorites;

    // Filter by type if specified
    if (type) {
      filteredFavorites = userFavorites.favorites.filter(fav => fav.type === type);
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedFavorites = filteredFavorites.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      message: "Favorites retrieved successfully",
      data: {
        favorites: paginatedFavorites,
        pagination: {
          currentPage: pageNum,
          limit: limitNum,
          totalResults: filteredFavorites.length,
          totalPages: Math.ceil(filteredFavorites.length / limitNum),
          breakdown: {
            total: userFavorites.favorites.length,
            products: userFavorites.favorites.filter(fav => fav.type === 'product').length,
            attractions: userFavorites.favorites.filter(fav => fav.type === 'attraction').length,
            destinations: userFavorites.favorites.filter(fav => fav.type === 'destination').length
          }
        }
      }
    });

  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while retrieving favorites",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Remove item from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token
    const { id, type } = req.params;

    if (!id || !type) {
      return res.status(400).json({
        success: false,
        message: "Item ID and type are required in URL parameters"
      });
    }

    const userFavorites = await Favorite.findOne({ userId });

    if (!userFavorites) {
      return res.status(404).json({
        success: false,
        message: "No favorites found for this user"
      });
    }

    // Find and remove the item
    const initialLength = userFavorites.favorites.length;
    userFavorites.favorites = userFavorites.favorites.filter(
      fav => !(fav.id === id && fav.type === type)
    );

    if (userFavorites.favorites.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Item not found in favorites"
      });
    }

    await userFavorites.save();

    res.status(200).json({
      success: true,
      message: "Item removed from favorites successfully",
      data: {
        removedItemId: id,
        type: type,
        remainingFavorites: userFavorites.favorites.length
      }
    });

  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while removing from favorites",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Check if item is in favorites
const checkFavorite = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token
    const { id, type } = req.params;

    if (!id || !type) {
      return res.status(400).json({
        success: false,
        message: "Item ID and type are required in URL parameters"
      });
    }

    const userFavorites = await Favorite.findOne({ userId });

    if (!userFavorites) {
      return res.status(200).json({
        success: true,
        isFavorite: false,
        message: "Item not in favorites"
      });
    }

    const isFavorite = userFavorites.favorites.some(
      fav => fav.id === id && fav.type === type
    );

    res.status(200).json({
      success: true,
      isFavorite: isFavorite,
      message: isFavorite ? "Item is in favorites" : "Item not in favorites"
    });

  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while checking favorite",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Clear all favorites
const clearFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token

    const userFavorites = await Favorite.findOne({ userId });

    if (!userFavorites) {
      return res.status(404).json({
        success: false,
        message: "No favorites found for this user"
      });
    }

    userFavorites.favorites = [];
    await userFavorites.save();

    res.status(200).json({
      success: true,
      message: "All favorites cleared successfully",
      data: {
        clearedCount: userFavorites.favorites.length
      }
    });

  } catch (error) {
    console.error("Error clearing favorites:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while clearing favorites",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

module.exports = {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
  checkFavorite,
  clearFavorites
};
