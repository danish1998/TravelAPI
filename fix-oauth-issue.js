#!/usr/bin/env node

const axios = require('axios');

// Comprehensive OAuth Fix Script
async function fixOAuthIssue() {
    console.log('🚀 OAuth Fix Script');
    console.log('==================');
    
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
            
            if (redirectUri === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
                console.log('✅ OAuth configuration is CORRECT!');
            } else {
                console.log('❌ OAuth configuration issue:', redirectUri);
                return;
            }
        }
        
        // Test 2: Test OAuth callback with a fresh code
        console.log('\n2. Testing OAuth Callback:');
        console.log('Go to: https://travelapi-r7bq.onrender.com/api/v1/auth/google');
        console.log('Complete the OAuth flow and check the logs for detailed error messages.');
        
        console.log('\n🔧 IMMEDIATE FIX STEPS:');
        console.log('=======================');
        console.log('1. **Check Render Logs**:');
        console.log('   - Go to Render dashboard');
        console.log('   - Find your TravelAPI service');
        console.log('   - Click "Logs" tab');
        console.log('   - Look for "OAuth Callback Debug" messages');
        console.log('');
        console.log('2. **Check Environment Variables**:');
        console.log('   - Go to Environment tab in Render');
        console.log('   - Verify these are set:');
        console.log('     • GOOGLE_CLIENT_SECRET');
        console.log('     • JWT_SECRET');
        console.log('     • MONGODB_URI');
        console.log('     • SESSION_SECRET');
        console.log('');
        console.log('3. **Most Common Issues**:');
        console.log('   • GOOGLE_CLIENT_SECRET is wrong or missing');
        console.log('   • MONGODB_URI is incorrect');
        console.log('   • JWT_SECRET is not set');
        console.log('');
        console.log('4. **Get Google Client Secret**:');
        console.log('   - Go to Google Cloud Console');
        console.log('   - APIs & Services → Credentials');
        console.log('   - Find your OAuth 2.0 Client ID');
        console.log('   - Copy the Client Secret');
        console.log('   - Set it in Render: GOOGLE_CLIENT_SECRET=your_secret_here');
        console.log('');
        console.log('5. **Test After Fix**:');
        console.log('   - Redeploy your service');
        console.log('   - Test OAuth flow again');
        console.log('   - Check logs for success messages');
        
        console.log('\n🎯 Expected Success Flow:');
        console.log('========================');
        console.log('1. User clicks "Sign in with Google"');
        console.log('2. Google redirects to: travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
        console.log('3. API logs show: "OAuth Callback Debug"');
        console.log('4. API logs show: "User created/found"');
        console.log('5. API logs show: "JWT token created"');
        console.log('6. API logs show: "Cookie set"');
        console.log('7. API logs show: "Redirecting to: https://www.comfortmytrip.com/?token=..."');
        console.log('8. User is redirected to comfortmytrip.com with token');
        console.log('9. User is logged in!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the fix script
fixOAuthIssue();
