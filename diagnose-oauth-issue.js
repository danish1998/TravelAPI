#!/usr/bin/env node

const axios = require('axios');

// Test current OAuth configuration and provide exact fix steps
async function diagnoseOAuthIssue() {
    console.log('🔍 OAuth Configuration Diagnosis');
    console.log('=================================');
    
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
                console.log('\n🚨 PROBLEM IDENTIFIED:');
                console.log('======================');
                console.log('The redirect_uri is pointing to your frontend instead of your API!');
                console.log('');
                console.log('Current (WRONG): https://www.comfortmytrip.com/');
                console.log('Should be:       https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                console.log('');
                console.log('🔧 EXACT FIX STEPS:');
                console.log('===================');
                console.log('1. Go to: https://console.cloud.google.com/');
                console.log('2. Navigate to: APIs & Services → Credentials');
                console.log('3. Find OAuth 2.0 Client ID:', clientId);
                console.log('4. Click "Edit"');
                console.log('5. In "Authorized redirect URIs" section:');
                console.log('   - REMOVE: https://www.comfortmytrip.com/');
                console.log('   - ADD: https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                console.log('6. Click "Save"');
                console.log('7. Wait 2-3 minutes for changes to propagate');
                console.log('8. Test again with this script');
                
            } else if (redirectUri === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
                console.log('\n✅ OAuth Configuration is CORRECT!');
                console.log('The issue might be elsewhere. Let\'s test cookie authentication...');
                
                // Test cookie authentication
                console.log('\n3. Testing Cookie Authentication:');
                console.log('==================================');
                
                try {
                    const meResponse = await axios.get(`${API_BASE}/auth/me`, {
                        withCredentials: true
                    });
                    console.log('✅ /auth/me response:', meResponse.data);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        console.log('❌ /auth/me failed:', error.response.data);
                        console.log('This is expected without authentication.');
                        console.log('');
                        console.log('🧪 Manual Test Instructions:');
                        console.log('============================');
                        console.log('1. Open browser and go to: https://travelapi-r7bq.onrender.com/api/v1/auth/google');
                        console.log('2. Complete Google authentication');
                        console.log('3. Check browser developer tools → Application → Cookies');
                        console.log('4. Look for cookie named "token"');
                        console.log('5. Test /auth/me endpoint with the cookie');
                    }
                }
                
            } else {
                console.log('\n⚠️  Unexpected redirect_uri:', redirectUri);
                console.log('Please check your Google Cloud Console configuration.');
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
                const clientId = url.searchParams.get('client_id');
                
                console.log('\n2. OAuth Configuration Analysis:');
                console.log('==================================');
                console.log('✅ Client ID:', clientId);
                console.log('❌ Redirect URI:', redirectUri);
                
                if (redirectUri === 'https://www.comfortmytrip.com/') {
                    console.log('\n🚨 PROBLEM IDENTIFIED:');
                    console.log('======================');
                    console.log('The redirect_uri is pointing to your frontend instead of your API!');
                    console.log('');
                    console.log('Current (WRONG): https://www.comfortmytrip.com/');
                    console.log('Should be:       https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                    console.log('');
                    console.log('🔧 EXACT FIX STEPS:');
                    console.log('===================');
                    console.log('1. Go to: https://console.cloud.google.com/');
                    console.log('2. Navigate to: APIs & Services → Credentials');
                    console.log('3. Find OAuth 2.0 Client ID:', clientId);
                    console.log('4. Click "Edit"');
                    console.log('5. In "Authorized redirect URIs" section:');
                    console.log('   - REMOVE: https://www.comfortmytrip.com/');
                    console.log('   - ADD: https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
                    console.log('6. Click "Save"');
                    console.log('7. Wait 2-3 minutes for changes to propagate');
                    console.log('8. Test again with this script');
                }
            }
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

// Run the diagnosis
diagnoseOAuthIssue();
