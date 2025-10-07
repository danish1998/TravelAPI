// Test script for TravelPayouts Flight Search API
const fetch = require('node-fetch');

const testTravelPayoutsAPI = async () => {
  const baseUrl = 'http://localhost:8080/api/v1/flights/search-travelpayouts';
  
  // Test parameters (same as your example)
  const params = new URLSearchParams({
    origin: 'DEL',
    destination: 'BOM',
    depart_date: '2025-11-15',
    return_date: '2025-11-20',
    adults: '1',
    currency: 'INR',
    token: 'e6270c177af919eba17db64f82e44907',
    marker: '676402'
  });

  const testUrl = `${baseUrl}?${params.toString()}`;
  
  console.log('Testing TravelPayouts Flight Search API...');
  console.log('URL:', testUrl);
  console.log('---');

  try {
    const response = await fetch(testUrl);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the test
testTravelPayoutsAPI();
