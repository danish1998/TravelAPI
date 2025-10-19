// services/viatorService-final.js
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

      console.log(`Making ${method} request to: ${this.apiURL}${endpoint}`);
      console.log('Request params:', JSON.stringify(params, null, 2));

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
      currencyCode = 'INR',
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

  // Search for destinations using freetext search
  async searchDestinations(searchTerm, topX = 10, currencyCode = 'INR') {
    const searchParams = {
      searchTerm,
      searchTypes: [
        {
          searchType: 'DESTINATIONS',
          pagination: {
            offset: 0,
            limit: topX
          }
        }
      ],
      currency: currencyCode
    };

    return await this.makeRequest('/search/freetext', searchParams, 'POST');
  }

  // Search for attractions using freetext search
  async searchAttractionsOnly(searchTerm, topX = 20, currencyCode = 'INR') {
    const searchParams = {
      searchTerm,
      searchTypes: [
        {
          searchType: 'ATTRACTIONS',
          pagination: {
            offset: 0,
            limit: topX
          }
        }
      ],
      currency: currencyCode
    };

    return await this.makeRequest('/search/freetext', searchParams, 'POST');
  }

  // Search attractions by destination ID
  async searchAttractionsByDestination(destinationId, sorting = {}, pagination = {}) {
    const searchParams = {
      destinationId: parseInt(destinationId)
    };

    // Add sorting if provided
    if (sorting && Object.keys(sorting).length > 0) {
      searchParams.sorting = sorting;
    }

    // Add pagination if provided
    if (pagination && Object.keys(pagination).length > 0) {
      searchParams.pagination = pagination;
    } else {
      // Default pagination
      searchParams.pagination = {
        offset: 0,
        limit: 20
      };
    }

    return await this.makeRequest('/attractions/search', searchParams, 'POST');
  }

  // Search multiple types at once using freetext search
  async searchMultiple(searchTerm, searchTypes = ['PRODUCTS', 'ATTRACTIONS', 'DESTINATIONS'], topX = 20, currencyCode = 'INR', sortBy = 'TRAVELER_RATING') {
    const searchParams = {
      searchTerm,
      searchTypes: searchTypes.map(type => ({
        searchType: type,
        pagination: {
          offset: 0,
          limit: topX
        }
      })),
      currency: currencyCode
    };

    // Add sorting if provided
    if (sortBy) {
      searchParams.productSorting = {
        sortBy: sortBy
      };
    }

    return await this.makeRequest('/search/freetext', searchParams, 'POST');
  }

  // Get product details by ID
  async getProductDetails(productCode) {
    return await this.makeRequest(`/products/${productCode}`, {
      currencyCode: 'INR'
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

  // Get destination details
  async getDestinationDetails(destId) {
    return await this.makeRequest(`/destinations/${destId}`);
  }

  // Get all destinations
  async getAllDestinations() {
    return await this.makeRequest('/destinations');
  }

  // Get categories (mock data since this endpoint doesn't exist in official API)
  async getCategories() {
    return {
      data: [
        { id: 1, name: 'Sightseeing Tours', description: 'City tours and sightseeing' },
        { id: 2, name: 'Adventure Tours', description: 'Adventure and outdoor activities' },
        { id: 3, name: 'Cultural Tours', description: 'Museums and cultural experiences' },
        { id: 4, name: 'Food & Drink', description: 'Culinary tours and tastings' },
        { id: 5, name: 'Day Trips', description: 'Day trips and excursions' }
      ]
    };
  }

  // Get subcategories (mock data since this endpoint doesn't exist in official API)
  async getSubcategories(categoryId) {
    const subcategories = {
      1: [
        { id: 11, name: 'City Walking Tours', parentId: 1 },
        { id: 12, name: 'Bus Tours', parentId: 1 },
        { id: 13, name: 'Boat Tours', parentId: 1 }
      ],
      2: [
        { id: 21, name: 'Hiking Tours', parentId: 2 },
        { id: 22, name: 'Bike Tours', parentId: 2 },
        { id: 23, name: 'Water Sports', parentId: 2 }
      ],
      3: [
        { id: 31, name: 'Museum Tours', parentId: 3 },
        { id: 32, name: 'Historical Sites', parentId: 3 },
        { id: 33, name: 'Art Galleries', parentId: 3 }
      ],
      4: [
        { id: 41, name: 'Wine Tastings', parentId: 4 },
        { id: 42, name: 'Cooking Classes', parentId: 4 },
        { id: 43, name: 'Food Markets', parentId: 4 }
      ],
      5: [
        { id: 51, name: 'Half Day Trips', parentId: 5 },
        { id: 52, name: 'Full Day Trips', parentId: 5 },
        { id: 53, name: 'Multi Day Trips', parentId: 5 }
      ]
    };

    return {
      data: subcategories[categoryId] || []
    };
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
}

module.exports = new ViatorService();
