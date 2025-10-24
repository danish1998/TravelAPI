const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testAlternativeModels() {
  console.log('🔍 Testing alternative Gemini models...');
  
  // Try different model names that might work with your API key
  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro-vision',
    'gemini-1.5-flash',
    'models/gemini-pro',
    'models/gemini-1.5-pro',
    'text-bison-001',
    'chat-bison-001',
    'text-bison@001',
    'chat-bison@001'
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`\n🧪 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hello, test message');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ SUCCESS! ${modelName} works!`);
      console.log(`Response: ${text}`);
      return modelName;
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}`);
    }
  }
  
  console.log('\n❌ No working models found with your API key');
  return null;
}

testAlternativeModels();
