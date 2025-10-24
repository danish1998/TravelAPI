const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

console.log('🔍 Testing Gemini API with simple approach...');
console.log('API Key:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    // Try the most basic approach
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = "Hello, can you respond with 'Gemini is working!'";
    
    console.log('🧪 Testing with gemini-1.5-flash...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Success! Response:', text);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    
    // Try alternative models
    const modelsToTry = [
      'gemini-1.5-pro',
      'gemini-1.0-pro', 
      'gemini-pro',
      'gemini-1.5-flash-8b',
      'gemini-1.5-flash-001'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`🧪 Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName} works! Response:`, text);
        return;
      } catch (modelError) {
        console.log(`❌ ${modelName} failed:`, modelError.message);
      }
    }
    
    console.log('\n📋 Troubleshooting steps:');
    console.log('1. Check if your API key is valid');
    console.log('2. Enable Generative Language API in Google Cloud Console');
    console.log('3. Make sure you have the correct permissions');
    console.log('4. Try getting a new API key from: https://makersuite.google.com/app/apikey');
  }
}

testGemini();
