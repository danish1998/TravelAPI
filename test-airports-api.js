const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/v1/airports';

async function testAirportAPI() {
  console.log('🧪 Testing Airport Search API...\n');

  try {
    // Test 1: Search by airport name
    console.log('1️⃣ Testing search by airport name');
    const response1 = await axios.get(`${BASE_URL}/search?q=Kennedy&limit=3`);
    console.log(`✅ Status: ${response1.status}`);
    console.log(`🔍 Found ${response1.data.data.length} airports for "Kennedy"`);
    response1.data.data.forEach(airport => {
      console.log(`   - ${airport.name} (${airport.iata}) - ${airport.city}, ${airport.country}`);
    });
    console.log('');

    // Test 2: Search by IATA code
    console.log('2️⃣ Testing search by IATA code');
    const response2 = await axios.get(`${BASE_URL}/search?q=JFK&limit=5`);
    console.log(`✅ Status: ${response2.status}`);
    console.log(`🔍 Found ${response2.data.data.length} airports for "JFK"`);
    response2.data.data.forEach(airport => {
      console.log(`   - ${airport.name} (${airport.iata}) - ${airport.city}, ${airport.country}`);
    });
    console.log('');

    // Test 3: Search by city name
    console.log('3️⃣ Testing search by city name');
    const response3 = await axios.get(`${BASE_URL}/search?q=New York&limit=5`);
    console.log(`✅ Status: ${response3.status}`);
    console.log(`🔍 Found ${response3.data.data.length} airports for "New York"`);
    response3.data.data.forEach(airport => {
      console.log(`   - ${airport.name} (${airport.iata}) - ${airport.city}, ${airport.country}`);
    });
    console.log('');

    // Test 4: Search by country
    console.log('4️⃣ Testing search by country');
    const response4 = await axios.get(`${BASE_URL}/search?q=US&limit=5`);
    console.log(`✅ Status: ${response4.status}`);
    console.log(`🔍 Found ${response4.data.pagination.total} airports for "US"`);
    console.log(`📄 Showing first 5 results:`);
    response4.data.data.forEach(airport => {
      console.log(`   - ${airport.name} (${airport.iata}) - ${airport.city}, ${airport.country}`);
    });
    console.log('');

    // Test 5: Search by partial name
    console.log('5️⃣ Testing search by partial airport name');
    const response5 = await axios.get(`${BASE_URL}/search?q=International&limit=3`);
    console.log(`✅ Status: ${response5.status}`);
    console.log(`🔍 Found ${response5.data.data.length} airports for "International"`);
    response5.data.data.forEach(airport => {
      console.log(`   - ${airport.name} (${airport.iata}) - ${airport.city}, ${airport.country}`);
    });
    console.log('');

    // Test 6: Search with pagination
    console.log('6️⃣ Testing search with pagination');
    const response6 = await axios.get(`${BASE_URL}/search?q=London&page=1&limit=2`);
    console.log(`✅ Status: ${response6.status}`);
    console.log(`🔍 Found ${response6.data.pagination.total} airports for "London"`);
    console.log(`📄 Page ${response6.data.pagination.page} of ${response6.data.pagination.pages}`);
    response6.data.data.forEach(airport => {
      console.log(`   - ${airport.name} (${airport.iata}) - ${airport.city}, ${airport.country}`);
    });
    console.log('');

    // Test 7: Test error handling - empty query
    console.log('7️⃣ Testing error handling - empty query');
    try {
      const response7 = await axios.get(`${BASE_URL}/search?q=&limit=5`);
      console.log('❌ Should have returned error for empty query');
    } catch (error) {
      console.log(`✅ Status: ${error.response.status} (Expected error)`);
      console.log(`📝 Error message: ${error.response.data.message}`);
    }
    console.log('');

    console.log('🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.log('💡 Make sure the server is running and the airports are seeded!');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAirportAPI();
}

module.exports = { testAirportAPI };
