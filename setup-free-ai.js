#!/usr/bin/env node

console.log('🆓 Setting up Free AI Service for Travel API...\n');

// Check if groq-sdk is installed
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('📦 Checking dependencies...');

if (!packageJson.dependencies['groq-sdk']) {
  console.log('❌ groq-sdk not found. Installing...');
  console.log('💡 Run: npm install groq-sdk');
} else {
  console.log('✅ groq-sdk is already installed');
}

console.log('\n🔑 Environment Setup:');
console.log('1. Get your free Groq API key: https://console.groq.com/');
console.log('2. Create a .env file with:');
console.log('   GROQ_API_KEY=your_groq_api_key_here');
console.log('3. Replace your current controller with the Groq version');

console.log('\n📁 Files to update:');
console.log('1. Replace Controllers/aiPlanningController.js with Controllers/aiPlanningController-groq.js');
console.log('2. Make sure ai-service-groq.js is in your project root');

console.log('\n🚀 Benefits of Groq:');
console.log('✅ 14,400 requests/day FREE');
console.log('✅ No credit card required');
console.log('✅ Fast Llama models');
console.log('✅ No more Gemini errors!');

console.log('\n🧪 Test your setup:');
console.log('1. Start your server: node server.js');
console.log('2. Test the API endpoints');
console.log('3. Check the logs for Groq responses');

console.log('\n📚 Documentation:');
console.log('- Groq Console: https://console.groq.com/');
console.log('- Groq Docs: https://console.groq.com/docs');
console.log('- Setup Guide: FREE_AI_SETUP.md');

console.log('\n🎉 You\'re all set! Your Travel API will work with free AI!');
