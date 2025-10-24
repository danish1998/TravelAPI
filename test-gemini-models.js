const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGeminiModels() {
  try {
    console.log('🔍 Testing Gemini API with your key...');
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
    
    // Try different model names
    const models = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro-vision'];
    
    for (const modelName of models) {
      try {
        console.log(`\n🧪 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Hello, are you working?');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} is working!`);
        console.log(`Response: ${text}`);
        break; // If we find a working model, use it
        
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing Gemini models:', error.message);
  }
}

testGeminiModels();
