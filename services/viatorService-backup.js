// services/viatorService.js
const axios = require('axios');

class ViatorService {
  constructor() {
    this.apiKey = process.env.VIATOR_API_KEY || 'd3e81f43-f838-4feb-b5f6-96620b821856';
    this.baseURL = 'https://api.viator.com/partner';
    this.sandboxURL = 'https://api.sandbox.viator.com/partner';
    // Use production URL since the key is active
    this.apiURL = this.baseURL;
  }

  // Helper method to make API requests
  async makeRequest(endpoint, params = {}, method = 'GET') {
    try {
      const config = {
        method,
        url: `${this.apiURL}${endpoint}`,
        headers: {
          'Accept': 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          'Content-Type': 'application/json',
          'exp-api-key': this.apiKey
        }
      };

      if (method === 'GET') {
        config.params = params;
      } else {
        config.data = params;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Viator API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Search for products (tours and activities) by city name
  async searchAttractions(params) {
    const {
      searchTerm,
      topX = 20,
      startDate,
      endDate,
      sortBy = 'TRAVELER_RATING',
      currencyCode = 'USD',
      destinationId = '482' // Default to Paris
    } = params;

    const searchParams = {
      searchTerm,
      filtering: {
        destination: destinationId
      },
      pagination: {
        offset: 0,
        limit: topX
      },
      currency: currencyCode
    };

    // Add date range if provided
    if (startDate && endDate) {
      searchParams.filtering.dateRange = {
        from: startDate,
        to: endDate
      };
    }

    // Add sorting if provided
    if (sortBy) {
      searchParams.sorting = {
        sortBy: sortBy
      };
    }

    return await this.makeRequest('/products/search', searchParams, 'POST');
  }

  // Mock data for testing when Viator API is not available
  getMockAttractionsData(params) {
    return {
      data: [
        {
          id: 1,
          name: "Eiffel Tower Skip-the-Line Tour",
          description: "Skip the long lines and enjoy priority access to the iconic Eiffel Tower",
          price: { amount: 45.00, currency: "USD" },
          rating: 4.5,
          imageUrl: "https://example.com/eiffel-tower.jpg",
          duration: "2 hours",
          category: "Sightseeing",
          location: "Paris, France"
        },
        {
          id: 2,
          name: "Louvre Museum Guided Tour",
          description: "Explore the world's largest art museum with an expert guide",
          price: { amount: 65.00, currency: "USD" },
          rating: 4.7,
          imageUrl: "https://example.com/louvre.jpg",
          duration: "3 hours",
          category: "Museums",
          location: "Paris, France"
        },
        {
          id: 3,
          name: "Seine River Cruise",
          description: "Relax on a scenic cruise along the beautiful Seine River",
          price: { amount: 25.00, currency: "USD" },
          rating: 4.3,
          imageUrl: "https://example.com/seine-cruise.jpg",
          duration: "1 hour",
          category: "Cruises",
          location: "Paris, France"
        }
      ],
      pagination: {
        totalResults: 3,
        currentPage: 1,
        totalPages: 1
      },
      meta: {
        destination: "Paris, France",
        searchParams: params
      }
    };
  }

  // Search for products/activities (alternative method)
  async searchProducts(params) {
    return await this.searchAttractions(params);
  }

  // Search for destinations (cities)
  async searchDestinations(searchTerm, topX = 10, currencyCode = 'USD') {
    const searchParams = {
      searchTerm,
      searchTypes: ['DESTINATIONS'],
      pagination: {
        offset: 0,
        limit: topX
      },
      currency: currencyCode
    };

    return await this.makeRequest('/search/freetext', searchParams, 'POST');
  }

  // Search for attractions
  async searchAttractionsOnly(searchTerm, topX = 20, currencyCode = 'USD') {
    const searchParams = {
      searchTerm,
      searchTypes: ['ATTRACTIONS'],
      pagination: {
        offset: 0,
        limit: topX
      },
      currency: currencyCode
    };

    return await this.makeRequest('/search/freetext', searchParams, 'POST');
  }

  // Search multiple types at once
  async searchMultiple(searchTerm, searchTypes = ['PRODUCTS', 'ATTRACTIONS', 'DESTINATIONS'], topX = 20, currencyCode = 'USD', sortBy = 'TRAVELER_RATING') {
    const searchParams = {
      searchTerm,
      searchTypes,
      pagination: {
        offset: 0,
        limit: topX
      },
      currency: currencyCode,
      sorting: {
        sortBy: sortBy
      }
    };

    return await this.makeRequest('/search/freetext', searchParams, 'POST');
  }

  // Get product details by ID
  async getProductDetails(productCode) {
    return await this.makeRequest(`/products/${productCode}`, {
      currencyCode: 'USD'
    });
  }

  // Get product photos
  async getProductPhotos(productCode) {
    return await this.makeRequest(`/products/${productCode}/photos`);
  }

  // Get product reviews
  async getProductReviews(productCode, topX = 10) {
    return await this.makeRequest(`/products/${productCode}/reviews`, {
      topX
    });
  }

  // Search destinations
  async searchDestinations(searchText) {
    return await this.makeRequest('/destinations/search', {
      searchText
    });
  }

  // Get destination details
  async getDestinationDetails(destId) {
    return await this.makeRequest(`/destinations/${destId}`);
  }

  // Get categories
  async getCategories() {
    return await this.makeRequest('/categories');
  }

  // Get subcategories
  async getSubcategories(categoryId) {
    return await this.makeRequest(`/categories/${categoryId}/subcategories`);
  }
}

module.exports = new ViatorService();