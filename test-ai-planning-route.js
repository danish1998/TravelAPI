const axios = require('axios');

// Test the AI planning API
async function testAIPlanningAPI() {
  const baseURL = 'http://localhost:8080';
  
  console.log('🧪 Testing AI Planning API...\n');

  try {
    // Test 1: Generate comprehensive travel plan
    console.log('1️⃣ Testing POST /api/v1/ai-planning/generate-comprehensive-plan');
    
    const testData = {
      country: "Japan",
      numberOfDays: 5,
      travelStyle: "Cultural",
      interests: ["temples", "food", "history", "nature"],
      budget: "Medium",
      groupType: "Couple",
      userId: "507f1f77bcf86cd799439011" // Valid ObjectId format
    };

    console.log('📤 Sending request with data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(`${baseURL}/api/v1/ai-planning/generate-comprehensive-plan`, testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout for AI processing
    });

    console.log('✅ Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.data.planId) {
      const planId = response.data.data.planId;
      
      // Test 2: Get the created plan
      console.log('\n2️⃣ Testing GET /api/v1/ai-planning/plan/:planId');
      const getResponse = await axios.get(`${baseURL}/api/v1/ai-planning/plan/${planId}`);
      console.log('✅ Get Plan Status:', getResponse.status);
      console.log('📥 Get Plan Data:', JSON.stringify(getResponse.data, null, 2));

      // Test 3: Get all plans
      console.log('\n3️⃣ Testing GET /api/v1/ai-planning/plans');
      const allPlansResponse = await axios.get(`${baseURL}/api/v1/ai-planning/plans`);
      console.log('✅ All Plans Status:', allPlansResponse.status);
      console.log('📥 All Plans Count:', allPlansResponse.data.data?.length || 0);

      // Test 4: Update plan status
      console.log('\n4️⃣ Testing PUT /api/v1/ai-planning/plan/:planId/status');
      const updateResponse = await axios.put(`${baseURL}/api/v1/ai-planning/plan/${planId}/status`, {
        status: 'confirmed'
      });
      console.log('✅ Update Status:', updateResponse.status);
      console.log('📥 Update Data:', JSON.stringify(updateResponse.data, null, 2));

    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('📥 Error Response:', error.response.data);
      console.error('📊 Error Status:', error.response.status);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused - Make sure the server is running on port 8080');
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - AI processing took too long');
    }
  }
}

// Run the test
testAIPlanningAPI();
