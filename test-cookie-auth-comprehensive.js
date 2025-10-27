#!/usr/bin/env node

const axios = require('axios');

// Test cookie-based authentication with proper cookie handling
async function testCookieAuth() {
    console.log('🧪 Testing Cookie-Based Authentication');
    console.log('=====================================');
    
    const API_BASE = 'https://travelapi-r7bq.onrender.com/api/v1';
    
    // Create axios instance with cookie jar
    const cookieJar = new Map();
    
    const api = axios.create({
        baseURL: API_BASE,
        withCredentials: true, // Important for cookies
        timeout: 10000
    });
    
    // Interceptor to handle cookies
    api.interceptors.response.use(
        (response) => {
            const setCookieHeader = response.headers['set-cookie'];
            if (setCookieHeader) {
                setCookieHeader.forEach(cookie => {
                    const [nameValue] = cookie.split(';');
                    const [name, value] = nameValue.split('=');
                    cookieJar.set(name.trim(), value.trim());
                });
            }
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    
    // Interceptor to send cookies
    api.interceptors.request.use(
        (config) => {
            if (cookieJar.size > 0) {
                const cookieString = Array.from(cookieJar.entries())
                    .map(([name, value]) => `${name}=${value}`)
                    .join('; ');
                config.headers.Cookie = cookieString;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    
    try {
        // Test 1: Check auth status without cookies
        console.log('\n1. Testing /auth/status without cookies:');
        const statusResponse = await api.get('/auth/status');
        console.log('✅ Status:', statusResponse.data);
        
        // Test 2: Test /auth/me without cookies (should fail)
        console.log('\n2. Testing /auth/me without cookies:');
        try {
            await api.get('/auth/me');
        } catch (error) {
            console.log('✅ Expected error:', error.response.data);
        }
        
        // Test 3: Test OAuth initiation
        console.log('\n3. Testing OAuth initiation:');
        try {
            const oauthResponse = await api.get('/auth/google', {
                maxRedirects: 0,
                validateStatus: (status) => status < 400
            });
            console.log('✅ OAuth redirect status:', oauthResponse.status);
            console.log('✅ OAuth redirect location:', oauthResponse.headers.location);
        } catch (error) {
            if (error.response && error.response.status >= 300 && error.response.status < 400) {
                console.log('✅ OAuth redirect status:', error.response.status);
                console.log('✅ OAuth redirect location:', error.response.headers.location);
            } else {
                console.log('❌ OAuth error:', error.message);
            }
        }
        
        // Test 4: Test logout (should work without authentication)
        console.log('\n4. Testing logout:');
        try {
            const logoutResponse = await api.get('/auth/logout');
            console.log('✅ Logout response:', logoutResponse.data);
        } catch (error) {
            console.log('❌ Logout error:', error.response?.data || error.message);
        }
        
        console.log('\n🎯 Manual Test Instructions:');
        console.log('============================');
        console.log('1. Open browser and go to: https://travelapi-r7bq.onrender.com/api/v1/auth/google');
        console.log('2. Complete Google authentication');
        console.log('3. Check browser developer tools → Application → Cookies');
        console.log('4. Look for cookie named "token"');
        console.log('5. Test /auth/me endpoint with the cookie');
        console.log('');
        console.log('🔧 Cookie Configuration:');
        console.log('- Cookie name: "token"');
        console.log('- HttpOnly: true');
        console.log('- Secure: true (production)');
        console.log('- SameSite: "lax"');
        console.log('- Path: "/"');
        console.log('- MaxAge: 24 hours');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testCookieAuth();
