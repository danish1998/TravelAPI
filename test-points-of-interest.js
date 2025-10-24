// Test file for Points of Interest API
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8080/api/v1/points-of-interest';

// Test function to search points of interest by coordinates
async function testSearchPointsOfInterest() {
  console.log('🔍 Testing Points of Interest Search by Coordinates...');
  
  try {
    // Example: Search for sights near Times Square, New York
    const params = new URLSearchParams({
      latitude: '40.7589',
      longitude: '-73.9851',
      radius: '5',
      category: 'SIGHTS',
      page_limit: '5'
    });

    const response = await fetch(`${BASE_URL}/search?${params}`);
    const data = await response.json();

    console.log('✅ Search Results:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error testing search:', error.message);
  }
}

// Test function to search points of interest by square
async function testSearchBySquare() {
  console.log('\n🔍 Testing Points of Interest Search by Square...');
  
  try {
    // Example: Search for restaurants in a square area around Central Park
    const params = new URLSearchParams({
      north: '40.7851',
      west: '-73.9730',
      south: '40.7648',
      east: '-73.9585',
      category: 'RESTAURANT',
      page_limit: '3'
    });

    const response = await fetch(`${BASE_URL}/search-by-square?${params}`);
    const data = await response.json();

    console.log('✅ Square Search Results:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error testing square search:', error.message);
  }
}

// Test function to get point of interest by ID
async function testGetPointOfInterestById() {
  console.log('\n🔍 Testing Get Point of Interest by ID...');
  
  try {
    // Note: You'll need to get a valid POI ID from a search first
    const poiId = 'Q9304'; // Example POI ID (this might not exist)
    
    const response = await fetch(`${BASE_URL}/${poiId}`);
    const data = await response.json();

    console.log('✅ POI Details:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error testing get by ID:', error.message);
  }
}

// Test function to validate error handling
async function testErrorHandling() {
  console.log('\n🔍 Testing Error Handling...');
  
  try {
    // Test with invalid parameters
    const params = new URLSearchParams({
      latitude: 'invalid',
      longitude: 'invalid'
    });

    const response = await fetch(`${BASE_URL}/search?${params}`);
    const data = await response.json();

    console.log('✅ Error Response (Expected):');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Points of Interest API Tests...\n');
  
  await testSearchPointsOfInterest();
  await testSearchBySquare();
  await testGetPointOfInterestById();
  await testErrorHandling();
  
  console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testSearchPointsOfInterest,
  testSearchBySquare,
  testGetPointOfInterestById,
  testErrorHandling,
  runAllTests
};
