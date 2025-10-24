const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function setupGeminiAPI() {
  console.log('🔧 Setting up Gemini API...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
  
  // Try different approaches to access Gemini
  const approaches = [
    {
      name: 'Direct API call with fetch',
      test: async () => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        return data;
      }
    },
    {
      name: 'Test with different model names',
      test: async () => {
        const modelNames = [
          'gemini-pro',
          'gemini-1.5-pro',
          'gemini-1.0-pro',
          'gemini-pro-vision',
          'gemini-1.5-flash',
          'models/gemini-pro',
          'models/gemini-1.5-pro',
          'text-bison-001',
          'chat-bison-001'
        ];
        
        for (const modelName of modelNames) {
          try {
            console.log(`Testing model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hello');
            const response = await result.response;
            const text = response.text();
            console.log(`✅ ${modelName} works! Response: ${text}`);
            return { success: true, model: modelName };
          } catch (error) {
            console.log(`❌ ${modelName} failed: ${error.message}`);
          }
        }
        return { success: false };
      }
    }
  ];
  
  for (const approach of approaches) {
    try {
      console.log(`\n🧪 Testing: ${approach.name}`);
      const result = await approach.test();
      if (result.success) {
        console.log(`✅ Success with approach: ${approach.name}`);
        return result;
      }
    } catch (error) {
      console.log(`❌ Failed with approach: ${approach.name}`, error.message);
    }
  }
  
  console.log('\n❌ All approaches failed. Please check your Gemini API setup.');
  return { success: false };
}

setupGeminiAPI();
