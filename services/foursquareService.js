const fetch = require('node-fetch');

// Foursquare API configuration
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY || 'V53Y2QJCHXRMOTX1ETDDIL5VZXD4OWXGP0NRD2K2JTT3XAOX';
const FOURSQUARE_CLIENT_SECRET = process.env.FOURSQUARE_CLIENT_SECRET || 'JBZPTFZNDZK3CPBCOMBUZDSW0GQUMKKR21GMO2AXKI5RMTPR';
const FOURSQUARE_CLIENT_ID = process.env.FOURSQUARE_CLIENT_ID || 'IERRYSGIQAUOOEDLXQERD4QGCM3NHXP5HYC5DYUNJFZOBEC2';

const BASE_URL = 'https://places-api.foursquare.com';

/**
 * Search for places using Foursquare API
 * @param {string} query - Search query
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default: 1000)
 * @param {string} categories - Comma-separated category IDs
 * @param {number} limit - Number of results (default: 20, max: 50)
 * @param {string} sort - Sort order (DISTANCE, POPULARITY, RATING)
 * @returns {Object} Foursquare API response
 */
const searchPlaces = async (query, lat, lng, radius = 1000, categories = null, limit = 20, sort = 'DISTANCE') => {
  try {
    const params = new URLSearchParams({
      query: query || '',
      ll: `${lat},${lng}`,
      radius: Math.min(radius, 100000), // Max 100km
      limit: Math.min(limit, 50), // Max 50 results
      sort: sort
    });

    if (categories) {
      params.append('categories', categories);
    }

    const url = `${BASE_URL}/places/search?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Places-Api-Version': '2025-06-17',
        'Accept': 'application/json',
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Foursquare search error:', error);
    throw error;
  }
};

/**
 * Get place details by Foursquare ID
 * @param {string} fsqId - Foursquare place ID
 * @param {Array} fields - Fields to include in response
 * @returns {Object} Place details
 */
const getPlaceDetails = async (fsqId, fields = ['name', 'location', 'rating', 'price', 'photos', 'tips', 'hours', 'categories']) => {
  try {
    const params = new URLSearchParams({
      fields: fields.join(',')
    });

    const url = `${BASE_URL}/places/${fsqId}?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Places-Api-Version': '2025-06-17',
        'Accept': 'application/json',
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Foursquare place details error:', error);
    throw error;
  }
};

/**
 * Get nearby places (uses search endpoint with empty query)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default: 1000)
 * @param {string} categories - Comma-separated category IDs
 * @param {number} limit - Number of results (default: 20)
 * @returns {Object} Nearby places
 */
const getNearbyPlaces = async (lat, lng, radius = 1000, categories = null, limit = 20) => {
  try {
    // Use search endpoint with empty query to get nearby places
    return await searchPlaces('', lat, lng, radius, categories, limit, 'DISTANCE');
  } catch (error) {
    console.error('Foursquare nearby places error:', error);
    throw error;
  }
};

/**
 * Get place photos
 * @param {string} fsqId - Foursquare place ID
 * @param {number} limit - Number of photos (default: 10)
 * @returns {Object} Place photos
 */
const getPlacePhotos = async (fsqId, limit = 10) => {
  try {
    const params = new URLSearchParams({
      limit: Math.min(limit, 50)
    });

    const url = `${BASE_URL}/places/${fsqId}/photos?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Places-Api-Version': '2025-06-17',
        'Accept': 'application/json',
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Foursquare place photos error:', error);
    throw error;
  }
};

/**
 * Get place tips/reviews
 * @param {string} fsqId - Foursquare place ID
 * @param {number} limit - Number of tips (default: 10)
 * @returns {Object} Place tips
 */
const getPlaceTips = async (fsqId, limit = 10) => {
  try {
    const params = new URLSearchParams({
      limit: Math.min(limit, 50)
    });

    const url = `${BASE_URL}/places/${fsqId}/tips?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Places-Api-Version': '2025-06-17',
        'Accept': 'application/json',
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Foursquare place tips error:', error);
    throw error;
  }
};

/**
 * Get popular places in a city
 * @param {string} city - City name
 * @param {string} categories - Comma-separated category IDs
 * @param {number} limit - Number of results (default: 20)
 * @returns {Object} Popular places
 */
const getPopularPlaces = async (city, categories = null, limit = 20) => {
  try {
    const params = new URLSearchParams({
      near: city,
      limit: Math.min(limit, 50),
      sort: 'POPULARITY'
    });

    if (categories) {
      params.append('categories', categories);
    }

    const url = `${BASE_URL}/places/search?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Places-Api-Version': '2025-06-17',
        'Accept': 'application/json',
        'Authorization': `Bearer ${FOURSQUARE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Foursquare popular places error:', error);
    throw error;
  }
};

/**
 * Get place categories (static data since API doesn't provide this endpoint)
 * @returns {Object} Available categories
 */
const getCategories = async () => {
  try {
    // Return static categories since Foursquare Places API doesn't have a categories endpoint
    const staticCategories = {
      results: [
        { id: "13000", name: "Restaurant", short_name: "Restaurant", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/food/", suffix: ".png" } },
        { id: "13001", name: "Fast Food", short_name: "Fast Food", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/food/", suffix: ".png" } },
        { id: "13002", name: "Café", short_name: "Café", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/food/", suffix: ".png" } },
        { id: "13003", name: "Bar", short_name: "Bar", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/nightlife/", suffix: ".png" } },
        { id: "13004", name: "Hotel", short_name: "Hotel", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/travel/", suffix: ".png" } },
        { id: "13005", name: "Shopping Mall", short_name: "Mall", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/shops/", suffix: ".png" } },
        { id: "13006", name: "Gas Station", short_name: "Gas", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/travel/", suffix: ".png" } },
        { id: "13007", name: "ATM", short_name: "ATM", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/finance/", suffix: ".png" } },
        { id: "13008", name: "Bank", short_name: "Bank", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/finance/", suffix: ".png" } },
        { id: "13009", name: "Hospital", short_name: "Hospital", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/health/", suffix: ".png" } },
        { id: "13010", name: "Pharmacy", short_name: "Pharmacy", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/health/", suffix: ".png" } },
        { id: "13011", name: "Gym", short_name: "Gym", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/arts_entertainment/", suffix: ".png" } },
        { id: "13012", name: "Movie Theater", short_name: "Cinema", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/arts_entertainment/", suffix: ".png" } },
        { id: "13013", name: "Museum", short_name: "Museum", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/arts_entertainment/", suffix: ".png" } },
        { id: "13014", name: "Park", short_name: "Park", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/parks_outdoors/", suffix: ".png" } },
        { id: "13015", name: "Beach", short_name: "Beach", icon: { prefix: "https://ss3.4sqi.net/img/categories_v2/parks_outdoors/", suffix: ".png" } }
      ]
    };
    
    return staticCategories;
  } catch (error) {
    console.error('Foursquare categories error:', error);
    throw error;
  }
};

module.exports = {
  searchPlaces,
  getPlaceDetails,
  getNearbyPlaces,
  getPlacePhotos,
  getPlaceTips,
  getPopularPlaces,
  getCategories
};
