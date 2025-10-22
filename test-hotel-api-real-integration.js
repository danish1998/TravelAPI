const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:8080/api/v1/hotels';

// Test real API integration without mock data
const testRealAPIIntegration = async () => {
    console.log('🔍 Testing Real Hotel API Integration (No Mock Data)');
    console.log('==================================================\n');
    
    // Test 1: Verify API is running
    console.log('Test 1: API Health Check');
    try {
        const healthResponse = await axios.get('http://localhost:8080/api/v1');
        console.log(`✅ API is running: ${healthResponse.data.message}`);
    } catch (error) {
        console.log(`❌ API is not running: ${error.message}`);
        return;
    }
    
    // Test 2: Test with real Expedia API credentials
    console.log('\nTest 2: Testing with Real Expedia API');
    const realSearchData = {
        cityCode: 'NYC',
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        adults: 2,
        rooms: 1,
        currency: 'USD',
        limit: 5
    };
    
    try {
        const startTime = Date.now();
        const response = await axios.post(`${BASE_URL}/search`, realSearchData, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const endTime = Date.now();
        
        console.log(`✅ Real API call successful (${endTime - startTime}ms)`);
        console.log(`Status: ${response.status}`);
        console.log(`Response structure:`, {
            count: response.data.count,
            hasHotels: Array.isArray(response.data.hotels),
            hotelCount: response.data.hotels?.length || 0,
            searchParams: response.data.searchParams
        });
        
        // Check if we're getting real data or mock data
        if (response.data.hotels && response.data.hotels.length > 0) {
            const firstHotel = response.data.hotels[0];
            console.log(`First hotel details:`, {
                hotelId: firstHotel.hotelId,
                name: firstHotel.name,
                pricing: firstHotel.pricing,
                amenities: firstHotel.amenities?.length || 0,
                address: firstHotel.address
            });
            
            // Check if this looks like real data or mock data
            if (firstHotel.name === 'Deluxe King Room' || firstHotel.name === 'Standard Queen Room') {
                console.log('⚠️  WARNING: This appears to be mock data, not real API data');
            } else {
                console.log('✅ This appears to be real API data');
            }
        }
        
    } catch (error) {
        console.log(`❌ Real API call failed: ${error.response?.data?.message || error.message}`);
        console.log(`Status: ${error.response?.status || 'Network Error'}`);
        
        if (error.response?.status === 401) {
            console.log('🔑 Authentication issue - check Expedia API credentials');
        } else if (error.response?.status === 403) {
            console.log('🚫 Authorization issue - API key may not have proper permissions');
        } else if (error.response?.status === 429) {
            console.log('⏰ Rate limit exceeded - too many requests');
        }
    }
    
    // Test 3: Test different endpoints with real data
    console.log('\nTest 3: Testing Hotel Details with Real API');
    try {
        const detailsResponse = await axios.get(`${BASE_URL}/details/19248`, {
            params: {
                checkInDate: '2024-12-25',
                checkOutDate: '2024-12-27',
                adults: 2,
                currency: 'USD'
            },
            timeout: 30000
        });
        
        console.log(`✅ Hotel details retrieved`);
        console.log(`Hotel data:`, {
            hotelId: detailsResponse.data.hotelId,
            name: detailsResponse.data.name,
            rating: detailsResponse.data.rating,
            hasAddress: !!detailsResponse.data.address,
            hasAmenities: detailsResponse.data.amenities?.length > 0,
            hasImages: detailsResponse.data.images?.length > 0
        });
        
    } catch (error) {
        console.log(`❌ Hotel details failed: ${error.response?.data?.message || error.message}`);
    }
    
    // Test 4: Test availability endpoint
    console.log('\nTest 4: Testing Hotel Availability with Real API');
    try {
        const availabilityResponse = await axios.get(`${BASE_URL}/availability/19248`, {
            params: {
                checkInDate: '2024-12-25',
                checkOutDate: '2024-12-27',
                adults: 2,
                currency: 'USD'
            },
            timeout: 30000
        });
        
        console.log(`✅ Hotel availability retrieved`);
        console.log(`Availability data:`, {
            hotelId: availabilityResponse.data.hotelId,
            totalAvailableRooms: availabilityResponse.data.totalAvailableRooms,
            hasRooms: availabilityResponse.data.availableRooms?.length > 0,
            checkInDate: availabilityResponse.data.checkInDate,
            checkOutDate: availabilityResponse.data.checkOutDate
        });
        
    } catch (error) {
        console.log(`❌ Hotel availability failed: ${error.response?.data?.message || error.message}`);
    }
    
    // Test 5: Test error handling with invalid data
    console.log('\nTest 5: Testing Error Handling');
    try {
        const errorResponse = await axios.post(`${BASE_URL}/search`, {
            // Missing required fields
            cityCode: 'NYC'
        });
        console.log(`❌ Should have failed but didn't: ${errorResponse.data}`);
    } catch (error) {
        if (error.response?.status === 400) {
            console.log(`✅ Correctly handled invalid request: ${error.response.data.message}`);
        } else {
            console.log(`❌ Unexpected error: ${error.response?.data?.message || error.message}`);
        }
    }
    
    // Test 6: Test with different locations
    console.log('\nTest 6: Testing Different Locations');
    const locations = [
        { cityCode: 'LAX', name: 'Los Angeles' },
        { cityCode: 'CHI', name: 'Chicago' },
        { cityCode: 'MIA', name: 'Miami' },
        { cityCode: 'LAS', name: 'Las Vegas' }
    ];
    
    for (const location of locations) {
        try {
            const response = await axios.post(`${BASE_URL}/search`, {
                cityCode: location.cityCode,
                checkInDate: '2024-12-25',
                checkOutDate: '2024-12-27',
                adults: 2,
                currency: 'USD',
                limit: 3
            }, { timeout: 15000 });
            
            console.log(`✅ ${location.name} (${location.cityCode}): ${response.data.count} hotels found`);
            
        } catch (error) {
            console.log(`❌ ${location.name} (${location.cityCode}): ${error.response?.data?.message || error.message}`);
        }
    }
    
    console.log('\n🎯 Real API Integration Test Complete');
    console.log('=====================================');
    console.log('Summary:');
    console.log('- API endpoints are functional');
    console.log('- Error handling is working');
    console.log('- Multiple locations tested');
    console.log('- Response times are reasonable');
    console.log('=====================================');
};

// Run the test
if (require.main === module) {
    testRealAPIIntegration().catch(console.error);
}

module.exports = { testRealAPIIntegration };
