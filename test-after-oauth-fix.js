#!/usr/bin/env node

const axios = require('axios');

// Test cookie-based authentication after OAuth fix
async function testCookieAuthAfterFix() {
    console.log('🧪 Testing Cookie-Based Authentication (After OAuth Fix)');
    console.log('========================================================');
    
    const API_BASE = 'https://travelapi-r7bq.onrender.com/api/v1';
    
    try {
        // Test 1: Check OAuth configuration
        console.log('\n1. Testing OAuth Configuration:');
        const oauthResponse = await axios.get(`${API_BASE}/auth/google`, {
            maxRedirects: 0,
            validateStatus: (status) => status < 400
        });
        
        const redirectUrl = oauthResponse.headers.location;
        if (redirectUrl) {
            const url = new URL(redirectUrl);
            const redirectUri = url.searchParams.get('redirect_uri');
            
            console.log('✅ Redirect URI:', redirectUri);
            
            if (redirectUri === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
                console.log('✅ OAuth configuration is CORRECT!');
            } else {
                console.log('❌ OAuth configuration still needs fixing');
                console.log('Expected: https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                console.log('Actual:', redirectUri);
                return;
            }
        }
        
        // Test 2: Test auth status without cookies
        console.log('\n2. Testing /auth/status without cookies:');
        const statusResponse = await axios.get(`${API_BASE}/auth/status`);
        console.log('✅ Status:', statusResponse.data);
        
        // Test 3: Test /auth/me without cookies (should fail)
        console.log('\n3. Testing /auth/me without cookies:');
        try {
            await axios.get(`${API_BASE}/auth/me`);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Expected error:', error.response.data);
            } else {
                console.log('❌ Unexpected error:', error.response?.data || error.message);
            }
        }
        
        // Test 4: Test logout
        console.log('\n4. Testing logout:');
        try {
            const logoutResponse = await axios.get(`${API_BASE}/auth/logout`);
            console.log('✅ Logout response:', logoutResponse.data);
        } catch (error) {
            console.log('❌ Logout error:', error.response?.data || error.message);
        }
        
        console.log('\n🎯 Manual OAuth Flow Test:');
        console.log('==========================');
        console.log('1. Open browser and go to: https://travelapi-r7bq.onrender.com/api/v1/auth/google');
        console.log('2. Complete Google authentication');
        console.log('3. Check browser developer tools → Application → Cookies');
        console.log('4. Look for cookie named "token"');
        console.log('5. Test /auth/me endpoint with the cookie');
        console.log('');
        console.log('🔧 Cookie Configuration:');
        console.log('- Cookie name: "token"');
        console.log('- HttpOnly: true');
        console.log('- Secure: true (production)');
        console.log('- SameSite: "lax"');
        console.log('- Path: "/"');
        console.log('- MaxAge: 24 hours');
        console.log('');
        console.log('✅ Your cookie-based authentication should now work!');
        
    } catch (error) {
        if (error.response && error.response.status >= 300 && error.response.status < 400) {
            const redirectUrl = error.response.headers.location;
            if (redirectUrl) {
                const url = new URL(redirectUrl);
                const redirectUri = url.searchParams.get('redirect_uri');
                
                console.log('✅ Redirect URI:', redirectUri);
                
                if (redirectUri === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
                    console.log('✅ OAuth configuration is CORRECT!');
                } else {
                    console.log('❌ OAuth configuration still needs fixing');
                    console.log('Expected: https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                    console.log('Actual:', redirectUri);
                }
            }
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

// Run the test
testCookieAuthAfterFix();
