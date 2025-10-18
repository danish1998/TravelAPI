const axios = require('axios');

const BASE_URL = 'https://api.viator.com/partner';
const API_KEY = 'd3e81f43-f838-4feb-b5f6-96620b821856';

async function testSearchTypes() {
  console.log('Testing different search type formats...\n');

  const testCases = [
    {
      name: 'String format',
      searchTypes: 'ATTRACTIONS'
    },
    {
      name: 'Array format',
      searchTypes: ['ATTRACTIONS']
    },
    {
      name: 'Object format',
      searchTypes: { type: 'ATTRACTIONS' }
    },
    {
      name: 'Enum format',
      searchTypes: 'ATTRACTION'
    },
    {
      name: 'Lowercase format',
      searchTypes: ['attractions']
    }
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const response = await axios.post(`${BASE_URL}/search/freetext`, {
        searchTerm: 'paris',
        searchTypes: testCase.searchTypes,
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

      console.log(`✅ SUCCESS: ${testCase.name}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      break; // If successful, stop testing
    } catch (error) {
      console.log(`❌ FAILED: ${testCase.name}`);
      console.log('Error:', error.response?.data?.message || error.message);
    }
    console.log('---\n');
  }
}

testSearchTypes().catch(console.error);
