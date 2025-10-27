#!/usr/bin/env node

const axios = require('axios');

// Test the OAuth callback and check what logs appear
async function testOAuthCallbackWithLogs() {
    console.log('🧪 Testing OAuth Callback with Log Analysis');
    console.log('==========================================');
    
    const callbackUrl = 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback?code=4%2F0Ab32j92G28F9h9io9wrx6keVgLgYKokGCYID5cB5eXgWktlyp86j2UUVzlCARRcfZfrILA&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent';
    
    console.log('Testing callback URL...');
    console.log('');
    
    try {
        const response = await axios.get(callbackUrl, {
            maxRedirects: 0,
            validateStatus: (status) => status < 400,
            timeout: 15000
        });
        
        console.log('✅ Callback Response:');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        
        if (response.status >= 300 && response.status < 400) {
            console.log('✅ Redirect detected:', response.headers.location);
            console.log('');
            console.log('🎉 SUCCESS! OAuth callback is working!');
            console.log('User should be redirected to:', response.headers.location);
        }
        
    } catch (error) {
        if (error.response) {
            console.log('❌ Callback Error:');
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
            
            if (error.response.status >= 300 && error.response.status < 400) {
                console.log('✅ Redirect detected:', error.response.headers.location);
                console.log('');
                console.log('🎉 SUCCESS! OAuth callback is working!');
                console.log('User should be redirected to:', error.response.headers.location);
            } else if (error.response.status === 500) {
                console.log('');
                console.log('🚨 SERVER ERROR: The OAuth callback is failing');
                console.log('');
                console.log('🔍 Debugging Steps:');
                console.log('1. Check Render logs for these specific messages:');
                console.log('   - "=== Passport OAuth Strategy Started ==="');
                console.log('   - "Google OAuth Profile ID:"');
                console.log('   - "🔍 Starting findOrCreateOAuthUser"');
                console.log('   - "=== OAuth Callback Debug ==="');
                console.log('');
                console.log('2. If you see Passport logs but not User logs:');
                console.log('   → Problem is in User.findOrCreateOAuthUser()');
                console.log('   → Check for duplicate keys, database errors');
                console.log('');
                console.log('3. If you see NO logs at all:');
                console.log('   → Problem is in Passport code exchange');
                console.log('   → Check GOOGLE_CLIENT_SECRET');
                console.log('   → Check Google Cloud Console callback URL');
                console.log('');
                console.log('4. If you see all logs but still get error:');
                console.log('   → Problem is in googleCallback function');
                console.log('   → Check JWT token creation');
                console.log('   → Check cookie setting');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.log('❌ Request timeout - server might be slow or stuck');
        } else {
            console.log('❌ Network Error:', error.message);
        }
    }
    
    console.log('');
    console.log('📋 Next Steps:');
    console.log('==============');
    console.log('1. **Check Render Logs**: Go to Render dashboard → Logs tab');
    console.log('2. **Look for debug messages**: The detailed logging will show exactly where it fails');
    console.log('3. **Share the logs**: Tell me what debug messages you see');
    console.log('4. **Deploy fixes**: Make sure your code changes are deployed');
    console.log('5. **Add SESSION_SECRET**: Add this environment variable to Render');
}

// Run the test
testOAuthCallbackWithLogs();
