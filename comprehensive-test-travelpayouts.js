// Comprehensive Test Script for TravelPayouts Flight Search API
const fetch = require('node-fetch');

const baseUrl = 'http://localhost:8080/api/v1/flights/search-travelpayouts';

// Test cases
const testCases = [
  {
    name: "Basic Test - DEL to BOM",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '2025-11-15',
      adults: '1',
      currency: 'INR'
    },
    expectedStatus: 200
  },
  {
    name: "Round Trip Test",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '2025-11-15',
      return_date: '2025-11-20',
      adults: '1',
      currency: 'INR'
    },
    expectedStatus: 200
  },
  {
    name: "Multiple Adults Test",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '2025-11-15',
      adults: '2',
      currency: 'INR'
    },
    expectedStatus: 200
  },
  {
    name: "Different Currency Test (USD)",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '2025-11-15',
      adults: '1',
      currency: 'USD'
    },
    expectedStatus: 200
  },
  {
    name: "International Route Test",
    params: {
      origin: 'DEL',
      destination: 'DXB',
      depart_date: '2025-11-15',
      adults: '1',
      currency: 'INR'
    },
    expectedStatus: 200
  },
  {
    name: "Missing Required Parameter - No Origin",
    params: {
      destination: 'BOM',
      depart_date: '2025-11-15',
      adults: '1',
      currency: 'INR'
    },
    expectedStatus: 400
  },
  {
    name: "Missing Required Parameter - No Destination",
    params: {
      origin: 'DEL',
      depart_date: '2025-11-15',
      adults: '1',
      currency: 'INR'
    },
    expectedStatus: 400
  },
  {
    name: "Missing Required Parameter - No Depart Date",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      adults: '1',
      currency: 'INR'
    },
    expectedStatus: 400
  },
  {
    name: "Invalid Date Format",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '15-11-2025',
      adults: '1',
      currency: 'INR'
    },
    expectedStatus: 400
  },
  {
    name: "Invalid Adults Count - Zero",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '2025-11-15',
      adults: '0',
      currency: 'INR'
    },
    expectedStatus: 400
  },
  {
    name: "Invalid Adults Count - Too High",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '2025-11-15',
      adults: '10',
      currency: 'INR'
    },
    expectedStatus: 400
  },
  {
    name: "Invalid Currency",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '2025-11-15',
      adults: '1',
      currency: 'XYZ'
    },
    expectedStatus: 400
  },
  {
    name: "Return Date Before Depart Date",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '2025-11-20',
      return_date: '2025-11-15',
      adults: '1',
      currency: 'INR'
    },
    expectedStatus: 400
  },
  {
    name: "With Token and Marker",
    params: {
      origin: 'DEL',
      destination: 'BOM',
      depart_date: '2025-11-15',
      adults: '1',
      currency: 'INR',
      token: 'e6270c177af919eba17db64f82e44907',
      marker: '676402'
    },
    expectedStatus: 200
  }
];

const runTest = async (testCase) => {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log('Parameters:', testCase.params);
  
  try {
    const params = new URLSearchParams(testCase.params);
    const testUrl = `${baseUrl}?${params.toString()}`;
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    console.log(`Status: ${response.status} (Expected: ${testCase.expectedStatus})`);
    
    if (response.status === testCase.expectedStatus) {
      console.log('✅ PASS');
      if (response.status === 200) {
        console.log(`Found ${data.data?.flights?.length || 0} flights`);
        console.log(`Currency: ${data.data?.currency || 'N/A'}`);
      } else {
        console.log(`Error Message: ${data.message || 'No message'}`);
      }
    } else {
      console.log('❌ FAIL - Status code mismatch');
    }
    
    // Show first few lines of response for successful requests
    if (response.status === 200 && data.data?.flights?.length > 0) {
      console.log('Sample flight data:');
      console.log(JSON.stringify(data.data.flights[0], null, 2));
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
};

const runAllTests = async () => {
  console.log('🚀 Starting Comprehensive TravelPayouts API Tests');
  console.log('='.repeat(60));
  
  let passCount = 0;
  let failCount = 0;
  
  for (const testCase of testCases) {
    try {
      await runTest(testCase);
      if (testCase.expectedStatus === 200) {
        passCount++;
      } else {
        passCount++;
      }
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      failCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Test Results: ${passCount} passed, ${failCount} failed`);
  console.log('='.repeat(60));
};

// Run all tests
runAllTests();

