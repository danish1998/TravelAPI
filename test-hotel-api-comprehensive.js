const axios = require('axios');
const fs = require('fs');

// Test configuration
const BASE_URL = 'http://localhost:8080';
const API_BASE = `${BASE_URL}/api/v1/hotels`;

// Test data
const testData = {
    validSearch: {
        cityCode: 'DEL',
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        adults: 2,
        rooms: 1,
        currency: 'USD'
    },
    coordinateSearch: {
        latitude: 28.6139,
        longitude: 77.2090,
        radius: 50,
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        adults: 2,
        rooms: 1,
        currency: 'USD'
    },
    searchWithFilters: {
        cityCode: 'DEL',
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        adults: 2,
        rooms: 1,
        currency: 'USD',
        priceMax: 200,
        minRating: 3,
        maxRating: 5,
        amenities: 'wifi,pool,gym',
        sortBy: 'price',
        sortOrder: 'asc',
        limit: 10
    },
    invalidSearch: {
        // Missing required fields
        cityCode: 'DEL'
        // Missing checkInDate and checkOutDate
    },
    futureDates: {
        cityCode: 'DEL',
        checkInDate: '2025-06-15',
        checkOutDate: '2025-06-17',
        adults: 2,
        rooms: 1,
        currency: 'USD'
    }
};

// Test results storage
const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Utility functions
const logTest = (testName, status, details = '') => {
    testResults.total++;
    if (status === 'PASS') {
        testResults.passed++;
        console.log(`✅ ${testName}: PASS`);
    } else {
        testResults.failed++;
        console.log(`❌ ${testName}: FAIL - ${details}`);
    }
    testResults.details.push({ testName, status, details, timestamp: new Date().toISOString() });
};

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
    console.log('\n🏥 Testing Server Health...');
    
    const result = await makeRequest('GET', `${BASE_URL}/api/v1`);
    
    if (result.success && result.data.message === 'Travel API v1 is running!') {
        logTest('Server Health Check', 'PASS');
        return true;
    } else {
        logTest('Server Health Check', 'FAIL', 'Server not responding or incorrect response');
        return false;
    }
};

const testHotelSearch = async () => {
    console.log('\n🔍 Testing Hotel Search Endpoint...');
    
    // Test 1: Basic search with city code
    console.log('Testing basic search with city code...');
    const basicSearch = await makeRequest('POST', `${API_BASE}/search`, testData.validSearch);
    
    if (basicSearch.success && basicSearch.data.hotels) {
        logTest('Basic Hotel Search (City Code)', 'PASS', `Found ${basicSearch.data.count} hotels`);
    } else {
        logTest('Basic Hotel Search (City Code)', 'FAIL', basicSearch.error?.message || 'No hotels returned');
    }
    
    // Test 2: Search with coordinates
    console.log('Testing search with coordinates...');
    const coordSearch = await makeRequest('POST', `${API_BASE}/search`, testData.coordinateSearch);
    
    if (coordSearch.success && coordSearch.data.hotels) {
        logTest('Hotel Search (Coordinates)', 'PASS', `Found ${coordSearch.data.count} hotels`);
    } else {
        logTest('Hotel Search (Coordinates)', 'FAIL', coordSearch.error?.message || 'No hotels returned');
    }
    
    // Test 3: Search with filters
    console.log('Testing search with filters...');
    const filterSearch = await makeRequest('POST', `${API_BASE}/search`, testData.searchWithFilters);
    
    if (filterSearch.success && filterSearch.data.hotels) {
        logTest('Hotel Search (With Filters)', 'PASS', `Found ${filterSearch.data.count} hotels`);
    } else {
        logTest('Hotel Search (With Filters)', 'FAIL', filterSearch.error?.message || 'No hotels returned');
    }
    
    // Test 4: Invalid search (missing required fields)
    console.log('Testing invalid search...');
    const invalidSearch = await makeRequest('POST', `${API_BASE}/search`, testData.invalidSearch);
    
    if (!invalidSearch.success && invalidSearch.status === 400) {
        logTest('Invalid Search Validation', 'PASS', 'Correctly rejected invalid request');
    } else {
        logTest('Invalid Search Validation', 'FAIL', 'Should have rejected invalid request');
    }
    
    // Test 5: Search with future dates
    console.log('Testing search with future dates...');
    const futureSearch = await makeRequest('POST', `${API_BASE}/search`, testData.futureDates);
    
    if (futureSearch.success && futureSearch.data.hotels) {
        logTest('Hotel Search (Future Dates)', 'PASS', `Found ${futureSearch.data.count} hotels`);
    } else {
        logTest('Hotel Search (Future Dates)', 'FAIL', futureSearch.error?.message || 'No hotels returned');
    }
};

