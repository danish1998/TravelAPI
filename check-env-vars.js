#!/usr/bin/env node

// Environment Variable Checker
console.log('🔍 Environment Variables Check');
console.log('==============================');

const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'JWT_SECRET',
    'MONGODB_URI',
    'SESSION_SECRET'
];

console.log('\n📋 Required Environment Variables:');
console.log('===================================');

let allSet = true;

requiredVars.forEach(varName => {
    const isSet = process.env[varName] ? '✅ SET' : '❌ NOT SET';
    console.log(`${varName}: ${isSet}`);
    
    if (!process.env[varName]) {
        allSet = false;
    }
});

console.log('\n🎯 Status:');
console.log('==========');
if (allSet) {
    console.log('✅ All required environment variables are set!');
} else {
    console.log('❌ Some environment variables are missing!');
    console.log('');
    console.log('🔧 Action Required:');
    console.log('1. Go to Render dashboard');
    console.log('2. Find your TravelAPI service');
    console.log('3. Go to Environment tab');
    console.log('4. Set the missing variables');
    console.log('');
    console.log('📋 Values needed:');
    console.log('- GOOGLE_CLIENT_ID: Your Google OAuth Client ID');
    console.log('- GOOGLE_CLIENT_SECRET: Your Google OAuth Client Secret');
    console.log('- JWT_SECRET: Any random string (e.g., "your-secret-key-here")');
    console.log('- MONGODB_URI: Your MongoDB connection string');
    console.log('- SESSION_SECRET: Any random string (can be same as JWT_SECRET)');
}

console.log('\n🧪 Test OAuth Callback:');
console.log('=======================');
console.log('After setting environment variables, test with:');
console.log('node test-current-callback.js');
