#!/usr/bin/env node

const axios = require('axios');

// Test OAuth callback with the actual code from your URL
async function testOAuthCallback() {
    console.log('🧪 Testing OAuth Callback');
    console.log('=========================');
    
    // Extract the code from your URL
    const callbackUrl = 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback?code=4%2F0Ab32j924TR02q7ms_JURiDmr3Fiddt5rd_U7rAGCywoaCRud6PRqCR6vSXCqYaKSpRKyvQ&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent';
    
    console.log('Testing callback URL:', callbackUrl);
    console.log('');
    
    try {
        const response = await axios.get(callbackUrl, {
            maxRedirects: 0,
            validateStatus: (status) => status < 400
        });
        
        console.log('✅ Callback Response:');
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Data:', response.data);
        
    } catch (error) {
        if (error.response) {
            console.log('❌ Callback Error:');
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
            console.log('Headers:', error.response.headers);
            
            if (error.response.status >= 300 && error.response.status < 400) {
                console.log('✅ Redirect detected:', error.response.headers.location);
            }
        } else {
            console.log('❌ Network Error:', error.message);
        }
    }
    
    console.log('');
    console.log('🔍 Debugging Steps:');
    console.log('==================');
    console.log('1. Check Render logs for detailed error messages');
    console.log('2. Verify GOOGLE_CLIENT_SECRET is set correctly');
    console.log('3. Check database connection');
    console.log('4. Verify JWT_SECRET is set');
    console.log('');
    console.log('📋 Common OAuth Callback Issues:');
    console.log('================================');
    console.log('• Invalid/expired authorization code');
    console.log('• Google Client Secret mismatch');
    console.log('• Database connection issues');
    console.log('• Missing environment variables');
    console.log('• User creation/retrieval failed');
}

// Run the test
testOAuthCallback();
