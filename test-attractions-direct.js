const axios = require('axios');

const BASE_URL = 'https://api.viator.com/partner';
const API_KEY = 'd3e81f43-f838-4feb-b5f6-96620b821856';

async function testAttractionsDirect() {
  console.log('Testing /attractions/search endpoint directly...\n');

  try {
    const response = await axios.post(`${BASE_URL}/attractions/search`, {
      searchTerm: 'paris',
      topX: 5,
      currencyCode: 'USD'
    }, {
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'exp-api-key': API_KEY
      }
    });

    console.log('✅ SUCCESS: Direct attractions search');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ FAILED: Direct attractions search');
    console.log('Error:', error.response?.data || error.message);
  }
}

testAttractionsDirect().catch(console.error);
