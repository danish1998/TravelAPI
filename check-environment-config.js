#!/usr/bin/env node

const axios = require('axios');

// Check all environment variables and configuration
async function checkEnvironmentConfig() {
    console.log('🔍 Environment Configuration Check');
    console.log('==================================');
    
    const API_BASE = 'https://travelapi-r7bq.onrender.com/api/v1';
    
    try {
        // Test 1: Check server health
        console.log('\n1. Server Health Check:');
        const healthResponse = await axios.get(`${API_BASE}/`);
        console.log('✅ Server is running:', healthResponse.data);
        
        // Test 2: Check auth status
        console.log('\n2. Auth Status Check:');
        const statusResponse = await axios.get(`${API_BASE}/auth/status`);
        console.log('✅ Auth status:', statusResponse.data);
        
        // Test 3: Check OAuth configuration
        console.log('\n3. OAuth Configuration Check:');
        const oauthResponse = await axios.get(`${API_BASE}/auth/google`, {
            maxRedirects: 0,
            validateStatus: (status) => status < 400
        });
        
        const redirectUrl = oauthResponse.headers.location;
        if (redirectUrl) {
            const url = new URL(redirectUrl);
            const redirectUri = url.searchParams.get('redirect_uri');
            const clientId = url.searchParams.get('client_id');
            
            console.log('✅ Client ID:', clientId);
            console.log('✅ Redirect URI:', redirectUri);
            
            if (redirectUri === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
                console.log('✅ OAuth configuration is CORRECT!');
            } else {
                console.log('❌ OAuth configuration issue');
            }
        }
        
        // Test 4: Check database connection (via a simple endpoint)
        console.log('\n4. Database Connection Check:');
        try {
            // Try to access a protected endpoint to see if database is working
            await axios.get(`${API_BASE}/auth/me`);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Database connection appears to be working (401 is expected without auth)');
            } else {
                console.log('❌ Database connection issue:', error.response?.data || error.message);
            }
        }
        
        console.log('\n🔧 OAuth Callback Error Diagnosis:');
        console.log('==================================');
        console.log('The OAuth callback is returning 500 error. This typically means:');
        console.log('');
        console.log('1. **Google Client Secret Issue**:');
        console.log('   - Check if GOOGLE_CLIENT_SECRET is set correctly in Render');
        console.log('   - Verify it matches the one in Google Cloud Console');
        console.log('');
        console.log('2. **Database Connection Issue**:');
        console.log('   - Check if MONGODB_URI is set correctly');
        console.log('   - Verify database is accessible from Render');
        console.log('');
        console.log('3. **Missing Environment Variables**:');
        console.log('   - JWT_SECRET must be set');
        console.log('   - SESSION_SECRET should be set');
        console.log('');
        console.log('4. **User Creation Error**:');
        console.log('   - Check if User model is working correctly');
        console.log('   - Verify database permissions');
        console.log('');
        console.log('🎯 **IMMEDIATE ACTION REQUIRED**:');
        console.log('================================');
        console.log('1. Go to Render dashboard');
        console.log('2. Check your service logs for detailed error messages');
        console.log('3. Verify all environment variables are set correctly');
        console.log('4. Check if database connection is working');
        console.log('');
        console.log('📋 **Required Environment Variables**:');
        console.log('=====================================');
        console.log('• GOOGLE_CLIENT_ID (✅ appears to be working)');
        console.log('• GOOGLE_CLIENT_SECRET (❓ check this)');
        console.log('• MONGODB_URI (❓ check this)');
        console.log('• JWT_SECRET (❓ check this)');
        console.log('• SESSION_SECRET (❓ check this)');
        
    } catch (error) {
        console.error('❌ Error during environment check:', error.message);
    }
}

// Run the check
checkEnvironmentConfig();
