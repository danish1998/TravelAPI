const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/v1/viator';

async function testPagination() {
  console.log('🧪 Testing pagination with debugging...\n');
  
  try {
    // Test page 1
    console.log('📄 Testing Page 1:');
    const page1 = await axios.get(`${BASE_URL}/search/multiple`, {
      params: {
        searchTerm: 'delhi',
        page: 1,
        limit: 3
      }
    });
    
    console.log('✅ Page 1 Response:');
    console.log('Status:', page1.status);
    console.log('Pagination:', page1.data.pagination);
    console.log('Data keys:', Object.keys(page1.data.data || {}));
    
    if (page1.data.data) {
      const data = page1.data.data;
      console.log('Products count:', data.products?.length || 0);
      console.log('Attractions count:', data.attractions?.length || 0);
      console.log('Destinations count:', data.destinations?.length || 0);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test page 2
    console.log('📄 Testing Page 2:');
    const page2 = await axios.get(`${BASE_URL}/search/multiple`, {
      params: {
        searchTerm: 'delhi',
        page: 2,
        limit: 3
      }
    });
    
    console.log('✅ Page 2 Response:');
    console.log('Status:', page2.status);
    console.log('Pagination:', page2.data.pagination);
    console.log('Data keys:', Object.keys(page2.data.data || {}));
    
    if (page2.data.data) {
      const data = page2.data.data;
      console.log('Products count:', data.products?.length || 0);
      console.log('Attractions count:', data.attractions?.length || 0);
      console.log('Destinations count:', data.destinations?.length || 0);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Compare results
    console.log('🔍 Comparing results:');
    const page1Data = page1.data.data;
    const page2Data = page2.data.data;
    
    if (page1Data.products && page2Data.products) {
      const page1ProductIds = page1Data.products.map(p => p.id || p.productCode || p.name);
      const page2ProductIds = page2Data.products.map(p => p.id || p.productCode || p.name);
      
      console.log('Page 1 Product IDs:', page1ProductIds);
      console.log('Page 2 Product IDs:', page2ProductIds);
      console.log('Products are different:', !page1ProductIds.every(id => page2ProductIds.includes(id)));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testPagination();
