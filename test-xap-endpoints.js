// Test XAP API Endpoints
const axios = require('axios');

// XAP API Configuration
const XAP_CONFIG = {
    baseURL: 'https://test.ean.com',
    apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
    sharedSecret: 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6'
};

// Get OAuth2 access token
const getXAPToken = async () => {
    try {
        const response = await axios.post('https://test.ean.com/identity/oauth2/v3/token', 
            `grant_type=client_credentials&client_id=${XAP_CONFIG.apiKey}&client_secret=${XAP_CONFIG.sharedSecret}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        return response.data.access_token;
    } catch (error) {
        console.error('XAP token error:', error.response?.data || error.message);
        throw error;
    }
};

// Test different XAP endpoints
const testXAPEndpoints = async () => {
    console.log('🧪 Testing XAP API Endpoints');
    console.log('=============================\n');

    try {
        const accessToken = await getXAPToken();
        console.log('✅ OAuth2 token obtained successfully!');
        console.log('Token:', accessToken.substring(0, 20) + '...\n');

        // Test different possible endpoints
        const endpoints = [
            '/v3/hotels/search',
            '/v3/hotels/list',
            '/v3/properties/search',
            '/v3/hotels/offers',
            '/v3/offers/hotels',
            '/v3/search/hotels',
            '/v3/hotels',
            '/v3/properties',
            '/v3/availability',
            '/v3/rates',
            '/v3/booking',
            '/v3/content',
            '/v3/media',
            '/v3/reviews'
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Testing endpoint: ${endpoint}`);
                const response = await axios.get(`${XAP_CONFIG.baseURL}${endpoint}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'User-Agent': 'TravelAPI/1.0'
                    },
                    params: {
                        cityCode: 'NYC',
                        checkIn: '2024-12-25',
                        checkOut: '2024-12-27',
                        adults: 2
                    }
                });
                
                console.log(`✅ ${endpoint} - Status: ${response.status}`);
                console.log(`Response:`, JSON.stringify(response.data, null, 2).substring(0, 200) + '...\n');
                
            } catch (error) {
                if (error.response) {
                    console.log(`❌ ${endpoint} - Status: ${error.response.status}`);
                    console.log(`Error:`, error.response.data?.message || error.response.data?.type || 'Unknown error');
                } else {
                    console.log(`❌ ${endpoint} - Network error:`, error.message);
                }
                console.log('');
            }
        }

    } catch (error) {
        console.error('❌ XAP API test failed:', error.message);
    }
};

// Test suggestions endpoint (mentioned in your documentation)
const testSuggestionsEndpoint = async () => {
    console.log('🧪 Testing Suggestions Endpoint');
    console.log('=================================\n');

    try {
        const accessToken = await getXAPToken();
        
        // Test suggestions endpoint
        console.log('Testing /suggestions endpoint...');
        const response = await axios.get(`${XAP_CONFIG.baseURL}/suggestions`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'TravelAPI/1.0'
            },
            params: {
                query: 'New York',
                locale: 'en_US'
            }
        });
        
        console.log(`✅ /suggestions - Status: ${response.status}`);
        console.log(`Response:`, JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        if (error.response) {
            console.log(`❌ /suggestions - Status: ${error.response.status}`);
            console.log(`Error:`, error.response.data?.message || error.response.data?.type || 'Unknown error');
        } else {
            console.log(`❌ /suggestions - Network error:`, error.message);
        }
    }
};

// Run tests
const runTests = async () => {
    await testXAPEndpoints();
    console.log('\n' + '='.repeat(50) + '\n');
    await testSuggestionsEndpoint();
};

if (require.main === module) {
    runTests();
}

module.exports = { testXAPEndpoints, testSuggestionsEndpoint };
