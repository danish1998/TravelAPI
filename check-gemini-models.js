const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkAvailableModels() {
  try {
    console.log('🔍 Checking available Gemini models...');
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
    
    // Try to list models
    const models = await genAI.listModels();
    console.log('Available models:', models);
    
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
    
    // Try different model names
    const modelNames = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.0-pro',
      'gemini-pro-vision',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro'
    ];
    
    console.log('\n🧪 Testing different model names...');
    
    for (const modelName of modelNames) {
      try {
        console.log(`\nTesting model: ${modelName}`);
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
  }
}

checkAvailableModels();
