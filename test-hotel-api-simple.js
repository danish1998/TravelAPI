const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:8080';
const API_BASE = `${BASE_URL}/api/v1/hotels`;

// Test data
const testSearchData = {
    cityCode: 'DEL',
    checkInDate: '2024-12-25',
    checkOutDate: '2024-12-27',
    adults: 2,
    rooms: 1,
    currency: 'USD'
};

const testSearchWithFilters = {
    cityCode: 'DEL',
    checkInDate: '2024-12-25',
    checkOutDate: '2024-12-27',
    adults: 2,
    rooms: 1,
    currency: 'USD',
    priceMax: 200,
    minRating: 3,
    sortBy: 'price',
    limit: 5
};

// Utility function to make requests
const makeRequest = async (method, url, data = null, params = null) => {
    try {
        const config = {
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        
        if (data) config.data = data;
        if (params) config.params = params;
        
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message, 
            status: error.response?.status || 500 
        };
    }
};

// Test functions
const testServerHealth = async () => {
    console.log('🏥 Testing Server Health...');
    const result = await makeRequest('GET', `${BASE_URL}/api/v1`);
    
    if (result.success && result.data.message === 'Travel API v1 is running!') {
        console.log('✅ Server is running');
        return true;
    } else {
        console.log('❌ Server is not responding');
        return false;
    }
};

const testHotelSearch = async () => {
    console.log('\n🔍 Testing Hotel Search...');
    
    // Basic search
    console.log('Testing basic hotel search...');
    const searchResult = await makeRequest('POST', `${API_BASE}/search`, testSearchData);
    
    if (searchResult.success) {
        console.log(`✅ Search successful - Found ${searchResult.data.count} hotels`);
        console.log(`   Transaction ID: ${searchResult.data.transactionId}`);
        
        if (searchResult.data.hotels && searchResult.data.hotels.length > 0) {
            const firstHotel = searchResult.data.hotels[0];
            console.log(`   First hotel: ${firstHotel.name} (${firstHotel.rating} stars)`);
            console.log(`   Price: ${firstHotel.pricing.currency} ${firstHotel.pricing.totalPrice}`);
            return firstHotel.hotelId;
        }
    } else {
        console.log(`❌ Search failed: ${searchResult.error?.message || 'Unknown error'}`);
    }
    
    return null;
};

const testHotelSearchWithFilters = async () => {
    console.log('\n🔍 Testing Hotel Search with Filters...');
    
    const searchResult = await makeRequest('POST', `${API_BASE}/search`, testSearchWithFilters);
    
    if (searchResult.success) {
        console.log(`✅ Filtered search successful - Found ${searchResult.data.count} hotels`);
        
        if (searchResult.data.hotels && searchResult.data.hotels.length > 0) {
            console.log('   Hotels found:');
            searchResult.data.hotels.forEach((hotel, index) => {
                console.log(`   ${index + 1}. ${hotel.name} - ${hotel.pricing.currency} ${hotel.pricing.totalPrice} (${hotel.rating} stars)`);
            });
        }
    } else {
        console.log(`❌ Filtered search failed: ${searchResult.error?.message || 'Unknown error'}`);
    }
};

const testHotelDetails = async (hotelId) => {
    if (!hotelId) {
        console.log('\n❌ Cannot test hotel details - no hotel ID available');
        return;
    }
    
    console.log(`\n🏨 Testing Hotel Details for ID: ${hotelId}`);
    
    const detailsResult = await makeRequest('GET', `${API_BASE}/details/${hotelId}`);
    
    if (detailsResult.success) {
        console.log(`✅ Hotel details retrieved successfully`);
        console.log(`   Hotel: ${detailsResult.data.name}`);
        console.log(`   Rating: ${detailsResult.data.rating} stars`);
        console.log(`   Address: ${detailsResult.data.address?.city}, ${detailsResult.data.address?.country}`);
        console.log(`   Amenities: ${detailsResult.data.amenities?.length || 0} amenities`);
    } else {
        console.log(`❌ Hotel details failed: ${detailsResult.error?.message || 'Unknown error'}`);
    }
};

const testHotelAvailability = async (hotelId) => {
    if (!hotelId) {
        console.log('\n❌ Cannot test hotel availability - no hotel ID available');
        return;
    }
    
    console.log(`\n📅 Testing Hotel Availability for ID: ${hotelId}`);
    
    const availabilityResult = await makeRequest('GET', `${API_BASE}/availability/${hotelId}`, null, {
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        adults: 2,
        rooms: 1,
        currency: 'USD'
    });
    
    if (availabilityResult.success) {
        console.log(`✅ Hotel availability retrieved successfully`);
        console.log(`   Available rooms: ${availabilityResult.data.totalAvailableRooms}`);
        console.log(`   Check-in: ${availabilityResult.data.checkInDate}`);
        console.log(`   Check-out: ${availabilityResult.data.checkOutDate}`);
        
        if (availabilityResult.data.availableRooms && availabilityResult.data.availableRooms.length > 0) {
            const firstRoom = availabilityResult.data.availableRooms[0];
            console.log(`   First room: ${firstRoom.roomType} - ${firstRoom.pricing.currency} ${firstRoom.pricing.totalPrice}`);
        }
    } else {
        console.log(`❌ Hotel availability failed: ${availabilityResult.error?.message || 'Unknown error'}`);
    }
};

const testErrorHandling = async () => {
    console.log('\n🚨 Testing Error Handling...');
    
    // Test invalid search (missing required fields)
    console.log('Testing invalid search (missing dates)...');
    const invalidSearch = await makeRequest('POST', `${API_BASE}/search`, {
        cityCode: 'DEL'
        // Missing checkInDate and checkOutDate
    });
    
    if (!invalidSearch.success && invalidSearch.status === 400) {
        console.log('✅ Correctly rejected invalid search');
    } else {
        console.log('❌ Should have rejected invalid search');
    }
    
    // Test invalid hotel ID
    console.log('Testing invalid hotel ID...');
    const invalidDetails = await makeRequest('GET', `${API_BASE}/details/invalid-hotel-id`);
    
    if (!invalidDetails.success && (invalidDetails.status === 404 || invalidDetails.status === 500)) {
        console.log('✅ Correctly handled invalid hotel ID');
    } else {
        console.log('❌ Should have rejected invalid hotel ID');
    }
};

// Main test execution
const runTests = async () => {
    console.log('🚀 Starting Hotel API Tests');
    console.log('============================');
    
    try {
        // Check server health
        const serverRunning = await testServerHealth();
        if (!serverRunning) {
            console.log('\n❌ Server is not running. Please start the server first.');
            console.log('Run: node server.js');
            return;
        }
        
        // Run tests
        const hotelId = await testHotelSearch();
        await testHotelSearchWithFilters();
        await testHotelDetails(hotelId);
        await testHotelAvailability(hotelId);
        await testErrorHandling();
        
        console.log('\n✅ All tests completed!');
        
    } catch (error) {
        console.error('\n💥 Test execution failed:', error.message);
    }
};

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };

