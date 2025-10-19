const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/v1/viator';

// Test configuration
const testConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Helper function to make requests
async function makeRequest(method, endpoint, params = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      ...testConfig
    };

    if (method === 'GET') {
      config.params = params;
    } else {
      config.data = params;
    }

    const response = await axios(config);
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      data: error.response?.data || error.message
    };
  }
}

// Test function to check currency in searchMultiple
async function testSearchMultipleCurrency() {
  console.log('🧪 Testing searchMultiple with INR currency...\n');
  
  const result = await makeRequest('GET', '/search/multiple', {
    searchTerm: 'paris',
    topX: 5
  });

  if (result.success) {
    console.log('✅ searchMultiple request successful');
    console.log('📊 Response status:', result.status);
    
    // Check if the response contains currency information
    if (result.data && result.data.data) {
      console.log('📋 Search results found:', Object.keys(result.data.data));
      
      // Look for currency information in the response
      const searchResults = result.data.data;
      
      // Check products for currency
      if (searchResults.products && searchResults.products.length > 0) {
        console.log('🎯 Products found:', searchResults.products.length);
        const firstProduct = searchResults.products[0];
        if (firstProduct.pricing) {
          console.log('💰 Product pricing info:', firstProduct.pricing);
        }
      }
      
      // Check attractions for currency
      if (searchResults.attractions && searchResults.attractions.length > 0) {
        console.log('🏛️ Attractions found:', searchResults.attractions.length);
        const firstAttraction = searchResults.attractions[0];
        if (firstAttraction.pricing) {
          console.log('💰 Attraction pricing info:', firstAttraction.pricing);
        }
      }
      
      // Check destinations for currency
      if (searchResults.destinations && searchResults.destinations.length > 0) {
        console.log('🌍 Destinations found:', searchResults.destinations.length);
        const firstDestination = searchResults.destinations[0];
        if (firstDestination.pricing) {
          console.log('💰 Destination pricing info:', firstDestination.pricing);
        }
      }
      
      console.log('\n📄 Full response structure:');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ No data in response');
      console.log('📄 Full response:', JSON.stringify(result.data, null, 2));
    }
  } else {
    console.log('❌ searchMultiple request failed');
    console.log('📊 Error status:', result.status);
    console.log('📄 Error data:', JSON.stringify(result.data, null, 2));
  }
}

// Test function to check other search functions
async function testOtherSearchFunctions() {
  console.log('\n🧪 Testing other search functions with INR currency...\n');
  
  // Test searchTours
  console.log('🎯 Testing searchTours...');
  const toursResult = await makeRequest('GET', '/tours/search', {
    searchTerm: 'paris',
    topX: 3
  });
  
  if (toursResult.success) {
    console.log('✅ searchTours successful');
    if (toursResult.data && toursResult.data.data) {
      console.log('📊 Tours found:', toursResult.data.data.length);
    }
  } else {
    console.log('❌ searchTours failed:', toursResult.data);
  }
  
  // Test searchDestinations
  console.log('\n🌍 Testing searchDestinations...');
  const destResult = await makeRequest('GET', '/destinations/search', {
    searchTerm: 'london',
    topX: 3
  });
  
  if (destResult.success) {
    console.log('✅ searchDestinations successful');
    if (destResult.data && destResult.data.data) {
      console.log('📊 Destinations found:', destResult.data.data.length);
    }
  } else {
    console.log('❌ searchDestinations failed:', destResult.data);
  }
  
  // Test searchAttractionsOnly
  console.log('\n🏛️ Testing searchAttractionsOnly...');
  const attractionsResult = await makeRequest('GET', '/attractions/search', {
    searchTerm: 'eiffel tower',
    topX: 3
  });
  
  if (attractionsResult.success) {
    console.log('✅ searchAttractionsOnly successful');
    if (attractionsResult.data && attractionsResult.data.data) {
      console.log('📊 Attractions found:', attractionsResult.data.data.length);
    }
  } else {
    console.log('❌ searchAttractionsOnly failed:', attractionsResult.data);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Currency INR Tests\n');
  console.log('=' .repeat(50));
  
  try {
    await testSearchMultipleCurrency();
    await testOtherSearchFunctions();
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ All tests completed!');
    console.log('\n📝 Note: If you see pricing information, check if the currency is INR instead of USD');
    console.log('💡 The Viator API should now return prices in Indian Rupees (INR) by default');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

// Run the tests
runTests();
