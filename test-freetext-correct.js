const axios = require('axios');

const BASE_URL = 'https://api.viator.com/partner';
const API_KEY = 'd3e81f43-f838-4feb-b5f6-96620b821856';

async function testFreetextSearch() {
  console.log('Testing /search/freetext endpoint with correct format...\n');

  try {
    const response = await axios.post(`${BASE_URL}/search/freetext`, {
      searchTerm: 'paris',
      searchTypes: [
        {
          searchType: 'PRODUCTS',
          pagination: {
            offset: 0,
            limit: 5
          }
        }
      ],
      currency: 'USD'
    }, {
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'exp-api-key': API_KEY
      }
    });

    console.log('✅ SUCCESS: Freetext search with PRODUCTS');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ FAILED: Freetext search with PRODUCTS');
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n---\n');

  try {
    const response = await axios.post(`${BASE_URL}/search/freetext`, {
      searchTerm: 'paris',
      searchTypes: [
        {
          searchType: 'DESTINATIONS',
          pagination: {
            offset: 0,
            limit: 5
          }
        }
      ],
      currency: 'USD'
    }, {
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'exp-api-key': API_KEY
      }
    });

    console.log('✅ SUCCESS: Freetext search with DESTINATIONS');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ FAILED: Freetext search with DESTINATIONS');
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n---\n');

  try {
    const response = await axios.post(`${BASE_URL}/search/freetext`, {
      searchTerm: 'eiffel tower',
      searchTypes: [
        {
          searchType: 'ATTRACTIONS',
          pagination: {
            offset: 0,
            limit: 5
          }
        }
      ],
      currency: 'USD'
    }, {
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'exp-api-key': API_KEY
      }
    });

    console.log('✅ SUCCESS: Freetext search with ATTRACTIONS');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ FAILED: Freetext search with ATTRACTIONS');
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n---\n');

  try {
    const response = await axios.post(`${BASE_URL}/search/freetext`, {
      searchTerm: 'london',
      searchTypes: [
        {
          searchType: 'PRODUCTS',
          pagination: {
            offset: 0,
            limit: 3
          }
        },
        {
          searchType: 'DESTINATIONS',
          pagination: {
            offset: 0,
            limit: 3
          }
        },
        {
          searchType: 'ATTRACTIONS',
          pagination: {
            offset: 0,
            limit: 3
          }
        }
      ],
      currency: 'USD'
    }, {
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'exp-api-key': API_KEY
      }
    });

    console.log('✅ SUCCESS: Freetext search with multiple types');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ FAILED: Freetext search with multiple types');
    console.log('Error:', error.response?.data || error.message);
  }
}

testFreetextSearch().catch(console.error);
