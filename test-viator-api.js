const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/v1/viator';

// Test configuration
const testConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test data
const testData = {
  searchTerms: ['paris', 'london', 'new york', 'tokyo'],
  productCodes: ['12345', '67890', '11111'],
  destinationIds: ['482', '1', '2'],
  categoryIds: ['1', '2', '3']
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

// Test functions
async function testToursSearch() {
  console.log('\n🔍 Testing Tours Search Endpoint');
  console.log('================================');
  
  const testCases = [
    {
      name: 'Basic search - Paris',
      params: { searchTerm: 'paris' }
    },
    {
      name: 'Search with date range',
      params: { 
        searchTerm: 'paris', 
        startDate: '2024-06-01', 
        endDate: '2024-06-07' 
      }
    },
    {
      name: 'Search with custom parameters',
      params: { 
        searchTerm: 'london', 
        topX: 5, 
        sortBy: 'TRAVELER_RATING',
        currencyCode: 'USD'
      }
    },
    {
      name: 'Search without searchTerm (should fail)',
      params: { topX: 10 }
    },
    {
      name: 'Search with invalid date format',
      params: { 
        searchTerm: 'paris', 
        startDate: 'invalid-date' 
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    const result = await makeRequest('GET', '/tours/search', testCase.params);
    
    if (result.success) {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testDestinationsSearch() {
  console.log('\n🌍 Testing Destinations Search Endpoint');
  console.log('=====================================');
  
  const testCases = [
    {
      name: 'Search for Paris',
      params: { searchTerm: 'paris' }
    },
    {
      name: 'Search for London',
      params: { searchTerm: 'london', topX: 5 }
    },
    {
      name: 'Search without searchTerm (should fail)',
      params: { topX: 10 }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    const result = await makeRequest('GET', '/destinations/search', testCase.params);
    
    if (result.success) {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testAttractionsSearch() {
  console.log('\n🏛️ Testing Attractions Search Endpoint');
  console.log('====================================');
  
  const testCases = [
    {
      name: 'Search for Eiffel Tower',
      params: { searchTerm: 'eiffel tower' }
    },
    {
      name: 'Search for Big Ben',
      params: { searchTerm: 'big ben', topX: 10 }
    },
    {
      name: 'Search without searchTerm (should fail)',
      params: { topX: 5 }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    const result = await makeRequest('GET', '/attractions/search', testCase.params);
    
    if (result.success) {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testMultipleSearch() {
  console.log('\n🔍 Testing Multiple Search Endpoint');
  console.log('==================================');
  
  const testCases = [
    {
      name: 'Search multiple types - London',
      params: { 
        searchTerm: 'london', 
        searchTypes: 'PRODUCTS,ATTRACTIONS' 
      }
    },
    {
      name: 'Search all types - Paris',
      params: { 
        searchTerm: 'paris', 
        searchTypes: 'PRODUCTS,ATTRACTIONS,DESTINATIONS',
        topX: 10
      }
    },
    {
      name: 'Search without searchTerm (should fail)',
      params: { searchTypes: 'PRODUCTS' }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    const result = await makeRequest('GET', '/search/multiple', testCase.params);
    
    if (result.success) {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testTourDetails() {
  console.log('\n📋 Testing Tour Details Endpoint');
  console.log('===============================');
  
  const testCases = [
    {
      name: 'Get details for product 12345',
      productCode: '12345'
    },
    {
      name: 'Get details for product 67890',
      productCode: '67890'
    },
    {
      name: 'Get details without productCode (should fail)',
      productCode: ''
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    const endpoint = testCase.productCode ? `/tours/${testCase.productCode}` : '/tours/';
    const result = await makeRequest('GET', endpoint);
    
    if (result.success) {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testTourPhotos() {
  console.log('\n📸 Testing Tour Photos Endpoint');
  console.log('==============================');
  
  const testCases = [
    {
      name: 'Get photos for product 12345',
      productCode: '12345'
    },
    {
      name: 'Get photos for product 67890',
      productCode: '67890'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    const result = await makeRequest('GET', `/tours/${testCase.productCode}/photos`);
    
    if (result.success) {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testTourReviews() {
  console.log('\n⭐ Testing Tour Reviews Endpoint');
  console.log('===============================');
  
  const testCases = [
    {
      name: 'Get reviews for product 12345',
      productCode: '12345'
    },
    {
      name: 'Get reviews with custom topX',
      productCode: '12345',
      params: { topX: '1-5' }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    const result = await makeRequest('GET', `/tours/${testCase.productCode}/reviews`, testCase.params || {});
    
    if (result.success) {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testDestinationDetails() {
  console.log('\n🏙️ Testing Destination Details Endpoint');
  console.log('======================================');
  
  const testCases = [
    {
      name: 'Get details for destination 482',
      destId: '482'
    },
    {
      name: 'Get details for destination 1',
      destId: '1'
    },
    {
      name: 'Get details without destId (should fail)',
      destId: ''
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    const endpoint = testCase.destId ? `/destinations/${testCase.destId}` : '/destinations/';
    const result = await makeRequest('GET', endpoint);
    
    if (result.success) {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testCategories() {
  console.log('\n📂 Testing Categories Endpoint');
  console.log('=============================');
  
  const result = await makeRequest('GET', '/categories');
  
  if (result.success) {
    console.log(`✅ Status: ${result.status}`);
    console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
  } else {
    console.log(`❌ Status: ${result.status}`);
    console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
  }
}

async function testSubcategories() {
  console.log('\n📁 Testing Subcategories Endpoint');
  console.log('=================================');
  
  const testCases = [
    {
      name: 'Get subcategories for category 1',
      categoryId: '1'
    },
    {
      name: 'Get subcategories for category 2',
      categoryId: '2'
    },
    {
      name: 'Get subcategories without categoryId (should fail)',
      categoryId: ''
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    const endpoint = testCase.categoryId ? `/categories/${testCase.categoryId}/subcategories` : '/categories//subcategories';
    const result = await makeRequest('GET', endpoint);
    
    if (result.success) {
      console.log(`✅ Status: ${result.status}`);
      console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`💥 Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Viator API Tests');
  console.log('============================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    await testToursSearch();
    await testDestinationsSearch();
    await testAttractionsSearch();
    await testMultipleSearch();
    await testTourDetails();
    await testTourPhotos();
    await testTourReviews();
    await testDestinationDetails();
    await testCategories();
    await testSubcategories();
    
    console.log('\n🎉 All tests completed!');
    console.log('======================');
    
  } catch (error) {
    console.error('\n💥 Test runner error:', error);
  }
}

// Run the tests
runAllTests();
