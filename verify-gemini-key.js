const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function verifyGeminiKey() {
  console.log('🔍 Verifying Gemini API Key...');
  console.log('API Key:', process.env.GEMINI_API_KEY);
  console.log('API Key Length:', process.env.GEMINI_API_KEY?.length);
  
  try {
    // Test with a simple request
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = 'Hello, please respond with "Gemini API is working!"';
    
    console.log('\n🧪 Testing Gemini API with simple prompt...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! Gemini API is working!');
    console.log('Response:', text);
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Gemini API Error:', error.message);
    
    // Check if it's a 404 error (model not found)
    if (error.message.includes('404 Not Found')) {
      console.log('\n🔧 Troubleshooting 404 Error:');
      console.log('1. Your API key might not have access to Gemini models');
      console.log('2. The Gemini API might not be enabled in your Google Cloud project');
      console.log('3. You might need to enable the Generative Language API');
      
      console.log('\n📋 Steps to fix:');
      console.log('1. Go to: https://console.cloud.google.com/');
      console.log('2. Select your project');
      console.log('3. Go to "APIs & Services" → "Library"');
      console.log('4. Search for "Generative Language API"');
      console.log('5. Click "Enable"');
      console.log('6. Or try: https://makersuite.google.com/app/apikey');
    }
    
    return false;
  }
}

verifyGeminiKey();
