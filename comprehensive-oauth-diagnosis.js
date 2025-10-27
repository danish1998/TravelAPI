#!/usr/bin/env node

const axios = require('axios');

// Comprehensive OAuth diagnosis
async function comprehensiveOAuthDiagnosis() {
    console.log('🔍 Comprehensive OAuth Diagnosis');
    console.log('================================');
    
    const API_BASE = 'https://travelapi-r7bq.onrender.com/api/v1';
    
    try {
        // Test OAuth initiation
        console.log('\n1. Testing OAuth initiation...');
        const response = await axios.get(`${API_BASE}/auth/google`, {
            maxRedirects: 0,
            validateStatus: (status) => status < 400
        });
        
        console.log('✅ Status:', response.status);
        console.log('✅ Redirect URL:', response.headers.location);
        
        // Parse the redirect URL
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
            const url = new URL(redirectUrl);
            const redirectUri = url.searchParams.get('redirect_uri');
            const clientId = url.searchParams.get('client_id');
            
            console.log('\n2. OAuth Configuration Analysis:');
            console.log('==================================');
            console.log('✅ Client ID:', clientId);
            console.log('❌ Redirect URI:', redirectUri);
            
            if (redirectUri === 'https://www.comfortmytrip.com/') {
                console.log('\n🚨 ISSUE PERSISTS:');
                console.log('==================');
                console.log('The redirect_uri is still pointing to your frontend!');
                console.log('');
                console.log('🔍 POSSIBLE CAUSES:');
                console.log('1. Google Cloud Console changes haven\'t propagated yet (can take 5 minutes to hours)');
                console.log('2. Production environment variable GOOGLE_CALLBACK_URL is still set incorrectly');
                console.log('3. Server needs to be restarted to pick up new configuration');
                console.log('');
                console.log('🔧 IMMEDIATE SOLUTIONS:');
                console.log('=======================');
                console.log('A. Wait 5-10 minutes for Google changes to propagate');
                console.log('B. Check Render environment variables:');
                console.log('   - Go to Render dashboard');
                console.log('   - Find TravelAPI service');
                console.log('   - Check Environment tab');
                console.log('   - Look for GOOGLE_CALLBACK_URL');
                console.log('   - If it exists, delete it or set it to:');
                console.log('     https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                console.log('C. Restart/redeploy your Render service');
                console.log('');
                console.log('🧪 TEST AGAIN:');
                console.log('Run this script again in 5-10 minutes');
                
            } else if (redirectUri === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
                console.log('\n✅ SUCCESS! OAuth Configuration is CORRECT!');
                console.log('===========================================');
                console.log('The redirect_uri is now pointing to your API callback!');
                console.log('');
                console.log('🎯 NEXT STEPS:');
                console.log('1. Test the complete OAuth flow');
                console.log('2. Verify cookie-based authentication works');
                console.log('3. Test /auth/me endpoint');
                
            } else {
                console.log('\n⚠️  Unexpected redirect_uri:', redirectUri);
                console.log('Please check your Google Cloud Console configuration.');
            }
        }
        
        // Test auth endpoints
        console.log('\n3. Testing Auth Endpoints:');
        console.log('==========================');
        
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
        
    } catch (error) {
        if (error.response && error.response.status >= 300 && error.response.status < 400) {
            const redirectUrl = error.response.headers.location;
            if (redirectUrl) {
                const url = new URL(redirectUrl);
                const redirectUri = url.searchParams.get('redirect_uri');
                
                console.log('✅ Redirect URI:', redirectUri);
                
                if (redirectUri === 'https://www.comfortmytrip.com/') {
                    console.log('\n🚨 ISSUE PERSISTS:');
                    console.log('==================');
                    console.log('The redirect_uri is still pointing to your frontend!');
                    console.log('');
                    console.log('🔍 POSSIBLE CAUSES:');
                    console.log('1. Google Cloud Console changes haven\'t propagated yet (can take 5 minutes to hours)');
                    console.log('2. Production environment variable GOOGLE_CALLBACK_URL is still set incorrectly');
                    console.log('3. Server needs to be restarted to pick up new configuration');
                    console.log('');
                    console.log('🔧 IMMEDIATE SOLUTIONS:');
                    console.log('=======================');
                    console.log('A. Wait 5-10 minutes for Google changes to propagate');
                    console.log('B. Check Render environment variables');
                    console.log('C. Restart/redeploy your Render service');
                }
            }
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

// Run the diagnosis
comprehensiveOAuthDiagnosis();
