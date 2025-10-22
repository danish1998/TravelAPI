// Amadeus Hotel API Integration
const axios = require('axios');

// Amadeus API Configuration
const AMADEUS_CONFIG = {
    baseURL: 'https://api.amadeus.com',
    apiKey: 'YOUR_AMADEUS_API_KEY',
    apiSecret: 'YOUR_AMADEUS_API_SECRET',
    accessToken: null
};

// Get Amadeus access token
const getAmadeusToken = async () => {
    try {
        const response = await axios.post(`${AMADEUS_CONFIG.baseURL}/v1/security/oauth2/token`, 
            `grant_type=client_credentials&client_id=${AMADEUS_CONFIG.apiKey}&client_secret=${AMADEUS_CONFIG.apiSecret}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        AMADEUS_CONFIG.accessToken = response.data.access_token;
        return response.data.access_token;
    } catch (error) {
        console.error('Amadeus token error:', error.response?.data || error.message);
        throw error;
    }
};

// Search hotels using Amadeus
const searchHotelsAmadeus = async (cityCode, checkIn, checkOut, adults = 2) => {
    try {
        if (!AMADEUS_CONFIG.accessToken) {
            await getAmadeusToken();
        }

        const response = await axios.get(`${AMADEUS_CONFIG.baseURL}/v1/shopping/hotel-offers`, {
            headers: {
                'Authorization': `Bearer ${AMADEUS_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {
                cityCode: cityCode,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                adults: adults,
                currency: 'USD'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Amadeus search error:', error.response?.data || error.message);
        throw error;
    }
};

// Get hotel details using Amadeus
const getHotelDetailsAmadeus = async (hotelId, checkIn, checkOut, adults = 2) => {
    try {
        if (!AMADEUS_CONFIG.accessToken) {
            await getAmadeusToken();
        }

        const response = await axios.get(`${AMADEUS_CONFIG.baseURL}/v1/shopping/hotel-offers/by-hotel`, {
            headers: {
                'Authorization': `Bearer ${AMADEUS_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {
                hotelIds: hotelId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                adults: adults,
                currency: 'USD'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Amadeus hotel details error:', error.response?.data || error.message);
        throw error;
    }
};

// Test Amadeus integration
const testAmadeusAPI = async () => {
    console.log('🧪 Testing Amadeus Hotel API');
    console.log('============================\n');

    try {
        // Test 1: Search hotels in New York
        console.log('Test 1: Searching hotels in NYC...');
        const searchResult = await searchHotelsAmadeus('NYC', '2024-12-25', '2024-12-27', 2);
        console.log('✅ Search successful!');
        console.log('Hotels found:', searchResult.data?.length || 0);
        
        if (searchResult.data && searchResult.data.length > 0) {
            const firstHotel = searchResult.data[0];
            console.log('First hotel:', firstHotel.hotel.name);
            console.log('Price:', firstHotel.offers[0]?.price?.total || 'N/A');
        }

        // Test 2: Get specific hotel details
        if (searchResult.data && searchResult.data.length > 0) {
            const hotelId = searchResult.data[0].hotel.hotelId;
            console.log('\nTest 2: Getting hotel details...');
            const hotelDetails = await getHotelDetailsAmadeus(hotelId, '2024-12-25', '2024-12-27', 2);
            console.log('✅ Hotel details successful!');
            console.log('Hotel name:', hotelDetails.data[0]?.hotel?.name || 'N/A');
        }

    } catch (error) {
        console.error('❌ Amadeus API test failed:', error.message);
    }
};

module.exports = {
    searchHotelsAmadeus,
    getHotelDetailsAmadeus,
    testAmadeusAPI
};

// Run test if called directly
if (require.main === module) {
    testAmadeusAPI();
}
