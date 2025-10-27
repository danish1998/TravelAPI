#!/usr/bin/env node

// Test environment variable configuration
console.log('🔍 Environment Variable Test');
console.log('============================');

// Simulate production environment
process.env.NODE_ENV = 'production';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Test the callback URL logic
const callbackURL = process.env.GOOGLE_CALLBACK_URL || (process.env.NODE_ENV === 'production' 
    ? 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback'
    : 'http://localhost:8080/api/v1/auth/google/callback');

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('Calculated callbackURL:', callbackURL);

if (callbackURL === 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback') {
    console.log('✅ Callback URL is CORRECT!');
} else {
    console.log('❌ Callback URL is WRONG!');
    console.log('Expected: https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
    console.log('Actual:', callbackURL);
    
    if (process.env.GOOGLE_CALLBACK_URL) {
        console.log('');
        console.log('🔧 SOLUTION:');
        console.log('The GOOGLE_CALLBACK_URL environment variable is set incorrectly in production.');
        console.log('Set GOOGLE_CALLBACK_URL=https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback');
    }
}
