const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const TravelPlan = require('../Models/TravelPlan');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate comprehensive travel plan with AI recommendations and images
 * POST /api/v1/ai-planning/generate-comprehensive-plan
 */
router.post('/generate-comprehensive-plan', async (req, res) => {
  try {
    const {
      country,
      numberOfDays,
      travelStyle,
      interests,
      budget,
      groupType,
      userId
    } = req.body;

    // Validate required fields
    if (!country || !numberOfDays) {
      return res.status(400).json({
        success: false,
        message: 'Country and number of days are required'
      });
    }

    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

    // Create comprehensive prompt for travel planning
    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
      Budget: '${budget}'
      Interests: '${interests}'
      TravelStyle: '${travelStyle}'
      GroupType: '${groupType}'
      
      IMPORTANT: For each day's activities, consider realistic costs based on:
      - Entry fees for museums, galleries, attractions
      - Transportation costs (trains, buses, taxis)
      - Meal costs (breakfast, lunch, dinner)
      - Shopping and miscellaneous expenses
      - Accommodation costs (if applicable)
      
      IMPORTANT: You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON. Do not use markdown formatting. Return the itinerary and realistic estimated price in a clean, non-markdown JSON format with the following structure:
      {
      "name": "A descriptive title for the trip",
      "description": "A brief description of the trip and its highlights not exceeding 100 words",
      "estimatedPrice": "Realistic total price for the trip in INR, e.g.₹price",
      "duration": ${numberOfDays},
      "budget": "${budget}",
      "travelStyle": "${travelStyle}",
      "country": "${country}",
      "interests": ${JSON.stringify(interests)},
      "groupType": "${groupType}",
      "bestTimeToVisit": [
        '🌸 Season (from month to month): reason to visit',
        '☀️ Season (from month to month): reason to visit',
        '🍁 Season (from month to month): reason to visit',
        '❄️ Season (from month to month): reason to visit'
      ],
      "weatherInfo": [
        '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
      ],
      "location": {
        "city": "name of the city or region",
        "coordinates": [latitude, longitude],
        "openStreetMap": "link to open street map"
      },
      "itinerary": [
      {
        "day": 1,
        "location": "City/Region Name",
        "activities": [
          {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
          {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
          {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
        ]
      }
      ]
  }`;

    // Try to generate content using Gemini, with fallback
    let trip;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Add system instruction for JSON format
      const systemInstruction = {
        role: "system",
        parts: [{ text: "You are a travel planning assistant. You MUST respond with ONLY valid JSON format. Do not include any explanatory text, markdown formatting, or code blocks. Just return the JSON object directly." }]
      };
      
      const result = await model.generateContent([systemInstruction, prompt]);
      let aiResponse = result.response.text();
      
      // Clean the response - remove markdown code blocks if present
      if (aiResponse.includes('```json')) {
        aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      
      // Try to parse JSON
      try {
        trip = JSON.parse(aiResponse);
        console.log('✅ Successfully generated AI travel plan');
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('AI Response:', aiResponse.substring(0, 200) + '...');
        throw new Error('AI returned invalid JSON format');
      }
      
    } catch (geminiError) {
      console.error('❌ Gemini AI Error:', geminiError.message);
      console.log('🔄 Falling back to generated travel plan...');
      
      // Create a comprehensive fallback response
      trip = {
        name: `${numberOfDays}-Day ${travelStyle} Trip to ${country}`,
        description: `A ${numberOfDays}-day ${travelStyle.toLowerCase()} adventure in ${country} perfect for ${groupType.toLowerCase()} travelers. Experience the best of ${country} with carefully curated activities and authentic local experiences.`,
        estimatedPrice: `₹${budgetNumber ? budgetNumber * numberOfDays : calculateFallbackBudget(numberOfDays, travelStyle)}`,
        duration: numberOfDays,
        budget: budget,
        travelStyle: travelStyle,
        country: country,
        interests: interests,
        groupType: groupType,
        bestTimeToVisit: [
          '🌸 Spring (March-May): Pleasant weather and blooming flowers',
          '☀️ Summer (June-August): Warm weather, perfect for outdoor activities',
          '🍁 Autumn (September-November): Cool weather and beautiful foliage',
          '❄️ Winter (December-February): Cool weather, fewer crowds'
        ],
        weatherInfo: [
          '☀️ Summer: 25-35°C (77-95°F)',
          '🌦️ Monsoon: 20-30°C (68-86°F)',
          '🌧️ Winter: 10-25°C (50-77°F)',
          '❄️ Spring: 15-30°C (59-86°F)'
        ],
        location: {
          city: country,
          coordinates: [0, 0],
          openStreetMap: `https://www.openstreetmap.org/search?query=${encodeURIComponent(country)}`
        },
        itinerary: generateFallbackItinerary(numberOfDays, country, travelStyle)
      };
    }

    // Fetch images from Unsplash
    let imageUrls = [];
    if (unsplashApiKey) {
      try {
        const searchQuery = `${country} ${Array.isArray(interests) ? interests.join(' ') : interests} ${travelStyle}`;
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&client_id=${unsplashApiKey}&per_page=3`;
        
        const imageResponse = await fetch(unsplashUrl);
        const imageData = await imageResponse.json();
        
        if (imageData.results && Array.isArray(imageData.results)) {
          imageUrls = imageData.results
            .slice(0, 3)
            .map((result) => result.urls?.regular || null)
            .filter(url => url !== null);
        }
      } catch (imageError) {
        console.warn('❌ Failed to fetch images from Unsplash:', imageError.message);
      }
    } else {
      console.warn('⚠️ Unsplash API key not configured');
    }

    // Convert budget string to number if possible
    let budgetNumber = null;
    if (budget) {
      if (typeof budget === 'string') {
        // Convert budget strings to approximate numbers
        const budgetMap = {
          'Low': 500,
          'Medium': 1500,
          'High': 3000,
          'Luxury': 5000
        };
        budgetNumber = budgetMap[budget] || 1000;
      } else {
        budgetNumber = budget;
      }
    }

    // Function to calculate realistic daily costs based on activities and location
    const calculateDailyCost = (activities, dayNumber, country, travelStyle) => {
      let baseCost = 0;
      const isBudget = travelStyle?.toLowerCase().includes('budget');
      const isLuxury = travelStyle?.toLowerCase().includes('luxury');
      
      // Base cost multipliers by country (approximate daily costs in INR)
      const countryCosts = {
        'italy': { budget: 3000, mid: 5000, luxury: 8000 },
        'france': { budget: 3500, mid: 6000, luxury: 10000 },
        'spain': { budget: 2500, mid: 4000, luxury: 7000 },
        'japan': { budget: 4000, mid: 7000, luxury: 12000 },
        'thailand': { budget: 1500, mid: 3000, luxury: 5000 },
        'india': { budget: 1000, mid: 2000, luxury: 4000 },
        'mumbai': { budget: 1200, mid: 2500, luxury: 4500 }, // Mumbai specific costs
        'delhi': { budget: 1000, mid: 2000, luxury: 4000 },
        'bangalore': { budget: 1200, mid: 2500, luxury: 4500 },
        'goa': { budget: 1500, mid: 3000, luxury: 5000 },
        'usa': { budget: 5000, mid: 8000, luxury: 15000 },
        'uk': { budget: 4000, mid: 7000, luxury: 12000 },
        'australia': { budget: 4500, mid: 7500, luxury: 13000 },
        'default': { budget: 2000, mid: 3500, luxury: 6000 }
      };
      
      const countryData = countryCosts[country?.toLowerCase()] || countryCosts['default'];
      
      if (isBudget) {
        baseCost = countryData.budget;
      } else if (isLuxury) {
        baseCost = countryData.luxury;
      } else {
        baseCost = countryData.mid;
      }
      
      // Activity-based cost adjustments
      let activityMultiplier = 1;
      const activityText = activities.join(' ').toLowerCase();
      
      // High-cost activities
      if (activityText.includes('museum') || activityText.includes('gallery') || activityText.includes('vatican')) {
        activityMultiplier += 0.3;
      }
      if (activityText.includes('restaurant') || activityText.includes('dining') || activityText.includes('steak')) {
        activityMultiplier += 0.4;
      }
      if (activityText.includes('train') || activityText.includes('transport')) {
        activityMultiplier += 0.2;
      }
      if (activityText.includes('shopping') || activityText.includes('market')) {
        activityMultiplier += 0.1;
      }
      
      // Day-specific variations (first and last days might be different)
      if (dayNumber === 1) {
        activityMultiplier += 0.2; // Arrival day costs
      }
      if (activityText.includes('depart') || activityText.includes('airport')) {
        activityMultiplier += 0.1; // Departure day
      }
      
      // Add some randomness to avoid monotonous pricing (±15%)
      const randomVariation = 0.85 + (Math.random() * 0.3);
      
      return Math.round(baseCost * activityMultiplier * randomVariation);
    };

    // Transform AI response to match TravelPlan schema
    const transformedRecommendations = {
      itinerary: trip.itinerary?.map(day => {
        const activities = day.activities?.map(activity => 
          `${activity.time}: ${activity.description}`
        ) || [];
        
        // Calculate realistic daily cost based on activities
        const dailyCost = calculateDailyCost(activities, day.day, country, travelStyle);
        
        return {
          day: day.day,
          activities: activities,
          estimatedCost: dailyCost,
          timeRequired: 'Full day'
        };
      }) || [],
      totalEstimatedCost: 0, // Will be calculated below
      bestTimeToVisit: Array.isArray(trip.bestTimeToVisit) ? 
        trip.bestTimeToVisit.join('; ') : trip.bestTimeToVisit || '',
      weatherInfo: Array.isArray(trip.weatherInfo) ? 
        trip.weatherInfo.join('; ') : trip.weatherInfo || '',
      travelTips: trip.travelTips || [],
      mustVisitPlaces: trip.mustVisitPlaces || [],
      alternativeDestinations: trip.alternativeDestinations || []
    };

    // Calculate total cost from daily costs
    transformedRecommendations.totalEstimatedCost = transformedRecommendations.itinerary
      .reduce((total, day) => total + day.estimatedCost, 0);

    // Create travel plan record
    const travelPlan = new TravelPlan({
      userId: userId && mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null,
      destination: country,
      duration: numberOfDays,
      budget: budgetNumber,
      preferences: interests || [],
      aiRecommendations: transformedRecommendations,
      imageUrls: imageUrls,
      status: 'draft',
      // Save AI-generated trip data
      name: trip.name || null,
      description: trip.description || null,
      estimatedPrice: trip.estimatedPrice || null,
      travelStyle: travelStyle || null,
      groupType: groupType || null
    });

    await travelPlan.save();

    res.status(200).json({
      success: true,
      message: 'Comprehensive travel plan generated successfully',
      data: {
        planId: travelPlan._id,
        trip: trip,
        imageUrls: imageUrls
      }
    });

  } catch (error) {
    console.error('Error generating comprehensive travel plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate travel plan',
      error: error.message
    });
  }
});

/**
 * Get travel plan by ID
 * GET /api/v1/ai-planning/plan/:planId
 */
router.get('/plan/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await TravelPlan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Travel plan not found'
      });
    }

    // Format the response with proper currency display
    const formattedPlan = {
      ...plan.toObject(),
      budget: plan.budget ? `₹${plan.budget}` : null,
      aiRecommendations: {
        ...plan.aiRecommendations,
        totalEstimatedCost: plan.aiRecommendations?.totalEstimatedCost ? `₹${plan.aiRecommendations.totalEstimatedCost}` : null
      }
    };

    res.status(200).json({
      success: true,
      data: formattedPlan
    });
  } catch (error) {
    console.error('Error fetching travel plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch travel plan',
      error: error.message
    });
  }
});

/**
 * Get all travel plans for a user
 * GET /api/v1/ai-planning/plans
 */
router.get('/plans', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const plans = await TravelPlan.find(
      userId ? { userId } : {}
    ).sort({ createdAt: -1 });

    // Format all plans with proper currency display
    const formattedPlans = plans.map(plan => ({
      ...plan.toObject(),
      budget: plan.budget ? `₹${plan.budget}` : null,
      aiRecommendations: {
        ...plan.aiRecommendations,
        totalEstimatedCost: plan.aiRecommendations?.totalEstimatedCost ? `₹${plan.aiRecommendations.totalEstimatedCost}` : null
      }
    }));

    res.status(200).json({
      success: true,
      data: formattedPlans
    });
  } catch (error) {
    console.error('Error fetching travel plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch travel plans',
      error: error.message
    });
  }
});

/**
 * Update travel plan status
 * PUT /api/v1/ai-planning/plan/:planId/status
 */
router.put('/plan/:planId/status', async (req, res) => {
  try {
    const { planId } = req.params;
    const { status } = req.body;

    const plan = await TravelPlan.findByIdAndUpdate(
      planId,
      { status },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Travel plan not found'
      });
    }

    // Format the response with proper currency display
    const formattedPlan = {
      ...plan.toObject(),
      budget: plan.budget ? `₹${plan.budget}` : null,
      aiRecommendations: {
        ...plan.aiRecommendations,
        totalEstimatedCost: plan.aiRecommendations?.totalEstimatedCost ? `₹${plan.aiRecommendations.totalEstimatedCost}` : null
      }
    };

    res.status(200).json({
      success: true,
      message: 'Travel plan status updated successfully',
      data: formattedPlan
    });
  } catch (error) {
    console.error('Error updating travel plan status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update travel plan status',
      error: error.message
    });
  }
});

/**
 * Calculate fallback budget based on travel style and duration
 */
function calculateFallbackBudget(numberOfDays, travelStyle) {
  const baseCostPerDay = {
    'Budget': 2000,
    'Mid-range': 4000,
    'Luxury': 8000,
    'Premium': 12000
  };
  
  const style = travelStyle || 'Mid-range';
  const dailyCost = baseCostPerDay[style] || baseCostPerDay['Mid-range'];
  return dailyCost * numberOfDays;
}

/**
 * Generate fallback itinerary when AI response parsing fails
 */
function generateFallbackItinerary(numberOfDays, country, travelStyle) {
  const itinerary = [];
  
  // Define activities based on travel style
  const activityTemplates = {
    'Budget': {
      morning: ['🌅 Local breakfast at street food stalls', '🚶 Walking tour of city center', '🏛️ Free museum visits'],
      afternoon: ['🏛️ Historical landmarks', '🛍️ Local markets', '🌳 Public parks and gardens'],
      evening: ['🍽️ Local street food', '🌆 Sunset viewpoints', '🎭 Free cultural shows']
    },
    'Mid-range': {
      morning: ['🌅 Breakfast at local cafes', '🏛️ Guided museum tours', '🚶 Walking tours with guides'],
      afternoon: ['🎯 Popular attractions', '🍽️ Local restaurants', '🛍️ Shopping districts'],
      evening: ['🍽️ Traditional restaurants', '🌆 Rooftop bars', '🎭 Cultural performances']
    },
    'Luxury': {
      morning: ['🌅 Gourmet breakfast', '🏛️ Private museum tours', '🚗 Private guided tours'],
      afternoon: ['🎯 Exclusive attractions', '🍽️ Fine dining', '🛍️ Luxury shopping'],
      evening: ['🍽️ Michelin-starred restaurants', '🌆 Premium bars', '🎭 VIP cultural events']
    }
  };
  
  const activities = activityTemplates[travelStyle] || activityTemplates['Mid-range'];
  
  for (let day = 1; day <= numberOfDays; day++) {
    const dayActivities = [];
    
    // Morning activity
    dayActivities.push({
      time: "Morning",
      description: activities.morning[Math.floor(Math.random() * activities.morning.length)]
    });
    
    // Afternoon activity
    if (day === 1) {
      dayActivities.push({
        time: "Afternoon",
        description: `🏛️ Visit the main historical landmarks and cultural sites in ${country}`
      });
    } else if (day === numberOfDays) {
      dayActivities.push({
        time: "Afternoon",
        description: `🛍️ Final day shopping and souvenir hunting in local markets`
      });
    } else {
      dayActivities.push({
        time: "Afternoon",
        description: activities.afternoon[Math.floor(Math.random() * activities.afternoon.length)]
      });
    }
    
    // Evening activity
    dayActivities.push({
      time: "Evening",
      description: activities.evening[Math.floor(Math.random() * activities.evening.length)]
    });
    
    itinerary.push({
      day: day,
      location: country,
      activities: dayActivities
    });
  }
  
  return itinerary;
}

module.exports = router;
