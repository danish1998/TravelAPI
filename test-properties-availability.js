const axios = require('axios');
const crypto = require('crypto');

// Test the Properties Availability API directly
const testPropertiesAvailability = async () => {
    console.log('🔍 Testing Properties Availability API Directly...');
    
    const EXPEDIA_CONFIG = {
        baseURL: 'https://test.ean.com',
        apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
        sharedSecret: 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6'
    };
    
    try {
        // Generate timestamp and signature
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = crypto.createHmac('sha512', EXPEDIA_CONFIG.sharedSecret).update(`${EXPEDIA_CONFIG.apiKey}${timestamp}`).digest('hex');
        
        console.log('Timestamp:', timestamp);
        console.log('Signature:', signature.substring(0, 20) + '...');
        
        // Test Properties Availability API
        const response = await axios.get(`${EXPEDIA_CONFIG.baseURL}/properties/availability`, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'Authorization': `EAN apikey=${EXPEDIA_CONFIG.apiKey},signature=${signature},timestamp=${timestamp}`,
                'User-Agent': 'TravelAPI/1.0'
            },
            params: {
                checkin: '2024-12-25',
                checkout: '2024-12-27',
                currency: 'USD',
                country_code: 'US',
                language: 'en-US',
                occupancy: ['2'],
                property_id: ['11775754', '12345678'],
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

// Test with different property IDs
const testDifferentPropertyIds = async () => {
    console.log('\n🏨 Testing Different Property IDs...');
    
    const EXPEDIA_CONFIG = {
        baseURL: 'https://test.ean.com',
        apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
        sharedSecret: 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6'
    };
    
    const propertyIds = [
        '11775754', // Default from controller
        '10003243', // From inactive properties list
        '10012775', // From inactive properties list
        '20321',    // From API documentation example
        '12345678'  // Random ID
    ];
    
    for (const propertyId of propertyIds) {
        console.log(`\nTesting property ID: ${propertyId}`);
        
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = crypto.createHmac('sha512', EXPEDIA_CONFIG.sharedSecret).update(`${EXPEDIA_CONFIG.apiKey}${timestamp}`).digest('hex');
            
            const response = await axios.get(`${EXPEDIA_CONFIG.baseURL}/properties/availability`, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': `EAN apikey=${EXPEDIA_CONFIG.apiKey},signature=${signature},timestamp=${timestamp}`,
                    'User-Agent': 'TravelAPI/1.0'
                },
                params: {
                    checkin: '2024-12-25',
                    checkout: '2024-12-27',
                    currency: 'USD',
                    country_code: 'US',
                    language: 'en-US',
                    occupancy: ['2'],
                    property_id: [propertyId],
                    rate_plan_count: 1,
                    sales_channel: 'website',
                    sales_environment: 'hotel_only'
                }
            });
            
            console.log(`✅ Property ${propertyId}: Success`);
            console.log(`   Status: ${response.status}`);
            console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
            
        } catch (error) {
            console.log(`❌ Property ${propertyId}: Failed`);
            console.log(`   Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
    }
};

// Test with different date ranges
const testDifferentDates = async () => {
    console.log('\n📅 Testing Different Date Ranges...');
    
    const EXPEDIA_CONFIG = {
        baseURL: 'https://test.ean.com',
        apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
        sharedSecret: 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6'
    };
    
    const dateRanges = [
        { checkIn: '2024-12-25', checkOut: '2024-12-27', name: 'Christmas 2024' },
        { checkIn: '2025-01-15', checkOut: '2025-01-17', name: 'January 2025' },
        { checkIn: '2025-06-15', checkOut: '2025-06-17', name: 'June 2025' },
        { checkIn: '2025-12-25', checkOut: '2025-12-27', name: 'Christmas 2025' }
    ];
    
    for (const dateRange of dateRanges) {
        console.log(`\nTesting ${dateRange.name} (${dateRange.checkIn} to ${dateRange.checkOut})`);
        
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = crypto.createHmac('sha512', EXPEDIA_CONFIG.sharedSecret).update(`${EXPEDIA_CONFIG.apiKey}${timestamp}`).digest('hex');
            
            const response = await axios.get(`${EXPEDIA_CONFIG.baseURL}/properties/availability`, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': `EAN apikey=${EXPEDIA_CONFIG.apiKey},signature=${signature},timestamp=${timestamp}`,
                    'User-Agent': 'TravelAPI/1.0'
                },
                params: {
                    checkin: dateRange.checkIn,
                    checkout: dateRange.checkOut,
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
            
            console.log(`✅ ${dateRange.name}: Success`);
            console.log(`   Status: ${response.status}`);
            console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
            
        } catch (error) {
            console.log(`❌ ${dateRange.name}: Failed`);
            console.log(`   Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
    }
};

// Main test execution
const runTests = async () => {
    console.log('🚀 Starting Properties Availability API Tests');
    console.log('=============================================');
    
    await testPropertiesAvailability();
    await testDifferentPropertyIds();
    await testDifferentDates();
    
    console.log('\n✅ All tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };



