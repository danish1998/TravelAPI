#!/usr/bin/env node

const axios = require('axios');

// Final OAuth Test Script
async function finalOAuthTest() {
    console.log('🧪 Final OAuth Test');
    console.log('==================');
    
    const API_BASE = 'https://travelapi-r7bq.onrender.com/api/v1';
    
    try {
        // Test 1: Check OAuth initiation
        console.log('\n1. Testing OAuth initiation...');
        const oauthResponse = await axios.get(`${API_BASE}/auth/google`, {
            maxRedirects: 0,
            validateStatus: (status) => status < 400
        });
        
        const redirectUrl = oauthResponse.headers.location;
        if (redirectUrl) {
            const url = new URL(redirectUrl);
            const redirectUri = url.searchParams.get('redirect_uri');
            
            console.log('✅ OAuth redirect URI:', redirectUri);
            
            if (redirectUri === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
                console.log('✅ OAuth configuration is CORRECT!');
            } else {
                console.log('❌ OAuth configuration issue');
                return;
            }
        }
        
        // Test 2: Check auth endpoints
        console.log('\n2. Testing auth endpoints...');
        
        try {
            const statusResponse = await axios.get(`${API_BASE}/auth/status`);
            console.log('✅ /auth/status:', statusResponse.data);
        } catch (error) {
            console.log('❌ /auth/status error:', error.response?.data || error.message);
        }
        
        try {
            await axios.get(`${API_BASE}/auth/me`);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ /auth/me (expected 401):', error.response.data);
            } else {
                console.log('❌ /auth/me error:', error.response?.data || error.message);
            }
        }
        
        console.log('\n🎯 MANUAL OAUTH TEST:');
        console.log('====================');
        console.log('1. **Add SESSION_SECRET to Render**:');
        console.log('   - Go to Render dashboard');
        console.log('   - Environment tab');
        console.log('   - Add: SESSION_SECRET=secret123');
        console.log('   - Save and redeploy');
        console.log('');
        console.log('2. **Test OAuth Flow**:');
        console.log('   - Go to: https://travelapi-r7bq.onrender.com/api/v1/auth/google');
        console.log('   - Complete Google authentication');
        console.log('   - Check if redirected to: https://www.comfortmytrip.com/?token=...');
        console.log('');
        console.log('3. **Check Render Logs**:');
        console.log('   - Look for debug messages');
        console.log('   - Should see: "=== Passport OAuth Strategy Started ==="');
        console.log('   - Should see: "=== OAuth Callback Debug ==="');
        console.log('   - Should see: "✅ Redirecting to: https://www.comfortmytrip.com/?token=..."');
        console.log('');
        console.log('4. **Test Cookie Authentication**:');
        console.log('   - After OAuth success, test: https://travelapi-r7bq.onrender.com/api/v1/auth/me');
        console.log('   - Should return user data instead of "Authentication token missing"');
        
        console.log('\n🔧 Troubleshooting:');
        console.log('===================');
        console.log('If OAuth still fails after adding SESSION_SECRET:');
        console.log('');
        console.log('1. **Check Render Logs** for specific error messages');
        console.log('2. **Verify SESSION_SECRET** is set correctly');
        console.log('3. **Check database connection** in logs');
        console.log('4. **Look for duplicate key errors** in User model');
        console.log('5. **Verify Google Client Secret** is correct');
        
        console.log('\n✅ SUCCESS INDICATORS:');
        console.log('=====================');
        console.log('- OAuth redirects to comfortmytrip.com with token');
        console.log('- Render logs show successful debug messages');
        console.log('- /auth/me returns user data');
        console.log('- Cookie is set automatically');
        console.log('- No more "Authentication token missing" errors');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the final test
finalOAuthTest();
