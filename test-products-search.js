const axios = require('axios');

const BASE_URL = 'https://api.viator.com/partner';
const API_KEY = 'd3e81f43-f838-4feb-b5f6-96620b821856';

async function testProductsSearch() {
  console.log('Testing /products/search endpoint...\n');

  try {
    const response = await axios.post(`${BASE_URL}/products/search`, {
      searchTerm: 'paris',
      filtering: {
        destination: '482' // Paris destination ID
      },
      pagination: {
        offset: 0,
        limit: 5
      },
      currency: 'USD'
    }, {
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'exp-api-key': API_KEY
      }
    });

    console.log('✅ SUCCESS: Products search');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ FAILED: Products search');
    console.log('Error:', error.response?.data || error.message);
  }
}

testProductsSearch().catch(console.error);
