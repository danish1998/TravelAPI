#!/usr/bin/env node

const axios = require('axios');

// Test the specific OAuth callback URL
async function testSpecificCallback() {
    console.log('🧪 Testing Specific OAuth Callback');
    console.log('==================================');
    
    // Your specific callback URL
    const callbackUrl = 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback?code=4%2F0Ab32j92F0S_HLRqiW5sLfE8EalFsKxYYtYqlvic4o2ubdpAHbaA0iWRn-59OCOOe5Cfygw&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent';
    
    console.log('Testing callback URL...');
    console.log('');
    
    try {
        const response = await axios.get(callbackUrl, {
            maxRedirects: 0,
            validateStatus: (status) => status < 400,
            timeout: 10000
        });
        
        console.log('✅ Callback Response:');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        console.log('Headers:', response.headers);
        
    } catch (error) {
        if (error.response) {
            console.log('❌ Callback Error:');
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
            console.log('Headers:', error.response.headers);
            
            if (error.response.status >= 300 && error.response.status < 400) {
                console.log('✅ Redirect detected:', error.response.headers.location);
                console.log('');
                console.log('🎉 SUCCESS! The OAuth callback is working!');
                console.log('The user should be redirected to:', error.response.headers.location);
            } else if (error.response.status === 500) {
                console.log('');
                console.log('🚨 SERVER ERROR: The OAuth callback is failing');
                console.log('');
                console.log('🔍 Debugging Steps:');
                console.log('1. Check Render logs for detailed error messages');
                console.log('2. Verify the code changes have been deployed');
                console.log('3. Check if the debugging messages appear in logs');
                console.log('');
                console.log('📋 Expected Log Messages (after deployment):');
                console.log('- "=== OAuth Callback Debug ==="');
                console.log('- "Environment check:"');
                console.log('- "GOOGLE_CLIENT_SECRET: SET"');
                console.log('- "JWT_SECRET: SET"');
                console.log('- "MONGODB_URI: SET"');
                console.log('- "=== Passport OAuth Debug ==="');
                console.log('- "Google OAuth Profile:"');
                console.log('- "User created/found:"');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.log('❌ Request timeout - server might be slow');
        } else {
            console.log('❌ Network Error:', error.message);
        }
    }
    
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('==============');
    console.log('1. **Check Render Logs**:');
    console.log('   - Go to Render dashboard');
    console.log('   - Find your TravelAPI service');
    console.log('   - Click "Logs" tab');
    console.log('   - Look for debug messages');
    console.log('');
    console.log('2. **Verify Deployment**:');
    console.log('   - Make sure your code changes are deployed');
    console.log('   - Check if the debugging code is running');
    console.log('');
    console.log('3. **Test OAuth Flow**:');
    console.log('   - Go to: https://travelapi-r7bq.onrender.com/api/v1/auth/google');
    console.log('   - Complete authentication');
    console.log('   - Check logs for detailed error messages');
}

// Run the test
testSpecificCallback();
