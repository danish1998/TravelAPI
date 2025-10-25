// test-favorites-api.js
const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/v1';

// You'll need to get a valid JWT token from your authentication system
// This is just an example - replace with actual token
const JWT_TOKEN = 'your-jwt-token-here';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${JWT_TOKEN}`
};

async function testFavoritesAPI() {
  console.log('🧪 Testing Favorites API...\n');

  try {
    // Test 1: Add a product to favorites
    console.log('1️⃣ Adding a product to favorites...');
    const addProductData = {
      id: "125057P4",
      name: "Capital City, Churches & Forts Of Goa, Old Goa Churches, Panaji City.",
      type: "product",
      destinationName: "Goa",
      price: "8998.19",
      currency: "INR",
      rating: 4.9,
      reviewCount: 15,
      duration: "6-8 hours",
      location: "Goa, India",
      description: "A view of the breath taking Forts of Goa and the magnificent churches of Old Goa...",
      productUrl: "https://www.viator.com/tours/Goa/CAPITAL-CITY-CHURCHES-and-FORTS-OF-GOA-OLD-GOA-CHURCHES-PANAJI-CITY/d4594-125057P4",
      images: [
        "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-100x100/07/69/3e/4c.jpg",
        "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-200x200/07/69/3e/4c.jpg"
      ]
    };

    const addResponse = await axios.post(`${BASE_URL}/favorites`, addProductData, { headers });
    console.log('✅ Product added to favorites:', addResponse.data);

    // Test 2: Add an attraction to favorites
    console.log('\n2️⃣ Adding an attraction to favorites...');
    const addAttractionData = {
      id: "6824",
      name: "Old Goa (Goa Velha)",
      type: "attraction",
      destinationName: "Goa",
      rating: 4.6,
      reviewCount: 106,
      location: "Goa, India",
      description: "Historic site with beautiful churches",
      productUrl: "https://www.viator.com/x-attractions/y/d0-a6824",
      images: [
        "https://dynamic-media-cdn.tripadvisor.com/media/attractions-content--1x-1/0b/27/71/8d.jpg"
      ]
    };

    const addAttractionResponse = await axios.post(`${BASE_URL}/favorites`, addAttractionData, { headers });
    console.log('✅ Attraction added to favorites:', addAttractionResponse.data);

    // Test 3: Get all favorites
    console.log('\n3️⃣ Getting all favorites...');
    const getFavoritesResponse = await axios.get(`${BASE_URL}/favorites`, { headers });
    console.log('✅ Favorites retrieved:', getFavoritesResponse.data);

    // Test 4: Get favorites by type
    console.log('\n4️⃣ Getting product favorites only...');
    const getProductsResponse = await axios.get(`${BASE_URL}/favorites?type=product`, { headers });
    console.log('✅ Product favorites:', getProductsResponse.data);

    // Test 5: Check if specific item is favorite
    console.log('\n5️⃣ Checking if product is in favorites...');
    const checkResponse = await axios.get(`${BASE_URL}/favorites/check/125057P4/product`, { headers });
    console.log('✅ Check result:', checkResponse.data);

    // Test 6: Remove item from favorites
    console.log('\n6️⃣ Removing product from favorites...');
    const removeResponse = await axios.delete(`${BASE_URL}/favorites/125057P4/product`, { headers });
    console.log('✅ Product removed:', removeResponse.data);

    // Test 7: Get favorites after removal
    console.log('\n7️⃣ Getting favorites after removal...');
    const getAfterRemovalResponse = await axios.get(`${BASE_URL}/favorites`, { headers });
    console.log('✅ Favorites after removal:', getAfterRemovalResponse.data);

    // Test 8: Clear all favorites
    console.log('\n8️⃣ Clearing all favorites...');
    const clearResponse = await axios.delete(`${BASE_URL}/favorites/clear`, { headers });
    console.log('✅ All favorites cleared:', clearResponse.data);

  } catch (error) {
    console.error('❌ Error testing favorites API:', error.response?.data || error.message);
  }
}

// Example of how to use the API from frontend
function generateFrontendExample() {
  console.log('\n📱 Frontend Integration Example:');
  console.log(`
// Add to favorites when user clicks favorite button
async function addToFavorites(item) {
  try {
    const response = await fetch('/api/v1/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken
      },
      body: JSON.stringify({
        id: item.productCode || item.id,
        name: item.title || item.name,
        type: 'product', // or 'attraction', 'destination'
        destinationName: item.destinationName,
        price: item.pricing?.summary?.fromPrice,
        currency: item.pricing?.summary?.currency || 'INR',
        rating: item.reviews?.combinedAverageRating,
        reviewCount: item.reviews?.totalReviews,
        duration: item.duration?.fixedDurationInMinutes ? 
          Math.round(item.duration.fixedDurationInMinutes / 60) + ' hours' : 
          item.duration?.variableDurationFromMinutes ? 
          Math.round(item.duration.variableDurationFromMinutes / 60) + ' hours' : '',
        location: item.destinationName,
        description: item.description,
        productUrl: item.productUrl,
        images: item.images?.map(img => img.variants?.[0]?.url).filter(Boolean) || []
      })
    });
    
    const result = await response.json();
    if (result.success) {
      // Update UI to show item is favorited
      updateFavoriteButton(item.id, true);
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}

// Remove from favorites
async function removeFromFavorites(id, type) {
  try {
    const response = await fetch(\`/api/v1/favorites/\${id}/\${type}\`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + userToken
      }
    });
    
    const result = await response.json();
    if (result.success) {
      // Update UI to show item is not favorited
      updateFavoriteButton(id, false);
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

// Get user's favorites
async function getUserFavorites(type = null) {
  try {
    const url = type ? \`/api/v1/favorites?type=\${type}\` : '/api/v1/favorites';
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + userToken
      }
    });
    
    const result = await response.json();
    return result.data.favorites;
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}
  `);
}

if (require.main === module) {
  testFavoritesAPI();
  generateFrontendExample();
}

module.exports = { testFavoritesAPI };
