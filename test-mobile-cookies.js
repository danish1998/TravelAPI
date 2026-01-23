const axios = require('axios');

// const BASE_URL = 'https://api.comfortmytrip.com';
const BASE_URL= 'travelapi-r7bq.onrender.com';

async function testMobileCookies() {
    console.log('🧪 Testing Mobile Cookie Compatibility...\n');

    try {
        // Test 1: Check current cookie configuration
        console.log('1️⃣ Testing cookie configuration endpoint...');
        const configResponse = await axios.get(`${BASE_URL}/api/v1/auth/debug-config`);
        console.log('✅ Config Response:', JSON.stringify(configResponse.data, null, 2));

        // Test 2: Test login with mobile-like headers
        console.log('\n2️⃣ Testing login with mobile headers...');
        const loginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
            email: 'test@example.com',
            password: 'testpassword'
        }, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/117.0.5938.92 Mobile/15E148 Safari/604.1',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log('✅ Login Response Status:', loginResponse.status);
        console.log('✅ Login Response Headers:', loginResponse.headers['set-cookie']);

        // Test 3: Test cookie reading
        console.log('\n3️⃣ Testing cookie reading...');
        const cookieResponse = await axios.get(`${BASE_URL}/api/v1/auth/test-cookies`, {
            withCredentials: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/117.0.5938.92 Mobile/15E148 Safari/604.1'
            }
        });
        console.log('✅ Cookie Test Response:', JSON.stringify(cookieResponse.data, null, 2));

        // Test 4: Test logout
        console.log('\n4️⃣ Testing logout...');
        const logoutResponse = await axios.get(`${BASE_URL}/api/v1/auth/logout`, {
            withCredentials: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/117.0.5938.92 Mobile/15E148 Safari/604.1'
            }
        });
        console.log('✅ Logout Response Status:', logoutResponse.status);
        console.log('✅ Logout Response Headers:', logoutResponse.headers['set-cookie']);

    } catch (error) {
        console.error('❌ Test Error:', error.response?.data || error.message);
    }
}

// Run the test
testMobileCookies();
