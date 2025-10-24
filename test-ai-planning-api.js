const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:8080/api/v1/ai-planning';

// Test data
const testData = {
  destination: 'Paris',
  duration: 3,
  budget: 1500,
  preferences: ['culture', 'food', 'sightseeing'],
  startDate: '2024-06-01',
  endDate: '2024-06-04'
};

const quickPlanData = {
  days: 5,
  budget: 2000
};

/**
 * Test AI travel recommendations generation
 */
async function testGenerateRecommendations() {
  console.log('\n🧪 Testing AI Travel Recommendations Generation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/generate`, testData);
    
    console.log('✅ Success! Generated recommendations:');
    console.log('Plan ID:', response.data.data.planId);
    console.log('Destination:', response.data.data.destination);
    console.log('Duration:', response.data.data.duration);
    console.log('Recommendations:', JSON.stringify(response.data.data.recommendations, null, 2));
    
    return response.data.data.planId;
  } catch (error) {
    console.error('❌ Error generating recommendations:', error.response?.data || error.message);
    return null;
  }
}

/**
 * Test destination suggestions
 */
async function testDestinationSuggestions() {
  console.log('\n🧪 Testing Destination Suggestions...');
  
  try {
    const response = await axios.get(`${BASE_URL}/destinations`, {
      params: {
        duration: 7,
        budget: 2500,
        preferences: 'beach,adventure'
      }
    });
    
    console.log('✅ Success! Destination suggestions:');
    console.log(JSON.stringify(response.data.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error getting destination suggestions:', error.response?.data || error.message);
  }
}

/**
 * Test quick plan generation
 */
async function testQuickPlan() {
  console.log('\n🧪 Testing Quick Plan Generation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/quick-plan`, quickPlanData);
    
    console.log('✅ Success! Quick plan generated:');
    console.log(JSON.stringify(response.data.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error generating quick plan:', error.response?.data || error.message);
  }
}

/**
 * Test feasibility check
 */
async function testFeasibilityCheck() {
  console.log('\n🧪 Testing Feasibility Check...');
  
  try {
    const response = await axios.get(`${BASE_URL}/feasibility/Paris/3`);
    
    console.log('✅ Success! Feasibility check:');
    console.log(JSON.stringify(response.data.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error checking feasibility:', error.response?.data || error.message);
  }
}

/**
 * Test getting travel plans
 */
async function testGetTravelPlans() {
  console.log('\n🧪 Testing Get Travel Plans...');
  
  try {
    const response = await axios.get(`${BASE_URL}/plans`);
    
    console.log('✅ Success! Travel plans:');
    console.log(`Found ${response.data.data.length} plans`);
    if (response.data.data.length > 0) {
      console.log('Latest plan:', JSON.stringify(response.data.data[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error getting travel plans:', error.response?.data || error.message);
  }
}

/**
 * Test getting specific travel plan
 */
async function testGetTravelPlan(planId) {
  if (!planId) {
    console.log('\n⚠️ Skipping get specific plan test - no plan ID available');
    return;
  }
  
  console.log('\n🧪 Testing Get Specific Travel Plan...');
  
  try {
    const response = await axios.get(`${BASE_URL}/plans/${planId}`);
    
    console.log('✅ Success! Specific travel plan:');
    console.log(JSON.stringify(response.data.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error getting specific travel plan:', error.response?.data || error.message);
  }
}

/**
 * Test updating travel plan status
 */
async function testUpdatePlanStatus(planId) {
  if (!planId) {
    console.log('\n⚠️ Skipping update plan status test - no plan ID available');
    return;
  }
  
  console.log('\n🧪 Testing Update Travel Plan Status...');
  
  try {
    const response = await axios.put(`${BASE_URL}/plans/${planId}/status`, {
      status: 'saved'
    });
    
    console.log('✅ Success! Plan status updated:');
    console.log('New status:', response.data.data.status);
    
  } catch (error) {
    console.error('❌ Error updating plan status:', error.response?.data || error.message);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting AI Planning API Tests...');
  console.log('Base URL:', BASE_URL);
  
  try {
    // Test 1: Generate recommendations
    const planId = await testGenerateRecommendations();
    
    // Test 2: Destination suggestions
    await testDestinationSuggestions();
    
    // Test 3: Quick plan
    await testQuickPlan();
    
    // Test 4: Feasibility check
    await testFeasibilityCheck();
    
    // Test 5: Get all plans
    await testGetTravelPlans();
    
    // Test 6: Get specific plan
    await testGetTravelPlan(planId);
    
    // Test 7: Update plan status
    await testUpdatePlanStatus(planId);
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testGenerateRecommendations,
  testDestinationSuggestions,
  testQuickPlan,
  testFeasibilityCheck,
  testGetTravelPlans,
  testGetTravelPlan,
  testUpdatePlanStatus
};
