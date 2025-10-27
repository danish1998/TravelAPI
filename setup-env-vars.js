#!/usr/bin/env node

// Environment Variable Setup Script
console.log('🔧 Environment Variable Setup');
console.log('=============================');

console.log('\n📋 Required Environment Variables for Render:');
console.log('==============================================');

const envVars = {
    'GOOGLE_CLIENT_ID': '1017864146115-6uq898gljoc2be49ue77504ijv8v0kt3.apps.googleusercontent.com',
    'GOOGLE_CLIENT_SECRET': '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',
    'JWT_SECRET': 'secret123',
    'MONGODB_URI': 'mongodb+srv://mohddanish1998:D%40nish1998@project001.bbnem5h.mongodb.net/travel?retryWrites=true&w=majority',
    'FRONTEND_URL': 'https://www.comfortmytrip.com',
    'SESSION_SECRET': 'secret123', // Same as JWT_SECRET is fine
    'NODE_ENV': 'production'
};

console.log('\n✅ You already have these set:');
Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
});

console.log('\n🚨 MISSING: SESSION_SECRET');
console.log('==========================');
console.log('You need to add SESSION_SECRET to your Render environment variables.');
console.log('');
console.log('🔧 How to add it:');
console.log('1. Go to Render dashboard');
console.log('2. Find your TravelAPI service');
console.log('3. Go to Environment tab');
console.log('4. Add new variable:');
console.log('   Key: SESSION_SECRET');
console.log('   Value: secret123');
console.log('5. Save and redeploy');
console.log('');
console.log('🎯 After adding SESSION_SECRET:');
console.log('1. Redeploy your service');
console.log('2. Test OAuth flow');
console.log('3. Check logs for debug messages');
console.log('');
console.log('✅ Expected result:');
console.log('- OAuth callback should work');
console.log('- User should be redirected to comfortmytrip.com with token');
console.log('- Cookie should be set automatically');
console.log('- /auth/me should return user data');
