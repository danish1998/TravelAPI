const { searchHotels, getHotelDetails, getHotelAvailability } = require('./Controllers/hotelsController');

// Mock request and response objects for testing
const createMockReq = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query
});

const createMockRes = () => {
    const res = {
        status: (code) => {
            res.statusCode = code;
            return res;
        },
        json: (data) => {
            res.data = data;
            return res;
        }
    };
    return res;
};

// Test the hotel search function directly
const testHotelSearch = async () => {
    console.log('🧪 Testing Hotel Search Function (No Mock Data)');
    console.log('===============================================\n');
    
    // Test 1: Valid search request
    console.log('Test 1: Valid search with NYC');
    const req1 = createMockReq({
        cityCode: 'NYC',
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        adults: 2,
        currency: 'USD'
    });
    
    const res1 = createMockRes();
    
    try {
        await searchHotels(req1, res1);
        console.log(`Status: ${res1.statusCode}`);
        if (res1.data) {
            console.log(`Response: ${JSON.stringify(res1.data, null, 2)}`);
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
    
    // Test 2: Invalid request (missing dates)
    console.log('\nTest 2: Invalid request (missing dates)');
    const req2 = createMockReq({
        cityCode: 'NYC',
        adults: 2
    });
    
    const res2 = createMockRes();
    
    try {
        await searchHotels(req2, res2);
        console.log(`Status: ${res2.statusCode}`);
        if (res2.data) {
            console.log(`Response: ${JSON.stringify(res2.data, null, 2)}`);
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
    
    // Test 3: Search with coordinates
    console.log('\nTest 3: Search with coordinates');
    const req3 = createMockReq({
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 25,
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        adults: 2,
        currency: 'USD'
    });
    
    const res3 = createMockRes();
    
    try {
        await searchHotels(req3, res3);
        console.log(`Status: ${res3.statusCode}`);
        if (res3.data) {
            console.log(`Response: ${JSON.stringify(res3.data, null, 2)}`);
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

// Test hotel details function
const testHotelDetails = async () => {
    console.log('\n🧪 Testing Hotel Details Function');
    console.log('==================================\n');
    
    const req = createMockReq({}, { hotelId: '19248' }, {
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        adults: 2,
        currency: 'USD'
    });
    
    const res = createMockRes();
    
    try {
        await getHotelDetails(req, res);
        console.log(`Status: ${res.statusCode}`);
        if (res.data) {
            console.log(`Response: ${JSON.stringify(res.data, null, 2)}`);
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

// Test hotel availability function
const testHotelAvailability = async () => {
    console.log('\n🧪 Testing Hotel Availability Function');
    console.log('=====================================\n');
    
    const req = createMockReq({}, { hotelId: '19248' }, {
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        adults: 2,
        currency: 'USD'
    });
    
    const res = createMockRes();
    
    try {
        await getHotelAvailability(req, res);
        console.log(`Status: ${res.statusCode}`);
        if (res.data) {
            console.log(`Response: ${JSON.stringify(res.data, null, 2)}`);
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

// Run all tests
const runTests = async () => {
    console.log('🚀 Testing Hotel Controller Functions (No Mock Data)');
    console.log('====================================================\n');
    
    try {
        await testHotelSearch();
        await testHotelDetails();
        await testHotelAvailability();
        
        console.log('\n✅ All tests completed!');
        console.log('Note: These tests will make real API calls to Expedia.');
        console.log('If you see authentication errors, check your Expedia API credentials.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };
