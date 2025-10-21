const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/v1/airports';

const testMediumAirportsInclusion = async () => {
  console.log('🧪 Testing Medium Airports Inclusion...\n');

  try {
    // Test 1: Search for "International" to see both large and medium airports
    console.log('1️⃣ Testing search for "International" (should show large and medium airports):');
    const response1 = await axios.get(`${BASE_URL}/search`, {
      params: { q: 'International', limit: 15 }
    });
    
    console.log(`✅ Status: ${response1.status}`);
    console.log(`🔍 Found ${response1.data.data.length} airports`);
    console.log('📄 Results (should show both large ✈️ and medium 🛫 airports):');
    response1.data.data.forEach((airport, index) => {
      const typeIcon = airport.type === 'large_airport' ? '✈️' : 
                      airport.type === 'medium_airport' ? '🛫' : 
                      airport.type === 'small_airport' ? '🛩️' : 
                      airport.type === 'heliport' ? '🚁' : '🏢';
      console.log(`   ${index + 1}. ${typeIcon} ${airport.name} (${airport.iata_code}) - ${airport.municipality}, ${airport.iso_country} [${airport.type}]`);
    });
    console.log('');

    // Test 2: Search for "International" with India priority
    console.log('2️⃣ Testing search for "International" with India priority (large and medium airports):');
    const response2 = await axios.get(`${BASE_URL}/search`, {
      params: { q: 'International', priority_country: 'IN', limit: 15 }
    });
    
    console.log(`✅ Status: ${response2.status}`);
    console.log(`🔍 Found ${response2.data.data.length} airports`);
    console.log(`🎯 Priority Country: ${response2.data.priorityCountry}`);
    console.log('📄 Results (India airports first, both large and medium):');
    response2.data.data.forEach((airport, index) => {
      const isIndia = airport.iso_country === 'IN';
      const flag = isIndia ? '🇮🇳' : '🌍';
      const typeIcon = airport.type === 'large_airport' ? '✈️' : 
                      airport.type === 'medium_airport' ? '🛫' : 
                      airport.type === 'small_airport' ? '🛩️' : 
                      airport.type === 'heliport' ? '🚁' : '🏢';
      console.log(`   ${index + 1}. ${flag} ${typeIcon} ${airport.name} (${airport.iata_code}) - ${airport.municipality}, ${airport.iso_country} [${airport.type}]`);
    });
    console.log('');

    // Test 3: Search for "Saudi" to see both large and medium airports
    console.log('3️⃣ Testing search for "Saudi" (should show both large and medium airports):');
    const response3 = await axios.get(`${BASE_URL}/search`, {
      params: { q: 'Saudi', limit: 20 }
    });
    
    console.log(`✅ Status: ${response3.status}`);
    console.log(`🔍 Found ${response3.data.data.length} airports`);
    console.log('📄 Results (Saudi Arabia airports - both large and medium):');
    response3.data.data.forEach((airport, index) => {
      const flag = airport.iso_country === 'SA' ? '🇸🇦' : '🌍';
      const typeIcon = airport.type === 'large_airport' ? '✈️' : 
                      airport.type === 'medium_airport' ? '🛫' : 
                      airport.type === 'small_airport' ? '🛩️' : 
                      airport.type === 'heliport' ? '🚁' : '🏢';
      console.log(`   ${index + 1}. ${flag} ${typeIcon} ${airport.name} (${airport.iata_code}) - ${airport.municipality}, ${airport.iso_country} [${airport.type}]`);
    });
    console.log('');

    // Test 4: Search for "Airport" to see variety of airport types
    console.log('4️⃣ Testing search for "Airport" (should show both large and medium airports):');
    const response4 = await axios.get(`${BASE_URL}/search`, {
      params: { q: 'Airport', limit: 20 }
    });
    
    console.log(`✅ Status: ${response4.status}`);
    console.log(`🔍 Found ${response4.data.data.length} airports`);
    console.log('📄 Results (should show both large ✈️ and medium 🛫 airports):');
    response4.data.data.forEach((airport, index) => {
      const typeIcon = airport.type === 'large_airport' ? '✈️' : 
                      airport.type === 'medium_airport' ? '🛫' : 
                      airport.type === 'small_airport' ? '🛩️' : 
                      airport.type === 'heliport' ? '🚁' : '🏢';
      console.log(`   ${index + 1}. ${typeIcon} ${airport.name} (${airport.iata_code}) - ${airport.municipality}, ${airport.iso_country} [${airport.type}]`);
    });

    console.log('\n🎉 Medium airports inclusion tests completed!');
    console.log('✅ Both large airports (✈️) and medium airports (🛫) should be shown');
    console.log('❌ Small airports (🛩️) and heliports (🚁) should still be excluded');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

// Run the test
testMediumAirportsInclusion();
