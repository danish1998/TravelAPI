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

    const unsplashApiKey = process.env.UNSPLASH_SECRET_KEY;

    // Create comprehensive prompt for travel planning
    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
      Budget: '${budget}'
      Interests: '${interests}'
      TravelStyle: '${travelStyle}'
      GroupType: '${groupType}'
      Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
      {
      "name": "A descriptive title for the trip",
      "description": "A brief description of the trip and its highlights not exceeding 100 words",
      "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
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

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([prompt]);
    let aiResponse = result.response.text();
    
    // Clean the response - remove markdown code blocks if present
    if (aiResponse.includes('```json')) {
      aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const trip = JSON.parse(aiResponse);

    // Fetch images from Unsplash
    let imageUrls = [];
    if (unsplashApiKey) {
      try {
        const imageResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`
        );
        const imageData = await imageResponse.json();
        imageUrls = imageData.results
          .slice(0, 3)
          .map((result) => result.urls?.regular || null)
          .filter(url => url !== null);
      } catch (imageError) {
        console.warn('Failed to fetch images from Unsplash:', imageError.message);
      }
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

    // Transform AI response to match TravelPlan schema
    const transformedRecommendations = {
      itinerary: trip.itinerary?.map(day => ({
        day: day.day,
        activities: day.activities?.map(activity => 
          `${activity.time}: ${activity.description}`
        ) || [],
        estimatedCost: 100, // Default cost per day
        timeRequired: 'Full day'
      })) || [],
      totalEstimatedCost: budgetNumber,
      bestTimeToVisit: Array.isArray(trip.bestTimeToVisit) ? 
        trip.bestTimeToVisit.join('; ') : trip.bestTimeToVisit || '',
      weatherInfo: Array.isArray(trip.weatherInfo) ? 
        trip.weatherInfo.join('; ') : trip.weatherInfo || '',
      travelTips: trip.travelTips || [],
      mustVisitPlaces: trip.mustVisitPlaces || [],
      alternativeDestinations: trip.alternativeDestinations || []
    };

    // Create travel plan record
    const travelPlan = new TravelPlan({
      userId: userId && mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null,
      destination: country,
      duration: numberOfDays,
      budget: budgetNumber,
      preferences: interests || [],
      aiRecommendations: transformedRecommendations,
      status: 'draft'
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

    res.status(200).json({
      success: true,
      data: plan
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

    res.status(200).json({
      success: true,
      data: plans
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

    res.status(200).json({
      success: true,
      message: 'Travel plan status updated successfully',
      data: plan
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

module.exports = router;
