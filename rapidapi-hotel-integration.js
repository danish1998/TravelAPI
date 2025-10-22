// RapidAPI Hotel Integration
const axios = require('axios');

// RapidAPI Configuration
const RAPIDAPI_CONFIG = {
    baseURL: 'https://hotels4.p.rapidapi.com', // Example: Hotels.com API
    apiKey: 'YOUR_RAPIDAPI_KEY',
    host: 'hotels4.p.rapidapi.com'
};

// Search hotels using RapidAPI
const searchHotelsRapidAPI = async (location, checkIn, checkOut, adults = 2) => {
    try {
        const response = await axios.get(`${RAPIDAPI_CONFIG.baseURL}/locations/v2/search`, {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_CONFIG.apiKey,
                'X-RapidAPI-Host': RAPIDAPI_CONFIG.host
            },
            params: {
                query: location,
                locale: 'en_US',
                currency: 'USD'
            }
        });

        return response.data;
    } catch (error) {
        console.error('RapidAPI search error:', error.response?.data || error.message);
        throw error;
    }
};

// Get hotel offers using RapidAPI
const getHotelOffersRapidAPI = async (destinationId, checkIn, checkOut, adults = 2) => {
    try {
        const response = await axios.get(`${RAPIDAPI_CONFIG.baseURL}/properties/list`, {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_CONFIG.apiKey,
                'X-RapidAPI-Host': RAPIDAPI_CONFIG.host
            },
            params: {
                destinationId: destinationId,
                pageNumber: '1',
                pageSize: '25',
                checkIn: checkIn,
                checkOut: checkOut,
                adults1: adults,
                sortOrder: 'PRICE',
                locale: 'en_US',
                currency: 'USD'
            }
        });

        return response.data;
    } catch (error) {
        console.error('RapidAPI offers error:', error.response?.data || error.message);
        throw error;
    }
};

// Test RapidAPI integration
const testRapidAPI = async () => {
    console.log('🧪 Testing RapidAPI Hotel API');
    console.log('=============================\n');

    try {
        // Test 1: Search for New York
        console.log('Test 1: Searching for New York...');
        const searchResult = await searchHotelsRapidAPI('New York', '2024-12-25', '2024-12-27', 2);
        console.log('✅ Search successful!');
        console.log('Results:', searchResult.suggestions?.length || 0);

        // Test 2: Get hotel offers
        if (searchResult.suggestions && searchResult.suggestions.length > 0) {
            const destinationId = searchResult.suggestions[0].entities[0].destinationId;
            console.log('\nTest 2: Getting hotel offers...');
            const offersResult = await getHotelOffersRapidAPI(destinationId, '2024-12-25', '2024-12-27', 2);
            console.log('✅ Offers successful!');
            console.log('Hotels found:', offersResult.data?.body?.searchResults?.results?.length || 0);
        }

    } catch (error) {
        console.error('❌ RapidAPI test failed:', error.message);
    }
};

module.exports = {
    searchHotelsRapidAPI,
    getHotelOffersRapidAPI,
    testRapidAPI
};

// Run test if called directly
if (require.main === module) {
    testRapidAPI();
}
