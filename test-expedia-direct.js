const axios = require('axios');
const crypto = require('crypto');

// Test Expedia API directly with proper authentication
const testExpediaAPI = async () => {
    console.log('🔍 Testing Expedia API Directly...');
    
    const EXPEDIA_CONFIG = {
        baseURL: 'https://test.ean.com',
        clientId: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
        clientSecret: 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6',
        tokenURL: 'https://test.ean.com/identity/oauth2/v3/token?grant_type=client_credentials',
        apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b'
    };
    
    try {
        // Step 1: Get OAuth token
        console.log('1. Getting OAuth token...');
        const credentials = Buffer.from(`${EXPEDIA_CONFIG.clientId}:${EXPEDIA_CONFIG.clientSecret}`).toString('base64');
        
        const tokenResponse = await axios.post(EXPEDIA_CONFIG.tokenURL, 
            'grant_type=client_credentials',
            {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        console.log('✅ OAuth token obtained');
        const accessToken = tokenResponse.data.access_token;
        
        // Step 2: Test Geography API
        console.log('\n2. Testing Geography API...');
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = crypto.createHmac('sha512', EXPEDIA_CONFIG.clientSecret).update(`${EXPEDIA_CONFIG.apiKey}${timestamp}`).digest('hex');
        
        const geographyResponse = await axios.get(`${EXPEDIA_CONFIG.baseURL}/v3/regions`, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'Authorization': `Bearer ${accessToken}`,
                'apikey': EXPEDIA_CONFIG.apiKey,
                'signature': signature,
                'timestamp': timestamp.toString(),
                'User-Agent': 'TravelAPI/1.0'
            },
            params: {
                region_type: 'city',
                search_query: 'DEL',
                language: 'en-US'
            }
        });
        
        console.log('✅ Geography API response:');
        console.log('Status:', geographyResponse.status);
        console.log('Data:', JSON.stringify(geographyResponse.data, null, 2));
        
        if (geographyResponse.data && geographyResponse.data.regions && geographyResponse.data.regions.length > 0) {
            const regionId = geographyResponse.data.regions[0].region_id;
            console.log(`Found region ID: ${regionId}`);
            
            // Step 3: Test Properties API
            console.log('\n3. Testing Properties API...');
            const timestamp2 = Math.floor(Date.now() / 1000);
            const signature2 = crypto.createHmac('sha512', EXPEDIA_CONFIG.clientSecret).update(`${EXPEDIA_CONFIG.apiKey}${timestamp2}`).digest('hex');
            
            const propertiesResponse = await axios.get(`${EXPEDIA_CONFIG.baseURL}/v3/properties`, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': `Bearer ${accessToken}`,
                    'apikey': EXPEDIA_CONFIG.apiKey,
                    'signature': signature2,
                    'timestamp': timestamp2.toString(),
                    'User-Agent': 'TravelAPI/1.0'
                },
                params: {
                    region_id: regionId,
                    language: 'en-US'
                }
            });
            
            console.log('✅ Properties API response:');
            console.log('Status:', propertiesResponse.status);
            console.log('Data:', JSON.stringify(propertiesResponse.data, null, 2));
            
            if (propertiesResponse.data && propertiesResponse.data.properties && propertiesResponse.data.properties.length > 0) {
                const propertyIds = propertiesResponse.data.properties.slice(0, 3).map(prop => prop.property_id);
                console.log(`Found property IDs: ${propertyIds.join(', ')}`);
                
                // Step 4: Test Shopping API
                console.log('\n4. Testing Shopping API...');
                const timestamp3 = Math.floor(Date.now() / 1000);
                const signature3 = crypto.createHmac('sha512', EXPEDIA_CONFIG.clientSecret).update(`${EXPEDIA_CONFIG.apiKey}${timestamp3}`).digest('hex');
                
                const shoppingResponse = await axios.get(`${EXPEDIA_CONFIG.baseURL}/v3/shopping`, {
                    headers: {
                        'Accept': 'application/json',
                        'Accept-Encoding': 'gzip',
                        'Authorization': `Bearer ${accessToken}`,
                        'apikey': EXPEDIA_CONFIG.apiKey,
                        'signature': signature3,
                        'timestamp': timestamp3.toString(),
                        'User-Agent': 'TravelAPI/1.0'
                    },
                    params: {
                        property_ids: propertyIds.join(','),
                        checkin: '2024-12-25',
                        checkout: '2024-12-27',
                        occupancy: 2,
                        language: 'en-US',
                        currency: 'USD',
                        country_code: 'US',
                        sales_channel: 'website',
                        sales_environment: 'hotel_only',
                        rate_plan_count: 1
                    }
                });
                
                console.log('✅ Shopping API response:');
                console.log('Status:', shoppingResponse.status);
                console.log('Data:', JSON.stringify(shoppingResponse.data, null, 2));
                
            } else {
                console.log('❌ No properties found in region');
            }
            
        } else {
            console.log('❌ No regions found for DEL');
        }
        
    } catch (error) {
        console.log('❌ Expedia API test failed');
        console.log('Error status:', error.response?.status);
        console.log('Error data:', JSON.stringify(error.response?.data, null, 2));
        console.log('Error message:', error.message);
    }
};

// Test with different endpoints
const testAlternativeEndpoints = async () => {
    console.log('\n🔄 Testing Alternative Endpoints...');
    
    const EXPEDIA_CONFIG = {
        baseURL: 'https://test.ean.com',
        clientId: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
        clientSecret: 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6',
        tokenURL: 'https://test.ean.com/identity/oauth2/v3/token?grant_type=client_credentials',
        apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b'
    };
    
    try {
        // Get OAuth token
        const credentials = Buffer.from(`${EXPEDIA_CONFIG.clientId}:${EXPEDIA_CONFIG.clientSecret}`).toString('base64');
        const tokenResponse = await axios.post(EXPEDIA_CONFIG.tokenURL, 
            'grant_type=client_credentials',
            {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        const accessToken = tokenResponse.data.access_token;
        
        // Test different API versions and endpoints
        const endpoints = [
            '/v3/regions',
            '/v3/properties',
            '/v3/shopping',
            '/v2/regions',
            '/v2/properties',
            '/v2/shopping'
        ];
        
        for (const endpoint of endpoints) {
            console.log(`\nTesting endpoint: ${endpoint}`);
            
            try {
                const timestamp = Math.floor(Date.now() / 1000);
                const signature = crypto.createHmac('sha512', EXPEDIA_CONFIG.clientSecret).update(`${EXPEDIA_CONFIG.apiKey}${timestamp}`).digest('hex');
                
                const response = await axios.get(`${EXPEDIA_CONFIG.baseURL}${endpoint}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Accept-Encoding': 'gzip',
                        'Authorization': `Bearer ${accessToken}`,
                        'apikey': EXPEDIA_CONFIG.apiKey,
                        'signature': signature,
                        'timestamp': timestamp.toString(),
                        'User-Agent': 'TravelAPI/1.0'
                    },
                    params: {
                        language: 'en-US'
                    }
                });
                
                console.log(`✅ ${endpoint}: Status ${response.status}`);
                
            } catch (error) {
                console.log(`❌ ${endpoint}: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
            }
        }
        
    } catch (error) {
        console.log('❌ Failed to get OAuth token:', error.message);
    }
};

// Main test execution
const runTests = async () => {
    console.log('🚀 Starting Expedia API Direct Tests');
    console.log('====================================');
    
    await testExpediaAPI();
    await testAlternativeEndpoints();
    
    console.log('\n✅ All tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };

