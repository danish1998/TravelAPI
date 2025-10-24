const axios = require('axios');

// Demo configuration
const BASE_URL = 'http://localhost:8080/api/v1/ai-planning';

/**
 * Demo: Generate AI travel recommendations for a 3-day trip
 */
async function demoGenerateRecommendations() {
  console.log('🎯 Demo: Generating AI Travel Recommendations for 3-Day Trip');
  console.log('=' .repeat(60));
  
  const requestData = {
    destination: 'Paris',
    duration: 3,
    budget: 1500,
    preferences: ['culture', 'food', 'sightseeing'],
    startDate: '2024-06-01',
    endDate: '2024-06-04'
  };
  
  console.log('📋 Request Data:');
  console.log(JSON.stringify(requestData, null, 2));
  console.log('\n🚀 Calling AI Planning API...');
  
  try {
    const response = await axios.post(`${BASE_URL}/generate`, requestData);
    
    console.log('\n✅ Success! AI Generated Recommendations:');
    console.log('=' .repeat(60));
    console.log(`Plan ID: ${response.data.data.planId}`);
    console.log(`Destination: ${response.data.data.destination}`);
    console.log(`Duration: ${response.data.data.duration} days`);
    console.log(`Budget: $${requestData.budget}`);
    
    const recommendations = response.data.data.recommendations;
    
    if (recommendations.itinerary) {
      console.log('\n📅 Daily Itinerary:');
      recommendations.itinerary.forEach(day => {
        console.log(`\nDay ${day.day}:`);
        day.activities.forEach(activity => {
          console.log(`  • ${activity}`);
        });
        console.log(`  💰 Estimated Cost: $${day.estimatedCost}`);
        console.log(`  ⏰ Time Required: ${day.timeRequired}`);
      });
    }
    
    if (recommendations.totalEstimatedCost) {
      console.log(`\n💰 Total Estimated Cost: $${recommendations.totalEstimatedCost}`);
    }
    
    if (recommendations.travelTips) {
      console.log('\n💡 Travel Tips:');
      recommendations.travelTips.forEach(tip => {
        console.log(`  • ${tip}`);
      });
    }
    
    if (recommendations.mustVisitPlaces) {
      console.log('\n🏛️ Must-Visit Places:');
      recommendations.mustVisitPlaces.forEach(place => {
        console.log(`  • ${place}`);
      });
    }
    
    return response.data.data.planId;
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    return null;
  }
}

/**
 * Demo: Get destination suggestions based on duration
 */
async function demoDestinationSuggestions() {
  console.log('\n\n🌍 Demo: Getting Destination Suggestions for 5 Days');
  console.log('=' .repeat(60));
  
  const params = {
    duration: 5,
    budget: 2000,
    preferences: 'beach,adventure'
  };
  
  console.log('📋 Query Parameters:');
  console.log(JSON.stringify(params, null, 2));
  console.log('\n🚀 Calling Destination Suggestions API...');
  
  try {
    const response = await axios.get(`${BASE_URL}/destinations`, { params });
    
    console.log('\n✅ Success! Destination Suggestions:');
    console.log('=' .repeat(60));
    
    if (response.data.data.suggestions) {
      response.data.data.suggestions.forEach((destination, index) => {
        console.log(`\n${index + 1}. ${destination.name}, ${destination.country}`);
        console.log(`   📝 Reason: ${destination.reason}`);
        console.log(`   💰 Budget Range: ${destination.budgetRange}`);
        console.log(`   🏆 Feasibility Score: ${destination.feasibilityScore}/10`);
        console.log(`   🌟 Highlights: ${destination.attractions?.join(', ')}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

/**
 * Demo: Quick plan generation
 */
async function demoQuickPlan() {
  console.log('\n\n⚡ Demo: Quick Plan Generation');
  console.log('=' .repeat(60));
  
  const requestData = {
    days: 7,
    budget: 3000
  };
  
  console.log('📋 Request Data:');
  console.log(JSON.stringify(requestData, null, 2));
  console.log('\n🚀 Calling Quick Plan API...');
  
  try {
    const response = await axios.post(`${BASE_URL}/quick-plan`, requestData);
    
    console.log('\n✅ Success! Quick Plan Generated:');
    console.log('=' .repeat(60));
    
    const plan = response.data.data;
    console.log(`Duration: ${plan.duration} days`);
    console.log(`Budget: $${plan.budget}`);
    
    if (plan.recommendations.suggestedDestinations) {
      console.log('\n🌍 Suggested Destinations:');
      plan.recommendations.suggestedDestinations.forEach((dest, index) => {
        console.log(`\n${index + 1}. ${dest.name}`);
        console.log(`   📝 Reason: ${dest.reason}`);
        console.log(`   💰 Estimated Cost: ${dest.estimatedCost}`);
        console.log(`   🌟 Highlights: ${dest.highlights.join(', ')}`);
      });
    }
    
    if (plan.recommendations.travelTips) {
      console.log('\n💡 Travel Tips:');
      plan.recommendations.travelTips.forEach(tip => {
        console.log(`  • ${tip}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

/**
 * Demo: Feasibility check
 */
async function demoFeasibilityCheck() {
  console.log('\n\n🔍 Demo: Feasibility Check');
  console.log('=' .repeat(60));
  
  const destination = 'Tokyo';
  const days = 2;
  
  console.log(`Checking feasibility for ${destination} with ${days} days`);
  console.log('\n🚀 Calling Feasibility Check API...');
  
  try {
    const response = await axios.get(`${BASE_URL}/feasibility/${destination}/${days}`);
    
    console.log('\n✅ Success! Feasibility Assessment:');
    console.log('=' .repeat(60));
    
    const feasibility = response.data.data;
    console.log(`Destination: ${feasibility.destination}`);
    console.log(`Days: ${feasibility.days}`);
    console.log(`Feasible: ${feasibility.isFeasible ? '✅ Yes' : '❌ No'}`);
    console.log(`Feasibility Score: ${feasibility.feasibilityScore}/10`);
    
    if (feasibility.reasons) {
      console.log('\n📝 Reasons:');
      feasibility.reasons.forEach(reason => {
        console.log(`  • ${reason}`);
      });
    }
    
    if (feasibility.suggestions) {
      console.log('\n💡 Suggestions:');
      feasibility.suggestions.forEach(suggestion => {
        console.log(`  • ${suggestion}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

/**
 * Run all demos
 */
async function runDemos() {
  console.log('🎬 AI Travel Planning API Demo');
  console.log('=' .repeat(60));
  console.log('This demo showcases the AI-powered travel planning capabilities');
  console.log('Make sure your server is running on http://localhost:8080');
  console.log('And you have set up your GEMINI_API_KEY in the .env file');
  console.log('=' .repeat(60));
  
  try {
    // Demo 1: Generate recommendations
    await demoGenerateRecommendations();
    
    // Demo 2: Destination suggestions
    await demoDestinationSuggestions();
    
    // Demo 3: Quick plan
    await demoQuickPlan();
    
    // Demo 4: Feasibility check
    await demoFeasibilityCheck();
    
    console.log('\n\n🎉 All demos completed successfully!');
    console.log('=' .repeat(60));
    console.log('Your AI Travel Planning API is ready to use! 🚀');
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('  1. Your server is running on http://localhost:8080');
    console.log('  2. You have set up GEMINI_API_KEY in your .env file');
    console.log('  3. MongoDB is running and connected');
  }
}

// Run demos if this file is executed directly
if (require.main === module) {
  runDemos();
}

module.exports = {
  runDemos,
  demoGenerateRecommendations,
  demoDestinationSuggestions,
  demoQuickPlan,
  demoFeasibilityCheck
};
