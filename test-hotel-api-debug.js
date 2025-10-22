const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:8080';
const API_BASE = `${BASE_URL}/api/v1/hotels`;

// Test the Expedia API directly to understand the issue
const testExpediaDirect = async () => {
    console.log('🔍 Testing Expedia API Directly...');
    
    const EXPEDIA_CONFIG = {
        baseURL: 'https://test.ean.com',
        clientId: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
        clientSecret: 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6',
        tokenURL: 'https://test.ean.com/identity/oauth2/v3/token?grant_type=client_credentials'
    };
    
    try {
        // Get OAuth token
        console.log('Getting OAuth token...');
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
        
        // Test the properties availability endpoint
        console.log('Testing properties availability endpoint...');
        const availabilityResponse = await axios.get(`${EXPEDIA_CONFIG.baseURL}/v3/properties/availability`, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'TravelAPI/1.0'
            },
            params: {
                property_id: '11775754',
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
        
        console.log('✅ Expedia API response received');
        console.log('Response status:', availabilityResponse.status);
        console.log('Response data:', JSON.stringify(availabilityResponse.data, null, 2));
        
    } catch (error) {
        console.log('❌ Expedia API test failed');
        console.log('Error status:', error.response?.status);
        console.log('Error data:', error.response?.data);
        console.log('Error message:', error.message);
    }
};

// Test different property IDs
const testDifferentPropertyIds = async () => {
    console.log('\n🏨 Testing Different Property IDs...');
    
    const propertyIds = [
        '11775754', // Default from controller
        '12345678', // Random ID
        '87654321', // Another random ID
        '11111111'  // Another random ID
    ];
    
    for (const propertyId of propertyIds) {
        console.log(`\nTesting property ID: ${propertyId}`);
        
        try {
            const response = await axios.post(`${API_BASE}/search`, {
                cityCode: 'DEL',
                checkInDate: '2024-12-25',
                checkOutDate: '2024-12-27',
                adults: 2,
                rooms: 1,
                currency: 'USD'
            });
            
            console.log(`✅ Property ${propertyId}: Success`);
            console.log(`   Found ${response.data.count} hotels`);
            
        } catch (error) {
            console.log(`❌ Property ${propertyId}: Failed`);
            console.log(`   Error: ${error.response?.data?.message || error.message}`);
        }
    }
};

// Test with different date ranges
const testDifferentDates = async () => {
    console.log('\n📅 Testing Different Date Ranges...');
    
    const dateRanges = [
        { checkIn: '2024-12-25', checkOut: '2024-12-27', name: 'Christmas 2024' },
        { checkIn: '2025-01-15', checkOut: '2025-01-17', name: 'January 2025' },
        { checkIn: '2025-06-15', checkOut: '2025-06-17', name: 'June 2025' },
        { checkIn: '2025-12-25', checkOut: '2025-12-27', name: 'Christmas 2025' }
    ];
    
    for (const dateRange of dateRanges) {
        console.log(`\nTesting ${dateRange.name} (${dateRange.checkIn} to ${dateRange.checkOut})`);
        
        try {
            const response = await axios.post(`${API_BASE}/search`, {
                cityCode: 'DEL',
                checkInDate: dateRange.checkIn,
                checkOutDate: dateRange.checkOut,
                adults: 2,
                rooms: 1,
                currency: 'USD'
            });
            
            console.log(`✅ ${dateRange.name}: Success`);
            console.log(`   Found ${response.data.count} hotels`);
            
        } catch (error) {
            console.log(`❌ ${dateRange.name}: Failed`);
            console.log(`   Error: ${error.response?.data?.message || error.message}`);
        }
    }
};

// Test with different cities
const testDifferentCities = async () => {
    console.log('\n🌍 Testing Different Cities...');
    
    const cities = [
        { code: 'DEL', name: 'Delhi' },
        { code: 'NYC', name: 'New York' },
        { code: 'LON', name: 'London' },
        { code: 'PAR', name: 'Paris' },
        { code: 'LAX', name: 'Los Angeles' }
    ];
    
    for (const city of cities) {
        console.log(`\nTesting ${city.name} (${city.code})`);
        
        try {
            const response = await axios.post(`${API_BASE}/search`, {
                cityCode: city.code,
                checkInDate: '2024-12-25',
                checkOutDate: '2024-12-27',
                adults: 2,
                rooms: 1,
                currency: 'USD'
            });
            
            console.log(`✅ ${city.name}: Success`);
            console.log(`   Found ${response.data.count} hotels`);
            
        } catch (error) {
            console.log(`❌ ${city.name}: Failed`);
            console.log(`   Error: ${error.response?.data?.message || error.message}`);
        }
    }
};

// Test the hotel details endpoint directly
const testHotelDetailsDirect = async () => {
    console.log('\n🏨 Testing Hotel Details Directly...');
    
    const hotelIds = ['11775754', '12345678', '87654321'];
    
    for (const hotelId of hotelIds) {
        console.log(`\nTesting hotel details for ID: ${hotelId}`);
        
        try {
            const response = await axios.get(`${API_BASE}/details/${hotelId}`);
            console.log(`✅ Hotel ${hotelId}: Success`);
            console.log(`   Hotel name: ${response.data.name}`);
            console.log(`   Rating: ${response.data.rating} stars`);
            
        } catch (error) {
            console.log(`❌ Hotel ${hotelId}: Failed`);
            console.log(`   Error: ${error.response?.data?.message || error.message}`);
        }
    }
};

// Main test execution
const runDebugTests = async () => {
    console.log('🚀 Starting Hotel API Debug Tests');
    console.log('===================================');
    
    try {
        // Test Expedia API directly
        await testExpediaDirect();
        
        // Test different property IDs
        await testDifferentPropertyIds();
        
        // Test different date ranges
        await testDifferentDates();
        
        // Test different cities
        await testDifferentCities();
        
        // Test hotel details directly
        await testHotelDetailsDirect();
        
        console.log('\n✅ Debug tests completed!');
        
    } catch (error) {
        console.error('\n💥 Debug test execution failed:', error.message);
    }
};

// Run tests if this file is executed directly
if (require.main === module) {
    runDebugTests();
}

module.exports = { runDebugTests };

