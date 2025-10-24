const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:8080/api/v1/ai-planning';

// Test data matching your form structure
const comprehensiveFormData = {
  destination: "Paris",
  country: "France",
  numberOfTravelers: 1,
  numberOfDays: 3,
  budgetINR: 50000,
  interests: ["Culture", "Food", "History", "Photography"],
  accommodationType: "Hotel",
  travelStyle: "Relaxed",
  groupType: "Solo",
  startDate: "2024-06-01",
  endDate: "2024-06-04"
};

// Available interests for reference
const availableInterests = [
  "Adventure",
  "Culture", 
  "Food",
  "Nature",
  "History",
  "Beaches",
  "Mountains",
  "Cities",
  "Nightlife",
  "Shopping",
  "Photography",
  "Wellness"
];

/**
 * Test comprehensive travel planning with exact form data
 */
async function testComprehensivePlanning() {
  console.log('🎯 Testing Comprehensive Travel Planning API');
  console.log('=' .repeat(60));
  
  console.log('📋 Form Data:');
  console.log(JSON.stringify(comprehensiveFormData, null, 2));
  
  console.log('\n🚀 Calling Comprehensive Planning API...');
  
  try {
    const response = await axios.post(`${BASE_URL}/comprehensive`, comprehensiveFormData);
    
    console.log('\n✅ Success! Comprehensive Travel Plan Generated:');
    console.log('=' .repeat(60));
    
    const plan = response.data.data;
    
    // Display basic plan info
    console.log(`📍 Destination: ${plan.destination}`);
    console.log(`📅 Duration: ${plan.duration} days`);
    console.log(`👥 Travelers: ${plan.travelers}`);
    console.log(`💰 Budget: ₹${plan.budget.inr} ($${plan.budget.usd})`);
    console.log(`🏨 Accommodation: ${plan.preferences.accommodation}`);
    console.log(`🎯 Travel Style: ${plan.preferences.travelStyle}`);
    console.log(`👤 Group Type: ${plan.preferences.groupType}`);
    console.log(`🎨 Interests: ${plan.preferences.interests.join(', ')}`);
    
    // Display AI recommendations
    if (plan.aiRecommendations) {
      console.log('\n🤖 AI Recommendations:');
      console.log('=' .repeat(40));
      
      // Daily Itinerary
      if (plan.aiRecommendations.dailyItinerary) {
        console.log('\n📅 Daily Itinerary:');
        plan.aiRecommendations.dailyItinerary.forEach(day => {
          console.log(`\nDay ${day.day}:`);
          day.activities.forEach(activity => {
            console.log(`  • ${activity}`);
          });
          console.log(`  🍽️ Breakfast: ${day.meals.breakfast}`);
          console.log(`  🍽️ Lunch: ${day.meals.lunch}`);
          console.log(`  🍽️ Dinner: ${day.meals.dinner}`);
          console.log(`  💰 Estimated Cost: $${day.estimatedCost}`);
          console.log(`  ⏰ Time Required: ${day.timeRequired}`);
        });
      }
      
      // Budget Breakdown
      if (plan.aiRecommendations.budgetBreakdown) {
        console.log('\n💰 Budget Breakdown:');
        const breakdown = plan.aiRecommendations.budgetBreakdown;
        console.log(`  🏨 Accommodation: $${breakdown.accommodation.total} ($${breakdown.accommodation.daily}/day)`);
        console.log(`  🍽️ Food: $${breakdown.food.total} ($${breakdown.food.daily}/day)`);
        console.log(`  🎯 Activities: $${breakdown.activities.total} ($${breakdown.activities.daily}/day)`);
        console.log(`  🚗 Transportation: $${breakdown.transportation.total} ($${breakdown.transportation.daily}/day)`);
        console.log(`  💰 Total: $${breakdown.total}`);
      }
      
      // Feasibility Assessment
      if (plan.aiRecommendations.feasibilityAssessment) {
        console.log('\n🔍 Feasibility Assessment:');
        const feasibility = plan.aiRecommendations.feasibilityAssessment;
        console.log(`  ✅ Feasible: ${feasibility.isFeasible ? 'Yes' : 'No'}`);
        console.log(`  📊 Score: ${feasibility.feasibilityScore}/10`);
        if (feasibility.reasons) {
          console.log('  📝 Reasons:');
          feasibility.reasons.forEach(reason => {
            console.log(`    • ${reason}`);
          });
        }
        if (feasibility.suggestions) {
          console.log('  💡 Suggestions:');
          feasibility.suggestions.forEach(suggestion => {
            console.log(`    • ${suggestion}`);
          });
        }
      }
      
      // Travel Tips
      if (plan.aiRecommendations.travelTips) {
        console.log('\n💡 Travel Tips:');
        plan.aiRecommendations.travelTips.forEach(tip => {
          console.log(`  • ${tip}`);
        });
      }
      
      // Must-Visit Places
      if (plan.aiRecommendations.mustVisitPlaces) {
        console.log('\n🏛️ Must-Visit Places:');
        plan.aiRecommendations.mustVisitPlaces.forEach(place => {
          console.log(`  • ${place}`);
        });
      }
      
      // Alternative Destinations
      if (plan.aiRecommendations.alternativeDestinations) {
        console.log('\n🌍 Alternative Destinations:');
        plan.aiRecommendations.alternativeDestinations.forEach(destination => {
          console.log(`  • ${destination}`);
        });
      }
      
      // Best Time to Visit
      if (plan.aiRecommendations.bestTimeToVisit) {
        console.log('\n📅 Best Time to Visit:');
        console.log(`  ${plan.aiRecommendations.bestTimeToVisit}`);
      }
      
      // Visa Requirements
      if (plan.aiRecommendations.visaRequirements) {
        console.log('\n📋 Visa Requirements:');
        console.log(`  ${plan.aiRecommendations.visaRequirements}`);
      }
    }
    
    console.log(`\n🆔 Plan ID: ${plan.planId}`);
    console.log('✅ Comprehensive travel plan generated successfully!');
    
    return plan.planId;
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    return null;
  }
}

/**
 * Test with different interest combinations
 */
async function testDifferentInterestCombinations() {
  console.log('\n\n🧪 Testing Different Interest Combinations');
  console.log('=' .repeat(60));
  
  const testCases = [
    {
      name: "Adventure & Nature Lover",
      data: {
        destination: "Nepal",
        country: "Nepal",
        numberOfTravelers: 2,
        numberOfDays: 7,
        budgetINR: 80000,
        interests: ["Adventure", "Nature", "Mountains", "Photography"],
        accommodationType: "Hotel",
        travelStyle: "Adventure",
        groupType: "Couple"
      }
    },
    {
      name: "Beach & Wellness Enthusiast",
      data: {
        destination: "Goa",
        country: "India",
        numberOfTravelers: 1,
        numberOfDays: 5,
        budgetINR: 30000,
        interests: ["Beaches", "Wellness", "Food", "Photography"],
        accommodationType: "Hotel",
        travelStyle: "Relaxed",
        groupType: "Solo"
      }
    },
    {
      name: "City Explorer & Nightlife",
      data: {
        destination: "Tokyo",
        country: "Japan",
        numberOfTravelers: 3,
        numberOfDays: 4,
        budgetINR: 120000,
        interests: ["Cities", "Nightlife", "Food", "Shopping", "Culture"],
        accommodationType: "Hotel",
        travelStyle: "Active",
        groupType: "Friends"
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🎯 Testing: ${testCase.name}`);
    console.log('-'.repeat(40));
    
    try {
      const response = await axios.post(`${BASE_URL}/comprehensive`, testCase.data);
      const plan = response.data.data;
      
      console.log(`✅ ${testCase.name} - Plan Generated Successfully`);
      console.log(`📍 ${plan.destination} for ${plan.duration} days`);
      console.log(`💰 Budget: ₹${plan.budget.inr}`);
      console.log(`🎨 Interests: ${plan.preferences.interests.join(', ')}`);
      console.log(`📊 Feasibility Score: ${plan.aiRecommendations.feasibilityAssessment.feasibilityScore}/10`);
      
    } catch (error) {
      console.error(`❌ ${testCase.name} - Error:`, error.response?.data?.message || error.message);
    }
  }
}

/**
 * Test all available interests
 */
async function testAllInterests() {
  console.log('\n\n🎨 Testing All Available Interests');
  console.log('=' .repeat(60));
  
  const testData = {
    destination: "Barcelona",
    country: "Spain",
    numberOfTravelers: 2,
    numberOfDays: 5,
    budgetINR: 75000,
    interests: availableInterests, // Test with all interests
    accommodationType: "Hotel",
    travelStyle: "Balanced",
    groupType: "Couple"
  };
  
  console.log('📋 Testing with ALL interests:');
  console.log(availableInterests.join(', '));
  
  try {
    const response = await axios.post(`${BASE_URL}/comprehensive`, testData);
    const plan = response.data.data;
    
    console.log('\n✅ Success! Plan generated with all interests');
    console.log(`📍 Destination: ${plan.destination}`);
    console.log(`🎨 Interests Applied: ${plan.preferences.interests.length} interests`);
    console.log(`📊 Feasibility Score: ${plan.aiRecommendations.feasibilityAssessment.feasibilityScore}/10`);
    
    // Show how interests are incorporated
    if (plan.aiRecommendations.dailyItinerary) {
      console.log('\n📅 Sample Activities by Interest:');
      plan.aiRecommendations.dailyItinerary.slice(0, 2).forEach(day => {
        console.log(`Day ${day.day}: ${day.activities.slice(0, 3).join(', ')}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Error testing all interests:', error.response?.data?.message || error.message);
  }
}

/**
 * Run all comprehensive tests
 */
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Travel Planning API Tests');
  console.log('=' .repeat(60));
  console.log('Available Interests:', availableInterests.join(', '));
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Basic comprehensive planning
    await testComprehensivePlanning();
    
    // Test 2: Different interest combinations
    await testDifferentInterestCombinations();
    
    // Test 3: All interests
    await testAllInterests();
    
    console.log('\n\n🎉 All comprehensive tests completed!');
    console.log('=' .repeat(60));
    console.log('Your comprehensive travel planning API is working perfectly! 🚀');
    
  } catch (error) {
    console.error('\n❌ Comprehensive test suite failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runComprehensiveTests();
}

module.exports = {
  runComprehensiveTests,
  testComprehensivePlanning,
  testDifferentInterestCombinations,
  testAllInterests
};
