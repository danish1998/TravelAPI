#!/usr/bin/env node

const axios = require('axios');

// Test cookie-based authentication
async function testCookieAuth() {
    console.log('🧪 Testing Cookie-Based Authentication');
    console.log('=====================================');
    
    const API_BASE = 'https://travelapi-r7bq.onrender.com/api/v1';
    
    try {
        // Test 1: Check auth status without cookies
        console.log('\n1. Testing /auth/status without cookies:');
        const statusResponse = await axios.get(`${API_BASE}/auth/status`);
        console.log('✅ Status:', statusResponse.data);
        
        // Test 2: Test /auth/me without cookies (should fail)
        console.log('\n2. Testing /auth/me without cookies:');
        try {
            await axios.get(`${API_BASE}/auth/me`);
        } catch (error) {
            console.log('✅ Expected error:', error.response.data);
        }
        
        // Test 3: Test OAuth initiation
        console.log('\n3. Testing OAuth initiation:');
        try {
            const oauthResponse = await axios.get(`${API_BASE}/auth/google`, {
                maxRedirects: 0,
                validateStatus: (status) => status < 400
            });
            console.log('✅ OAuth redirect status:', oauthResponse.status);
            console.log('✅ OAuth redirect location:', oauthResponse.headers.location);
        } catch (error) {
            if (error.response && error.response.status >= 300 && error.response.status < 400) {
                console.log('✅ OAuth redirect status:', error.response.status);
                console.log('✅ OAuth redirect location:', error.response.headers.location);
            } else {
                console.log('❌ OAuth error:', error.message);
            }
        }
        
        console.log('\n🎯 Manual Test Instructions:');
        console.log('============================');
        console.log('1. Open browser and go to: https://travelapi-r7bq.onrender.com/api/v1/auth/google');
        console.log('2. Complete Google authentication');
        console.log('3. Check browser developer tools → Application → Cookies');
        console.log('4. Look for cookie named "token"');
        console.log('5. Test /auth/me endpoint with the cookie');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testCookieAuth();
