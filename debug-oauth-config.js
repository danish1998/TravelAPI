#!/usr/bin/env node

const axios = require('axios');

// Debug environment variables
async function debugEnvVars() {
    console.log('🔍 Debugging Environment Variables');
    console.log('==================================');
    
    const API_BASE = 'https://travelapi-r7bq.onrender.com/api/v1';
    
    try {
        // Test OAuth initiation and check the redirect URL
        console.log('\n1. Testing OAuth initiation:');
        const response = await axios.get(`${API_BASE}/auth/google`, {
            maxRedirects: 0,
            validateStatus: (status) => status < 400
        });
        
        console.log('✅ Status:', response.status);
        console.log('✅ Redirect URL:', response.headers.location);
        
        // Parse the redirect URL to see what's configured
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
            const url = new URL(redirectUrl);
            const redirectUri = url.searchParams.get('redirect_uri');
            console.log('✅ Google redirect_uri:', redirectUri);
            
            if (redirectUri === 'https://www.comfortmytrip.com/') {
                console.log('❌ PROBLEM: redirect_uri is pointing to frontend instead of API!');
                console.log('   Expected: https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                console.log('   Actual: https://www.comfortmytrip.com/');
                console.log('');
                console.log('🔧 SOLUTION: The GOOGLE_CALLBACK_URL environment variable needs to be set correctly.');
                console.log('   Set GOOGLE_CALLBACK_URL=https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
            } else if (redirectUri === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
                console.log('✅ redirect_uri is correct!');
            } else {
                console.log('⚠️  Unexpected redirect_uri:', redirectUri);
            }
        }
        
    } catch (error) {
        if (error.response && error.response.status >= 300 && error.response.status < 400) {
            console.log('✅ Status:', error.response.status);
            console.log('✅ Redirect URL:', error.response.headers.location);
            
            const redirectUrl = error.response.headers.location;
            if (redirectUrl) {
                const url = new URL(redirectUrl);
                const redirectUri = url.searchParams.get('redirect_uri');
                console.log('✅ Google redirect_uri:', redirectUri);
                
                if (redirectUri === 'https://www.comfortmytrip.com/') {
                    console.log('❌ PROBLEM: redirect_uri is pointing to frontend instead of API!');
                    console.log('   Expected: https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                    console.log('   Actual: https://www.comfortmytrip.com/');
                    console.log('');
                    console.log('🔧 SOLUTION: The GOOGLE_CALLBACK_URL environment variable needs to be set correctly.');
                    console.log('   Set GOOGLE_CALLBACK_URL=https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                } else if (redirectUri === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
                    console.log('✅ redirect_uri is correct!');
                } else {
                    console.log('⚠️  Unexpected redirect_uri:', redirectUri);
                }
            }
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

// Run the debug
debugEnvVars();
