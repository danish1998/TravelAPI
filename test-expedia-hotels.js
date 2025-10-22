const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/v1/hotels';

// Test hotel search
async function testHotelSearch() {
    try {
        console.log('🔍 Testing Hotel Search...');
        
        const searchData = {
            cityCode: 'NYC', // New York City
            checkInDate: '2024-12-15',
            checkOutDate: '2024-12-17',
            adults: 2,
            rooms: 1,
            currency: 'USD',
            limit: 5
        };

        const response = await axios.post(`${BASE_URL}/search`, searchData);
        
        console.log('✅ Hotel Search Response:');
        console.log(`Found ${response.data.count} hotels`);
        
        if (response.data.hotels && response.data.hotels.length > 0) {
            const firstHotel = response.data.hotels[0];
            console.log(`\nFirst Hotel: ${firstHotel.name}`);
            console.log(`Rating: ${firstHotel.rating} stars`);
            console.log(`Price: ${firstHotel.pricing?.currency} ${firstHotel.pricing?.totalPrice}`);
            console.log(`Hotel ID: ${firstHotel.hotelId}`);
            
            return firstHotel.hotelId; // Return hotel ID for details test
        }
        
        return null;
    } catch (error) {
        console.error('❌ Hotel Search Error:', error.response?.data || error.message);
        return null;
    }
}

// Test hotel details
async function testHotelDetails(hotelId) {
    if (!hotelId) {
        console.log('⏭️ Skipping hotel details test - no hotel ID available');
        return;
    }

    try {
        console.log('\n🏨 Testing Hotel Details...');
        
        const response = await axios.get(`${BASE_URL}/details/${hotelId}`, {
            params: {
                checkInDate: '2024-12-15',
                checkOutDate: '2024-12-17',
                adults: 2,
                rooms: 1,
                currency: 'USD'
            }
        });
        
        console.log('✅ Hotel Details Response:');
        console.log(`Hotel: ${response.data.name}`);
        console.log(`Description: ${response.data.description?.substring(0, 100)}...`);
        console.log(`Rating: ${response.data.rating} stars`);
        console.log(`Amenities: ${response.data.amenities?.length || 0} amenities`);
        console.log(`Images: ${response.data.images?.length || 0} images`);
        
    } catch (error) {
        console.error('❌ Hotel Details Error:', error.response?.data || error.message);
    }
}

// Test hotel availability
async function testHotelAvailability(hotelId) {
    if (!hotelId) {
        console.log('⏭️ Skipping hotel availability test - no hotel ID available');
        return;
    }

    try {
        console.log('\n📅 Testing Hotel Availability...');
        
        const response = await axios.get(`${BASE_URL}/availability/${hotelId}`, {
            params: {
                checkInDate: '2024-12-15',
                checkOutDate: '2024-12-17',
                adults: 2,
                rooms: 1,
                currency: 'USD'
            }
        });
        
        console.log('✅ Hotel Availability Response:');
        console.log(`Hotel ID: ${response.data.hotelId}`);
        console.log(`Available Rooms: ${response.data.totalAvailableRooms}`);
        
        if (response.data.availableRooms && response.data.availableRooms.length > 0) {
            const firstRoom = response.data.availableRooms[0];
            console.log(`First Room Type: ${firstRoom.roomType}`);
            console.log(`Price: ${response.data.currency} ${firstRoom.pricing?.totalPrice}`);
        }
        
    } catch (error) {
        console.error('❌ Hotel Availability Error:', error.response?.data || error.message);
    }
}

// Test with coordinates instead of city code
async function testHotelSearchWithCoordinates() {
    try {
        console.log('\n🗺️ Testing Hotel Search with Coordinates...');
        
        const searchData = {
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 10,
            checkInDate: '2024-12-15',
            checkOutDate: '2024-12-17',
            adults: 1,
            rooms: 1,
            currency: 'USD',
            limit: 3
        };

        const response = await axios.post(`${BASE_URL}/search`, searchData);
        
        console.log('✅ Coordinate Search Response:');
        console.log(`Found ${response.data.count} hotels near coordinates`);
        
    } catch (error) {
        console.error('❌ Coordinate Search Error:', error.response?.data || error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting Expedia Hotels API Tests...\n');
    
    // Test 1: Hotel Search
    const hotelId = await testHotelSearch();
    
    // Test 2: Hotel Details
    await testHotelDetails(hotelId);
    
    // Test 3: Hotel Availability
    await testHotelAvailability(hotelId);
    
    // Test 4: Search with coordinates
    await testHotelSearchWithCoordinates();
    
    console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    testHotelSearch,
    testHotelDetails,
    testHotelAvailability,
    testHotelSearchWithCoordinates,
    runTests
};
