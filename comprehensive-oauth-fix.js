#!/usr/bin/env node

const axios = require('axios');

// Comprehensive OAuth Fix Script
async function comprehensiveOAuthFix() {
    console.log('🚀 Comprehensive OAuth Fix');
    console.log('==========================');
    
    const API_BASE = 'https://travelapi-r7bq.onrender.com/api/v1';
    
    try {
        // Step 1: Check if deployment is complete
        console.log('\n1. Checking deployment status...');
        const healthResponse = await axios.get(`${API_BASE}/`);
        console.log('✅ Server is running:', healthResponse.data);
        
        // Step 2: Test OAuth configuration
        console.log('\n2. Testing OAuth configuration...');
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
        
        // Step 3: Test OAuth callback with fresh authorization
        console.log('\n3. Testing OAuth callback...');
        console.log('Go to: https://travelapi-r7bq.onrender.com/api/v1/auth/google');
        console.log('Complete the OAuth flow and check Render logs for debug messages.');
        
        console.log('\n🔧 CRITICAL: Add SESSION_SECRET to Render');
        console.log('==========================================');
        console.log('1. Go to Render dashboard: https://dashboard.render.com/');
        console.log('2. Find your TravelAPI service');
        console.log('3. Go to Environment tab');
        console.log('4. Add new variable:');
        console.log('   Key: SESSION_SECRET');
        console.log('   Value: secret123');
        console.log('5. Save and redeploy');
        
        console.log('\n📋 Expected Debug Messages in Render Logs:');
        console.log('==========================================');
        console.log('After adding SESSION_SECRET and testing OAuth:');
        console.log('');
        console.log('✅ SUCCESS LOGS:');
        console.log('- "=== Passport OAuth Strategy Started ==="');
        console.log('- "Google OAuth Profile ID: [profile_id]"');
        console.log('- "Google OAuth Email: [email]"');
        console.log('- "🔍 Starting findOrCreateOAuthUser"');
        console.log('- "📧 Email: [email], Google ID: [google_id]"');
        console.log('- "✅ User created/found: [user_id]"');
        console.log('- "=== OAuth Callback Debug ==="');
        console.log('- "✅ JWT token created"');
        console.log('- "✅ Cookie set"');
        console.log('- "✅ Redirecting to: https://www.comfortmytrip.com/?token=..."');
        console.log('');
        console.log('❌ ERROR LOGS (if still failing):');
        console.log('- "❌ Google OAuth Strategy Error:"');
        console.log('- "❌ OAuth user creation error:"');
        console.log('- "Duplicate key error details:"');
        
        console.log('\n🎯 Final Test Steps:');
        console.log('===================');
        console.log('1. **Add SESSION_SECRET** to Render environment variables');
        console.log('2. **Wait 2-3 minutes** for deployment');
        console.log('3. **Test OAuth flow**: https://travelapi-r7bq.onrender.com/api/v1/auth/google');
        console.log('4. **Check Render logs** for debug messages');
        console.log('5. **Verify redirect** to comfortmytrip.com with token');
        
        console.log('\n✅ Expected Final Result:');
        console.log('=========================');
        console.log('1. User clicks "Sign in with Google"');
        console.log('2. Google redirects to: travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
        console.log('3. API processes the code successfully');
        console.log('4. API sets JWT cookie');
        console.log('5. API redirects to: https://www.comfortmytrip.com/?token=JWT_TOKEN');
        console.log('6. User is logged in!');
        console.log('7. /auth/me returns user data instead of "Authentication token missing"');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the comprehensive fix
comprehensiveOAuthFix();