const testHotelDetails = async () => {
    console.log('\n🏨 Testing Hotel Details Endpoint...');
    
    // First, get a hotel ID from search
    const searchResult = await makeRequest('POST', `${API_BASE}/search`, testData.validSearch);
    
    if (searchResult.success && searchResult.data.hotels && searchResult.data.hotels.length > 0) {
        const hotelId = searchResult.data.hotels[0].hotelId;
        
        // Test 1: Get hotel details without booking params
        console.log('Testing hotel details without booking params...');
        const detailsResult = await makeRequest('GET', `${API_BASE}/details/${hotelId}`);
        
        if (detailsResult.success && detailsResult.data.hotelId) {
            logTest('Hotel Details (Basic)', 'PASS', `Retrieved details for hotel ${hotelId}`);
        } else {
            logTest('Hotel Details (Basic)', 'FAIL', detailsResult.error?.message || 'Failed to get hotel details');
        }
        
        // Test 2: Get hotel details with booking params
        console.log('Testing hotel details with booking params...');
        const detailsWithBooking = await makeRequest('GET', `${API_BASE}/details/${hotelId}`, null, {
            checkInDate: '2024-12-25',
            checkOutDate: '2024-12-27',
            adults: 2,
            rooms: 1,
            currency: 'USD'
        });
        
        if (detailsWithBooking.success && detailsWithBooking.data.hotelId) {
            logTest('Hotel Details (With Booking)', 'PASS', `Retrieved details with booking params`);
        } else {
            logTest('Hotel Details (With Booking)', 'FAIL', detailsWithBooking.error?.message || 'Failed to get hotel details');
        }
        
        // Test 3: Invalid hotel ID
        console.log('Testing invalid hotel ID...');
        const invalidDetails = await makeRequest('GET', `${API_BASE}/details/invalid-hotel-id`);
        
        if (!invalidDetails.success && (invalidDetails.status === 404 || invalidDetails.status === 500)) {
            logTest('Hotel Details (Invalid ID)', 'PASS', 'Correctly handled invalid hotel ID');
        } else {
            logTest('Hotel Details (Invalid ID)', 'FAIL', 'Should have rejected invalid hotel ID');
        }
        
    } else {
        logTest('Hotel Details (No Hotels Found)', 'FAIL', 'Cannot test details - no hotels found in search');
    }
};

const testHotelAvailability = async () => {
    console.log('\n📅 Testing Hotel Availability Endpoint...');
    
    // First, get a hotel ID from search
    const searchResult = await makeRequest('POST', `${API_BASE}/search`, testData.validSearch);
    
    if (searchResult.success && searchResult.data.hotels && searchResult.data.hotels.length > 0) {
        const hotelId = searchResult.data.hotels[0].hotelId;
        
        // Test 1: Get availability with all required params
        console.log('Testing hotel availability with required params...');
        const availabilityResult = await makeRequest('GET', `${API_BASE}/availability/${hotelId}`, null, {
            checkInDate: '2024-12-25',
            checkOutDate: '2024-12-27',
            adults: 2,
            rooms: 1,
            currency: 'USD'
        });
        
        if (availabilityResult.success && availabilityResult.data.hotelId) {
            logTest('Hotel Availability (Valid)', 'PASS', `Retrieved availability for hotel ${hotelId}`);
        } else {
            logTest('Hotel Availability (Valid)', 'FAIL', availabilityResult.error?.message || 'Failed to get hotel availability');
        }
        
        // Test 2: Missing required params
        console.log('Testing hotel availability without required params...');
        const invalidAvailability = await makeRequest('GET', `${API_BASE}/availability/${hotelId}`);
        
        if (!invalidAvailability.success && invalidAvailability.status === 400) {
            logTest('Hotel Availability (Missing Params)', 'PASS', 'Correctly rejected request with missing params');
        } else {
            logTest('Hotel Availability (Missing Params)', 'FAIL', 'Should have rejected request with missing params');
        }
        
        // Test 3: Invalid hotel ID
        console.log('Testing hotel availability with invalid hotel ID...');
        const invalidIdAvailability = await makeRequest('GET', `${API_BASE}/availability/invalid-hotel-id`, null, {
            checkInDate: '2024-12-25',
            checkOutDate: '2024-12-27',
            adults: 2,
            rooms: 1,
            currency: 'USD'
        });
        
        if (!invalidIdAvailability.success && (invalidIdAvailability.status === 404 || invalidIdAvailability.status === 500)) {
            logTest('Hotel Availability (Invalid ID)', 'PASS', 'Correctly handled invalid hotel ID');
        } else {
            logTest('Hotel Availability (Invalid ID)', 'FAIL', 'Should have rejected invalid hotel ID');
        }
        
    } else {
        logTest('Hotel Availability (No Hotels Found)', 'FAIL', 'Cannot test availability - no hotels found in search');
    }
};

