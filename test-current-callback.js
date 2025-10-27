#!/usr/bin/env node

const axios = require('axios');

// Test the current OAuth callback
async function testCurrentCallback() {
    console.log('🧪 Testing Current OAuth Callback');
    console.log('=================================');
    
    // Your current callback URL
    const callbackUrl = 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback?code=4%2F0Ab32j92B-Ev_GQ--6Q1S2rku6Bxe5-tp4CPmYBLuXx_W7GCbkZyn5bnZtihH4oq5MGgF9A&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent';
    
    console.log('Testing callback URL...');
    console.log('');
    
    try {
        const response = await axios.get(callbackUrl, {
            maxRedirects: 0,
            validateStatus: (status) => status < 400
        });
        
        console.log('✅ Callback Response:');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        
    } catch (error) {
        if (error.response) {
            console.log('❌ Callback Error:');
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
            
            if (error.response.status >= 300 && error.response.status < 400) {
                console.log('✅ Redirect detected:', error.response.headers.location);
                console.log('');
                console.log('🎉 SUCCESS! The OAuth callback is working!');
                console.log('The user should be redirected to:', error.response.headers.location);
            } else if (error.response.status === 500) {
                console.log('');
                console.log('🚨 SERVER ERROR: The OAuth callback is failing');
                console.log('This means there\'s an issue with:');
                console.log('1. Google Client Secret');
                console.log('2. Database connection');
                console.log('3. Missing environment variables');
                console.log('4. User creation/retrieval');
                console.log('');
                console.log('🔧 ACTION REQUIRED:');
                console.log('Check your Render logs for detailed error messages');
            }
        } else {
            console.log('❌ Network Error:', error.message);
        }
    }
    
    console.log('');
    console.log('📋 OAuth Flow Explanation:');
    console.log('=========================');
    console.log('1. User clicks "Sign in with Google" on comfortmytrip.com');
    console.log('2. User is redirected to Google OAuth consent screen');
    console.log('3. User authenticates with Google');
    console.log('4. Google redirects to: travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
    console.log('5. Your API processes the code and creates JWT token');
    console.log('6. Your API redirects user back to: comfortmytrip.com/?token=JWT_TOKEN');
    console.log('7. User is logged in on your website');
    console.log('');
    console.log('✅ The redirect to travelapi-r7bq.onrender.com is CORRECT!');
    console.log('❌ The issue is that your API callback is returning an error');
}

// Run the test
testCurrentCallback();
