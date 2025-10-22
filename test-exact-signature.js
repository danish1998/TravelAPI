const axios = require('axios');

// Test with the exact signature from EPS Signature Generator
const testExactSignature = async () => {
    console.log('🔐 Testing with Exact EPS Signature Generator Values');
    console.log('==================================================');
    
    const EXPEDIA_CONFIG = {
        baseURL: 'https://test.ean.com',
        apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
        timestamp: 1761067235, // From your EPS Signature Generator
        signature: '03ca2d7cd0b2ba0fea82ec653142b8c2bfe68a73d0901c015fac0522b689e775a44f48865ac10fbc89357068449fb90a5b8a855f574f818562e58b639e7bffdc'
    };
    
    const authHeader = `EAN apikey=${EXPEDIA_CONFIG.apiKey},signature=${EXPEDIA_CONFIG.signature},timestamp=${EXPEDIA_CONFIG.timestamp}`;
    
    console.log('API Key:', EXPEDIA_CONFIG.apiKey);
    console.log('Timestamp:', EXPEDIA_CONFIG.timestamp);
    console.log('Signature:', EXPEDIA_CONFIG.signature.substring(0, 20) + '...');
    console.log('Auth Header:', authHeader);
    console.log('');
    
    try {
        // Test Properties Availability API
        const response = await axios.get(`${EXPEDIA_CONFIG.baseURL}/properties/availability`, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'Authorization': authHeader,
                'User-Agent': 'TravelAPI/1.0'
            },
            params: {
                checkin: '2024-12-25',
                checkout: '2024-12-27',
                currency: 'USD',
                country_code: 'US',
                language: 'en-US',
                occupancy: ['2'],
                property_id: ['11775754'],
                rate_plan_count: 1,
                sales_channel: 'website',
                sales_environment: 'hotel_only'
            }
        });
        
        console.log('✅ Properties Availability API response received');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Properties Availability API test failed');
        console.log('Error status:', error.response?.status);
        console.log('Error data:', JSON.stringify(error.response?.data, null, 2));
        console.log('Error message:', error.message);
    }
};

// Test different endpoints
const testDifferentEndpoints = async () => {
    console.log('\n🔍 Testing Different Endpoints');
    console.log('==============================');
    
    const EXPEDIA_CONFIG = {
        baseURL: 'https://test.ean.com',
        apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
        timestamp: 1761067235,
        signature: '03ca2d7cd0b2ba0fea82ec653142b8c2bfe68a73d0901c015fac0522b689e775a44f48865ac10fbc89357068449fb90a5b8a855f574f818562e58b639e7bffdc'
    };
    
    const authHeader = `EAN apikey=${EXPEDIA_CONFIG.apiKey},signature=${EXPEDIA_CONFIG.signature},timestamp=${EXPEDIA_CONFIG.timestamp}`;
    
    const endpoints = [
        '/properties/availability',
        '/v3/properties/availability',
        '/v3/get-availability',
        '/v3/shopping',
        '/v3/properties/content',
        '/v3/regions',
        '/v3/suggestions'
    ];
    
    for (const endpoint of endpoints) {
        console.log(`\nTesting endpoint: ${endpoint}`);
        
        try {
            const response = await axios.get(`${EXPEDIA_CONFIG.baseURL}${endpoint}`, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': authHeader,
                    'User-Agent': 'TravelAPI/1.0'
                },
                params: {
                    language: 'en-US'
                }
            });
            
            console.log(`✅ ${endpoint}: Status ${response.status}`);
            console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
            
        } catch (error) {
            console.log(`❌ ${endpoint}: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
    }
};

// Test with different base URLs
const testDifferentBaseURLs = async () => {
    console.log('\n🌐 Testing Different Base URLs');
    console.log('=============================');
    
    const EXPEDIA_CONFIG = {
        apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
        timestamp: 1761067235,
        signature: '03ca2d7cd0b2ba0fea82ec653142b8c2bfe68a73d0901c015fac0522b689e775a44f48865ac10fbc89357068449fb90a5b8a855f574f818562e58b639e7bffdc'
    };
    
    const authHeader = `EAN apikey=${EXPEDIA_CONFIG.apiKey},signature=${EXPEDIA_CONFIG.signature},timestamp=${EXPEDIA_CONFIG.timestamp}`;
    
    const baseURLs = [
        'https://test.ean.com',
        'https://api.ean.com',
        'https://rapidapi.com',
        'https://api.expedia.com'
    ];
    
    for (const baseURL of baseURLs) {
        console.log(`\nTesting base URL: ${baseURL}`);
        
        try {
            const response = await axios.get(`${baseURL}/properties/availability`, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': authHeader,
                    'User-Agent': 'TravelAPI/1.0'
                },
                params: {
                    checkin: '2024-12-25',
                    checkout: '2024-12-27',
                    currency: 'USD',
                    country_code: 'US',
                    language: 'en-US',
                    occupancy: ['2'],
                    property_id: ['11775754'],
                    rate_plan_count: 1,
                    sales_channel: 'website',
                    sales_environment: 'hotel_only'
                }
            });
            
            console.log(`✅ ${baseURL}: Status ${response.status}`);
            console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
            
        } catch (error) {
            console.log(`❌ ${baseURL}: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
    }
};

// Main test execution
const runTests = async () => {
    console.log('🚀 Starting Exact Signature Tests');
    console.log('=================================');
    
    await testExactSignature();
    await testDifferentEndpoints();
    await testDifferentBaseURLs();
    
    console.log('\n✅ All exact signature tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };



