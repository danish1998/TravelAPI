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

// Test function to check pagination
async function testPagination() {
  console.log('🧪 Testing searchMultiple pagination...\n');
  
  // Test with default pagination
  console.log('📄 Test 1: Default pagination (page=1, limit=20)');
  const result1 = await makeRequest('GET', '/search/multiple', {
    searchTerm: 'delhi'
  });

  if (result1.success) {
    console.log('✅ Default pagination request successful');
    console.log('📊 Response status:', result1.status);
    console.log('📋 Pagination info:', result1.data.pagination);
    console.log('📊 Data keys:', Object.keys(result1.data.data || {}));
  } else {
    console.log('❌ Default pagination request failed');
    console.log('📄 Error:', result1.data);
  }

  // Test with custom pagination
  console.log('\n📄 Test 2: Custom pagination (page=1, limit=5)');
  const result2 = await makeRequest('GET', '/search/multiple', {
    searchTerm: 'delhi',
    page: 1,
    limit: 5
  });

  if (result2.success) {
    console.log('✅ Custom pagination request successful');
    console.log('📊 Response status:', result2.status);
    console.log('📋 Pagination info:', result2.data.pagination);
    console.log('📊 Data keys:', Object.keys(result2.data.data || {}));
  } else {
    console.log('❌ Custom pagination request failed');
    console.log('📄 Error:', result2.data);
  }

  // Test with page 2
  console.log('\n📄 Test 3: Page 2 (page=2, limit=3)');
  const result3 = await makeRequest('GET', '/search/multiple', {
    searchTerm: 'delhi',
    page: 2,
    limit: 3
  });

  if (result3.success) {
    console.log('✅ Page 2 request successful');
    console.log('📊 Response status:', result3.status);
    console.log('📋 Pagination info:', result3.data.pagination);
    console.log('📊 Data keys:', Object.keys(result3.data.data || {}));
  } else {
    console.log('❌ Page 2 request failed');
    console.log('📄 Error:', result3.data);
  }

  // Test validation
  console.log('\n📄 Test 4: Validation tests');
  
  // Test invalid page
  const invalidPage = await makeRequest('GET', '/search/multiple', {
    searchTerm: 'delhi',
    page: 0
  });
  
  if (!invalidPage.success) {
    console.log('✅ Invalid page validation working:', invalidPage.data.message);
  } else {
    console.log('❌ Invalid page validation failed');
  }

  // Test invalid limit
  const invalidLimit = await makeRequest('GET', '/search/multiple', {
    searchTerm: 'delhi',
    limit: 150
  });
  
  if (!invalidLimit.success) {
    console.log('✅ Invalid limit validation working:', invalidLimit.data.message);
  } else {
    console.log('❌ Invalid limit validation failed');
  }

  // Test missing search term
  const missingTerm = await makeRequest('GET', '/search/multiple', {
    page: 1,
    limit: 10
  });
  
  if (!missingTerm.success) {
    console.log('✅ Missing search term validation working:', missingTerm.data.message);
  } else {
    console.log('❌ Missing search term validation failed');
  }
}

// Test function to check currency
async function testCurrency() {
  console.log('\n🧪 Testing currency (should be INR)...\n');
  
  const result = await makeRequest('GET', '/search/multiple', {
    searchTerm: 'delhi',
    page: 1,
    limit: 3
  });

  if (result.success) {
    console.log('✅ Currency test request successful');
    console.log('📊 Response status:', result.status);
    
    // Check if response contains currency information
    if (result.data && result.data.data) {
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
    }
  } else {
    console.log('❌ Currency test request failed');
    console.log('📄 Error:', result.data);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Pagination Tests\n');
  console.log('=' .repeat(50));
  
  try {
    await testPagination();
    await testCurrency();
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ All tests completed!');
    console.log('\n📝 Test URLs:');
    console.log('• http://localhost:8080/api/v1/viator/search/multiple?searchTerm=delhi&page=1&limit=20');
    console.log('• http://localhost:8080/api/v1/viator/search/multiple?searchTerm=delhi&page=2&limit=5');
    console.log('• http://localhost:8080/api/v1/viator/search/multiple?searchTerm=delhi&page=1&limit=3');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

// Run the tests
runTests();