const testErrorHandling = async () => {
    console.log('\n🚨 Testing Error Handling...');
    
    // Test 1: Invalid HTTP method
    console.log('Testing invalid HTTP method...');
    try {
        const result = await makeRequest('GET', `${API_BASE}/search`);
        if (!result.success && result.status === 404) {
            logTest('Invalid HTTP Method', 'PASS', 'Correctly rejected GET request to POST endpoint');
        } else {
            logTest('Invalid HTTP Method', 'FAIL', 'Should have rejected GET request to POST endpoint');
        }
    } catch (error) {
        logTest('Invalid HTTP Method', 'PASS', 'Correctly rejected invalid HTTP method');
    }
    
    // Test 2: Malformed JSON
    console.log('Testing malformed JSON...');
    try {
        const result = await axios.post(`${API_BASE}/search`, 'invalid json', {
            headers: { 'Content-Type': 'application/json' }
        });
        logTest('Malformed JSON', 'FAIL', 'Should have rejected malformed JSON');
    } catch (error) {
        if (error.response?.status === 400) {
            logTest('Malformed JSON', 'PASS', 'Correctly rejected malformed JSON');
        } else {
            logTest('Malformed JSON', 'FAIL', 'Should have rejected malformed JSON');
        }
    }
    
    // Test 3: Invalid date format
    console.log('Testing invalid date format...');
    const invalidDateSearch = await makeRequest('POST', `${API_BASE}/search`, {
        cityCode: 'DEL',
        checkInDate: 'invalid-date',
        checkOutDate: '2024-12-27',
        adults: 2,
        rooms: 1
    });
    
    if (!invalidDateSearch.success && invalidDateSearch.status === 400) {
        logTest('Invalid Date Format', 'PASS', 'Correctly rejected invalid date format');
    } else {
        logTest('Invalid Date Format', 'FAIL', 'Should have rejected invalid date format');
    }
};

const testPerformance = async () => {
    console.log('\n⚡ Testing Performance...');
    
    const startTime = Date.now();
    const searchResult = await makeRequest('POST', `${API_BASE}/search`, testData.validSearch);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (searchResult.success && responseTime < 10000) { // 10 seconds timeout
        logTest('Performance Test', 'PASS', `Response time: ${responseTime}ms`);
    } else if (searchResult.success) {
        logTest('Performance Test', 'FAIL', `Response time too slow: ${responseTime}ms`);
    } else {
        logTest('Performance Test', 'FAIL', 'Request failed');
    }
};

const generateReport = () => {
    console.log('\n📊 Test Report Summary');
    console.log('========================');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
    
    if (testResults.failed > 0) {
        console.log('\n❌ Failed Tests:');
        testResults.details
            .filter(test => test.status === 'FAIL')
            .forEach(test => {
                console.log(`  - ${test.testName}: ${test.details}`);
            });
    }
    
    // Save detailed report to file
    const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
            total: testResults.total,
            passed: testResults.passed,
            failed: testResults.failed,
            successRate: ((testResults.passed / testResults.total) * 100).toFixed(2)
        },
        details: testResults.details
    };
    
    fs.writeFileSync('hotel-api-test-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: hotel-api-test-report.json');
};

// Main test execution
const runTests = async () => {
    console.log('🚀 Starting Hotel API Comprehensive Tests');
    console.log('==========================================');
    
    try {
        // Check if server is running
        const serverRunning = await testServerHealth();
        if (!serverRunning) {
            console.log('\n❌ Server is not running. Please start the server first.');
            console.log('Run: node server.js');
            return;
        }
        
        // Run all tests
        await testHotelSearch();
        await testHotelDetails();
        await testHotelAvailability();
        await testErrorHandling();
        await testPerformance();
        
        // Generate report
        generateReport();
        
    } catch (error) {
        console.error('\n💥 Test execution failed:', error.message);
        logTest('Test Execution', 'FAIL', error.message);
        generateReport();
    }
};

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests, testData, testResults };