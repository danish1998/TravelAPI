const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const mongoose = require('mongoose');
const TravelPlan = require('../Models/TravelPlan');
const { verifyToken } = require('../middleware/auth');

// Initialize Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// All AI planning routes require authentication
router.use(verifyToken());

/**
 * Convert budget string to number
 */
function convertBudgetToNumber(budget) {
  if (typeof budget === 'number') return budget;
  
  const budgetMap = {
    Low: 500,
    Medium: 1500,
    High: 3000,
    Luxury: 5000,
  };
  return budgetMap[budget] || 1000;
}

/**
 * Generate comprehensive travel plan with AI recommendations and images
 * POST /api/v1/groq-ai/generate-comprehensive-plan
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
      userId,
    } = req.body;

    // Validate required fields
    if (!country || !numberOfDays) {
      return res.status(400).json({
        success: false,
        message: 'Country and number of days are required',
      });
    }

    // Convert budget to number early
    const budgetNumber = convertBudgetToNumber(budget);
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

    // Create enhanced prompt for detailed, location-specific travel planning
    const prompt = `You are an expert travel planner. Generate a detailed ${numberOfDays}-day travel itinerary for ${country} with SPECIFIC locations, attractions, and ACCURATE cost breakdowns.

USER PREFERENCES:
- Budget Level: ${budget}
- Travel Style: ${travelStyle}
- Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}
- Group Type: ${groupType}
- Number of Days: ${numberOfDays}

CRITICAL REQUIREMENTS:

1. SPECIFIC LOCATIONS & ATTRACTIONS:
   - Mention ONLY real, well-known landmarks and attractions in ${country}
   - Use accurate, officially recognized names (no generic or invented places)
   - Example for Delhi: Jama Masjid, Red Fort, India Gate, Qutub Minar, Chandni Chowk
   - Include ACTUAL names of popular restaurants, cafes, markets, temples, museums, and streets
   - Clearly specify the neighborhood, district, or locality for every activity
   - Avoid vague references like “local market” or “famous restaurant”


2. DETAILED COST BREAKDOWN FOR EACH ACTIVITY:
   - Entry/Admission fees (actual current prices in INR) based on latest data regarding ${country}
   - Transportation costs (metro/taxi/auto from previous location in INR) based on latest data regarding ${country}
   - Meal costs (breakfast/lunch/dinner at specific price ranges in INR) based on latest data regarding ${country}
   - Shopping/miscellaneous estimated costs in INR based on latest data regarding ${country}
   - Total cost for each time slot (Morning/Afternoon/Evening)

3. REALISTIC PRICING:
   - Research and provide CURRENT, ACCURATE prices for ${country}
   - Match prices to the ${budget} budget level and ${travelStyle} travel style
   - Budget style: local transport, street food, free/cheap attractions based on latest data regarding ${country}
   - Luxury style: private transport, fine dining, premium experiences based on latest data regarding ${country}

4. TIME MANAGEMENT:
   - Include realistic travel time between locations
   - Suggest optimal visiting hours for each attraction
   - Account for opening/closing times

YOU MUST RESPOND WITH ONLY VALID JSON. No markdown, no code blocks, no explanatory text.

JSON STRUCTURE:
{
  "name": "Descriptive trip title with destination",
  "description": "Brief 2-3 sentence description highlighting main experiences (max 100 words)",
  "estimatedPrice": "₹[TOTAL_AMOUNT]",
  "duration": ${numberOfDays},
  "budget": "${budget}",
  "travelStyle": "${travelStyle}",
  "country": "${country}",
  "interests": ${JSON.stringify(interests)},
  "groupType": "${groupType}",
  "bestTimeToVisit": [
    "🌸 Spring (March-May): Pleasant weather, blooming gardens, ideal for sightseeing",
    "☀️ Summer (June-August): Warm weather, peak tourist season",
    "🍁 Autumn (September-November): Cool comfortable weather, festive season",
    "❄️ Winter (December-February): Cool to cold, great for exploring"
  ],
  "weatherInfo": [
    "☀️ Summer: 25-40°C (77-104°F) - Hot and humid",
    "🌦️ Monsoon: 25-35°C (77-95°F) - Rainy season",
    "🍁 Autumn: 20-30°C (68-86°F) - Pleasant weather",
    "❄️ Winter: 8-25°C (46-77°F) - Cool and dry"
  ],
  "location": {
    "city": "${country}",
    "coordinates": [latitude, longitude],
    "openStreetMap": "https://www.openstreetmap.org/search?query=${encodeURIComponent(country)}"
  },
  "itinerary": [
    {
      "day": 1,
      "location": "Specific Area/District Name",
      "activities": [
        {
          "time": "Morning (9:00 AM - 12:00 PM)",
          "description": "🕌 Visit [SPECIFIC ATTRACTION NAME] - [Brief description of what to see/do]",
          "cost_breakdown": {
            "entry_fee": 50,
            "transport": 80,
            "breakfast": 150,
            "misc": 50,
            "total": 330
          },
          "tips": "Best to visit early to avoid crowds. Photography allowed."
        },
        {
          "time": "Afternoon (12:00 PM - 5:00 PM)",
          "description": "🏛️ Explore [SPECIFIC ATTRACTION NAME] - [What makes it special]",
          "cost_breakdown": {
            "entry_fee": 100,
            "transport": 60,
            "lunch": 300,
            "misc": 100,
            "total": 560
          },
          "tips": "Carry water bottle. Guide services available for ₹200."
        },
        {
          "time": "Evening (5:00 PM - 9:00 PM)",
          "description": "🌆 Experience [SPECIFIC LOCATION] - [Evening activities]",
          "cost_breakdown": {
            "entry_fee": 0,
            "transport": 100,
            "dinner": 500,
            "misc": 150,
            "total": 750
          },
          "tips": "Beautiful sunset views. Many street food options available."
        }
      ],
      "daily_total": 1640,
     "accommodation": {
  "type": "Hotel appropriate for ${travelStyle} travel in ${country}",
  "estimated_cost": "Price per night in INR based on real hotels in ${country} that match ${travelStyle} and ${budget}",
  "notes": "Estimate should reflect actual nightly rates commonly paid by travelers in this destination"


      },
  ],
  "budget_summary": {
    "accommodation_total": "₹[AMOUNT]",
    "activities_total": "₹[AMOUNT]",
    "food_total": "₹[AMOUNT]",
    "transport_total": "₹[AMOUNT]",
    "miscellaneous_total": "₹[AMOUNT]",
    "grand_total": "₹[AMOUNT]"
  }
}

IMPORTANT REMINDERS:
- Use REAL attraction names for ${country}
- Provide ACCURATE current prices in INR
- Include detailed cost breakdowns for EVERY activity
- Each day should have Morning, Afternoon, and Evening activities
- Calculate realistic daily totals and grand total
- Return ONLY the JSON object, no other text`;

    let trip;

    // -------------------------------
    // CALL GROQ (RAW JSON LIKE GEMINI)
    // -------------------------------
    try {
      console.log(`🤖 Groq: Generating detailed AI itinerary for ${country}...`);

      const ai = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.9,
        top_p: 0.95,
        max_tokens: 8192,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert travel planner. You MUST respond only with valid JSON. No markdown, no code blocks, no explanation.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      let aiResponse = ai.choices?.[0]?.message?.content || '';

      // Clean the response - remove markdown code blocks if present
      aiResponse = aiResponse.trim();
      if (aiResponse.includes('```json')) {
        aiResponse = aiResponse
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '');
      }
      if (aiResponse.includes('```')) {
        aiResponse = aiResponse.replace(/```\n?/g, '');
      }

      aiResponse = aiResponse.trim();

      try {
        trip = JSON.parse(aiResponse);
        console.log(
          '✅ Groq: Successfully generated detailed AI travel plan with specific locations and costs'
        );
      } catch (parseError) {
        console.error('❌ JSON Parse Error (Groq):', parseError.message);
        console.error(
          'AI Response (first 1000 chars):',
          aiResponse.substring(0, 1000)
        );

        return res.status(500).json({
          success: false,
          message: 'AI generated invalid response format. Please try again.',
          error: 'Failed to parse AI response',
        });
      }
    } catch (groqError) {
      console.error('❌ Groq AI Error:', groqError.message);

      return res.status(503).json({
        success: false,
        message:
          'AI service is currently unavailable. Please try again later.',
        error: groqError.message,
        instructions: {
          groqSetup: 'Please ensure your GROQ_API_KEY is correctly configured',
          steps: [
            '1. Check your GROQ_API_KEY in .env file',
            '2. Ensure the API key has access to llama models',
            '3. Try again in a few minutes',
            '4. Contact support if the issue persists',
          ],
        },
      });
    }

    // -------------------------------
    // Fetch images from Unsplash
    // -------------------------------
    let imageUrls = [];
    if (unsplashApiKey) {
      try {
        const searchQuery = `${country} ${
          Array.isArray(interests) ? interests.join(' ') : interests
        } travel landmarks`;
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchQuery
        )}&client_id=${unsplashApiKey}&per_page=5`;

        const imageResponse = await fetch(unsplashUrl);
        const imageData = await imageResponse.json();

        if (imageData.results && Array.isArray(imageData.results)) {
          imageUrls = imageData.results
            .slice(0, 5)
            .map((result) => result.urls?.regular || null)
            .filter((url) => url !== null);
        }
        console.log(`📸 Fetched ${imageUrls.length} images from Unsplash`);
      } catch (imageError) {
        console.warn(
          '❌ Failed to fetch images from Unsplash:',
          imageError.message
        );
      }
    } else {
      console.warn('⚠️ Unsplash API key not configured');
    }

    // -------------------------------
    // Transform AI response to match TravelPlan schema
    // -------------------------------
    const transformedRecommendations = {
      itinerary:
        trip.itinerary?.map((day) => {
          const activities =
            day.activities?.map((activity) => {
              const cost = activity.cost_breakdown || {};
              const food =
                cost.breakfast || cost.lunch || cost.dinner || 0;

              const costInfo = activity.cost_breakdown
                ? ` [Total: ₹${cost.total} - Entry: ₹${cost.entry_fee}, Transport: ₹${cost.transport}, Food: ₹${food}, Misc: ₹${cost.misc || 0}]`
                : '';

              const tips = activity.tips ? ` | Tips: ${activity.tips}` : '';
              return `${activity.time}: ${activity.description}${costInfo}${tips}`;
            }) || [];

          const dailyCost =
            day.daily_total ||
            (day.activities?.reduce(
              (sum, act) => sum + (act.cost_breakdown?.total || 0),
              0
            ) || 0);

          const accommodationCost = day.accommodation?.estimated_cost || 0;
          const totalDailyCost = dailyCost + accommodationCost;

          return {
            day: day.day,
            location: day.location,
            activities,
            estimatedCost: totalDailyCost,
            timeRequired: 'Full day',
            accommodation: day.accommodation
              ? `${day.accommodation.type} - ₹${day.accommodation.estimated_cost}`
              : null,
          };
        }) || [],
      totalEstimatedCost: 0,
      bestTimeToVisit: Array.isArray(trip.bestTimeToVisit)
        ? trip.bestTimeToVisit.join('; ')
        : trip.bestTimeToVisit || '',
      weatherInfo: Array.isArray(trip.weatherInfo)
        ? trip.weatherInfo.join('; ')
        : trip.weatherInfo || '',
      travelTips: trip.travelTips || [],
      mustVisitPlaces: trip.mustVisitPlaces || [],
      alternativeDestinations: trip.alternativeDestinations || [],
      budgetSummary: trip.budget_summary || null,
    };

    // Calculate total cost from daily costs
    transformedRecommendations.totalEstimatedCost =
      transformedRecommendations.itinerary.reduce(
        (total, day) => total + (day.totalCost || day.estimatedCost || 0),
        0
      );

    // Create travel plan record
    const travelPlan = new TravelPlan({
      userId: req.user ? req.user.id : userId || null,
      destination: country,
      duration: numberOfDays,
      budget: budgetNumber,
      preferences: interests || [],
      aiRecommendations: transformedRecommendations,
      imageUrls,
      status: 'draft',
      name: trip.name || null,
      description: trip.description || null,
      estimatedPrice:
        trip.estimatedPrice ||
        `₹${transformedRecommendations.totalEstimatedCost}`,
      travelStyle: travelStyle || null,
      groupType: groupType || null,
    });

    await travelPlan.save();

    console.log(`✅ Travel plan saved with ID: ${travelPlan._id}`);
    console.log(
      `💰 Total estimated cost: ₹${transformedRecommendations.totalEstimatedCost}`
    );

    res.status(200).json({
      success: true,
      message:
        'Comprehensive travel plan generated successfully with detailed costs',
      data: {
        planId: travelPlan._id,
        trip,
        imageUrls,
        totalCost: transformedRecommendations.totalEstimatedCost,
      },
    });
  } catch (error) {
    console.error(
      '❌ Error generating comprehensive travel plan (Groq):',
      error
    );
    res.status(500).json({
      success: false,
      message: 'Failed to generate travel plan',
      error: error.message,
    });
  }
});

/**
 * Get travel plan by ID
 * GET /api/v1/groq-ai/plan/:planId
 */
router.get('/plan/:planId', async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await TravelPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Travel plan not found',
      });
    }

    const formattedPlan = {
      ...plan.toObject(),
      budget: plan.budget ? `₹${plan.budget}` : null,
      aiRecommendations: {
        ...plan.aiRecommendations,
        totalEstimatedCost: plan.aiRecommendations?.totalEstimatedCost
          ? `₹${plan.aiRecommendations.totalEstimatedCost}`
          : null,
      },
    };

    res.status(200).json({
      success: true,
      data: formattedPlan,
    });
  } catch (error) {
    console.error('Error fetching travel plan (Groq):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch travel plan',
      error: error.message,
    });
  }
});

/**
 * Get all travel plans for a user
 * GET /api/v1/groq-ai/plans
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = await TravelPlan.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const formattedPlans = plans.map((plan) => ({
      ...plan.toObject(),
      budget: plan.budget ? `₹${plan.budget}` : null,
      aiRecommendations: {
        ...plan.aiRecommendations,
        totalEstimatedCost: plan.aiRecommendations?.totalEstimatedCost
          ? `₹${plan.aiRecommendations.totalEstimatedCost}`
          : null,
      },
    }));

    res.status(200).json({
      success: true,
      data: formattedPlans,
    });
  } catch (error) {
    console.error('Error fetching travel plans (Groq):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch travel plans',
      error: error.message,
    });
  }
});

/**
 * Update travel plan status
 * PUT /api/v1/groq-ai/plan/:planId/status
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
        message: 'Travel plan not found',
      });
    }

    const formattedPlan = {
      ...plan.toObject(),
      budget: plan.budget ? `₹${plan.budget}` : null,
      aiRecommendations: {
        ...plan.aiRecommendations,
        totalEstimatedCost: plan.aiRecommendations?.totalEstimatedCost
          ? `₹${plan.aiRecommendations.totalEstimatedCost}`
          : null,
      },
    };

    res.status(200).json({
      success: true,
      message: 'Travel plan status updated successfully',
      data: formattedPlan,
    });
  } catch (error) {
    console.error('Error updating travel plan status (Groq):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update travel plan status',
      error: error.message,
    });
  }
});

module.exports = router;
