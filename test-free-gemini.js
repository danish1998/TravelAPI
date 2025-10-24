const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI with free API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testFreeGemini() {
  try {
    console.log('🔧 Testing Free Gemini API...');
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
    
    // Try the free Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = 'Hello, can you respond with a simple greeting?';
    
    console.log('🧪 Testing with prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Free Gemini API is working!');
    console.log('Response:', text);
    
    return true;
    
  } catch (error) {
    console.error('❌ Free Gemini API failed:', error.message);
    
    // Try alternative free model names
    const freeModels = [
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro'
    ];
    
    console.log('\n🧪 Trying alternative free models...');
    
    for (const modelName of freeModels) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName} works! Response: ${text}`);
        return true;
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message}`);
      }
    }
    
    return false;
  }
}

testFreeGemini();
