// Controllers/viatorController.js
const viatorService = require('../services/viatorService');

// Search for tours and activities
const searchTours = async (req, res) => {
  try {
    const {
      searchTerm,
      startDate,
      endDate,
      topX = 20,
      sortBy = 'TRAVELER_RATING',
      searchTypes = 'PRODUCTS',
      currencyCode = 'INR'
    } = req.query;

    // Validate required parameters
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term (searchTerm) is required",
        example: "Use /api/v1/viator/tours/search?searchTerm=paris to search for tours in Paris"
      });
    }

    // Validate date format if provided
    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid startDate format. Use YYYY-MM-DD format"
      });
    }

    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid endDate format. Use YYYY-MM-DD format"
      });
    }

    const searchParams = {
      searchTerm,
      startDate,
      endDate,
      topX,
      sortBy,
      searchTypes: searchTypes.split(','),
      currencyCode
    };

    const result = await viatorService.searchAttractions(searchParams);

    res.status(200).json({
      success: true,
      message: "Tours and activities retrieved successfully",
      data: result,
      meta: {
        searchTerm: searchTerm,
        searchParams: searchParams
      }
    });

  } catch (error) {
    console.error("Error searching tours:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while searching tours",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Get specific tour/activity details
const getTourDetails = async (req, res) => {
  try {
    const { productCode } = req.params;

    if (!productCode) {
      return res.status(400).json({
        success: false,
        message: "Product code is required"
      });
    }

    const result = await viatorService.getProductDetails(productCode);

    res.status(200).json({
      success: true,
      message: "Tour details retrieved successfully",
      data: result
    });

  } catch (error) {
    console.error("Error getting tour details:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while getting tour details",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Get tour photos
const getTourPhotos = async (req, res) => {
  try {
    const { productCode } = req.params;

    if (!productCode) {
      return res.status(400).json({
        success: false,
        message: "Product code is required"
      });
    }

    const result = await viatorService.getProductPhotos(productCode);

    res.status(200).json({
      success: true,
      message: "Tour photos retrieved successfully",
      data: result
    });

  } catch (error) {
    console.error("Error getting tour photos:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while getting tour photos",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Get tour reviews
const getTourReviews = async (req, res) => {
  try {
    const { productCode } = req.params;
    const { topX = '1-10' } = req.query;

    if (!productCode) {
      return res.status(400).json({
        success: false,
        message: "Product code is required"
      });
    }

    const result = await viatorService.getProductReviews(productCode, topX);

    res.status(200).json({
      success: true,
      message: "Tour reviews retrieved successfully",
      data: result
    });

  } catch (error) {
    console.error("Error getting tour reviews:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while getting tour reviews",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Search destinations (cities)
const searchDestinations = async (req, res) => {
  try {
    const { searchTerm, topX = 10, currencyCode = 'USD' } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
        example: "/api/v1/viator/destinations/search?searchTerm=paris"
      });
    }

    const result = await viatorService.searchDestinations(searchTerm, topX, currencyCode);

    res.status(200).json({
      success: true,
      message: "Destinations retrieved successfully",
      data: result
    });

  } catch (error) {
    console.error("Error searching destinations:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while searching destinations",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Search attractions only
const searchAttractionsOnly = async (req, res) => {
  try {
    const { searchTerm, topX = 20, currencyCode = 'USD' } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
        example: "/api/v1/viator/attractions/search?searchTerm=eiffel tower"
      });
    }

    const result = await viatorService.searchAttractionsOnly(searchTerm, topX, currencyCode);

    res.status(200).json({
      success: true,
      message: "Attractions retrieved successfully",
      data: result
    });

  } catch (error) {
    console.error("Error searching attractions:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while searching attractions",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Search attractions by destination ID (POST)
const searchAttractionsByDestination = async (req, res) => {
  try {
    const { destinationId, sorting, pagination } = req.body;

    // Validate required parameters
    if (!destinationId) {
      return res.status(400).json({
        success: false,
        message: "destinationId is required in request body",
        example: {
          "destinationId": 479,
          "sorting": {
            "sortBy": "TRAVELER_RATING"
          },
          "pagination": {
            "offset": 0,
            "limit": 20
          }
        }
      });
    }

    // Validate destinationId is a number
    if (isNaN(destinationId)) {
      return res.status(400).json({
        success: false,
        message: "destinationId must be a valid number"
      });
    }

    const result = await viatorService.searchAttractionsByDestination(destinationId, sorting, pagination);

    res.status(200).json({
      success: true,
      message: "Attractions retrieved successfully",
      data: result
    });

  } catch (error) {
    console.error("Error searching attractions by destination:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while searching attractions by destination",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Search multiple types
const searchMultiple = async (req, res) => {
  try {
    const { 
      searchTerm, 
      page = 1, 
      limit = 20, 
      currencyCode = 'INR',
      sortBy = 'TRAVELER_RATING'
    } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
        example: "/api/v1/viator/search/multiple?searchTerm=delhi&page=1&limit=20"
      });
    }

    // Validate page and limit parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer"
      });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be a positive integer between 1 and 100"
      });
    }

    const result = await viatorService.searchMultiple(
      searchTerm, 
      pageNum, 
      limitNum, 
      currencyCode, 
      sortBy
    );

    res.status(200).json({
      success: true,
      message: "Search results retrieved successfully",
      data: result,
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        totalResults: result.totalResults || 0,
        totalPages: Math.ceil((result.totalResults || 0) / limitNum)
      }
    });

  } catch (error) {
    console.error("Error searching multiple types:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while searching",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Get destination details
const getDestinationDetails = async (req, res) => {
  try {
    const { destId } = req.params;

    if (!destId) {
      return res.status(400).json({
        success: false,
        message: "Destination ID is required"
      });
    }

    const result = await viatorService.getDestinationDetails(destId);

    res.status(200).json({
      success: true,
      message: "Destination details retrieved successfully",
      data: result
    });

  } catch (error) {
    console.error("Error getting destination details:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while getting destination details",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    const result = await viatorService.getCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: result
    });

  } catch (error) {
    console.error("Error getting categories:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while getting categories",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Get subcategories
const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }

    const result = await viatorService.getSubcategories(categoryId);

    res.status(200).json({
      success: true,
      message: "Subcategories retrieved successfully",
      data: result
    });

  } catch (error) {
    console.error("Error getting subcategories:", error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "Viator API error";
      
      return res.status(statusCode).json({
        success: false,
        message: `Viator API Error: ${errorMessage}`,
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while getting subcategories",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};

// Helper function to validate date format
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

module.exports = {
  searchTours,
  getTourDetails,
  getTourPhotos,
  getTourReviews,
  searchDestinations,
  searchAttractionsOnly,
  searchAttractionsByDestination,
  searchMultiple,
  getDestinationDetails,
  getCategories,
  getSubcategories
};
