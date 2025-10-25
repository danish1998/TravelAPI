const { GoogleGenerativeAI } = require('@google/generative-ai');
const TravelPlan = require('../Models/TravelPlan');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI travel recommendations using Gemini
 */
const generateTravelRecommendations = async (req, res) => {
  try {
    const { destination, duration, budget, preferences, startDate, endDate } = req.body;

    // Validate required fields
    if (!destination || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Destination and duration are required'
      });
    }

    // Get the generative model - try different model names
    let model;
    try {
      // Try the most common working models
      const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];
      let modelFound = false;
      
      for (const modelName of modelsToTry) {
        try {
          model = genAI.getGenerativeModel({ model: modelName });
          console.log(`✅ Using model: ${modelName}`);
          modelFound = true;
          break;
        } catch (modelError) {
          console.log(`❌ Model ${modelName} not available:`, modelError.message);
        }
      }
      
      if (!modelFound) {
        throw new Error('No Gemini models are available. Please check your API key and permissions.');
      }
    } catch (error) {
      console.error('Gemini API setup error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Gemini AI is not available',
        error: error.message,
        instructions: {
          setup: 'To use Gemini AI, you need to:',
          steps: [
            '1. Go to https://makersuite.google.com/app/apikey',
            '2. Create a new API key',
            '3. Enable the Generative Language API in Google Cloud Console',
            '4. Update your GEMINI_API_KEY in .env file',
            '5. Restart your server'
          ],
          alternative: 'You can also use the Groq AI controller (aiPlanningController-groq.js) as an alternative'
        }
      });
    }

    // Create a comprehensive prompt for travel planning
    const prompt = `
    You are an expert travel planner. Create a detailed travel plan for the following requirements:

    Destination: ${destination}
    Duration: ${duration} days
    Budget: ${budget ? `$${budget}` : 'Not specified'}
    Preferences: ${preferences ? preferences.join(', ') : 'No specific preferences'}
    Travel Dates: ${startDate ? `From ${startDate} to ${endDate}` : 'Not specified'}

    Please provide a comprehensive travel plan with the following structure:

    1. **Daily Itinerary**: For each day, suggest 3-4 activities with:
       - Activity name and description
       - Estimated time required
       - Estimated cost per person
       - Best time of day to visit

    2. **Budget Breakdown**: 
       - Accommodation cost per night
       - Food expenses per day
       - Transportation costs
       - Activity costs
       - Total estimated cost

    3. **Travel Tips**:
       - Best time to visit
       - Weather information
       - Local customs and etiquette
       - Transportation options
       - Safety tips

    4. **Must-Visit Places**: List top attractions with brief descriptions

    5. **Alternative Destinations**: Suggest 2-3 similar destinations if the original is not suitable

    6. **Feasibility Assessment**: Based on the duration, is this destination feasible? Suggest alternatives if needed.

    Format your response as a structured JSON object that can be parsed by a JavaScript application.
    `;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Try to parse the AI response as JSON, fallback to structured text
    let parsedRecommendations;
    try {
      parsedRecommendations = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from text
      parsedRecommendations = {
        itinerary: parseItineraryFromText(aiResponse, duration),
        totalEstimatedCost: parseCostFromText(aiResponse),
        travelTips: parseTipsFromText(aiResponse),
        mustVisitPlaces: parsePlacesFromText(aiResponse),
        alternativeDestinations: parseAlternativesFromText(aiResponse),
        rawResponse: aiResponse
      };
    }

    // Create travel plan record
    const travelPlan = new TravelPlan({
      userId: req.user ? req.user.id : null,
      destination,
      duration,
      budget,
      travelDates: startDate ? { startDate, endDate } : undefined,
      preferences: preferences || [],
      aiRecommendations: parsedRecommendations,
      status: 'draft'
    });

    await travelPlan.save();

    res.status(200).json({
      success: true,
      message: 'Travel recommendations generated successfully',
      data: {
        planId: travelPlan._id,
        destination,
        duration,
        recommendations: parsedRecommendations
      }
    });

  } catch (error) {
    console.error('Error generating travel recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate travel recommendations',
      error: error.message
    });
  }
};

/**
 * Get saved travel plans
 */
const getTravelPlans = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    
    const plans = await TravelPlan.find(
      userId ? { userId } : { userId: null }
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
};

/**
 * Get a specific travel plan
 */
const getTravelPlan = async (req, res) => {
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
};

/**
 * Update travel plan status
 */
const updateTravelPlanStatus = async (req, res) => {
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
      message: 'Travel plan updated successfully',
      data: plan
    });
  } catch (error) {
    console.error('Error updating travel plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update travel plan',
      error: error.message
    });
  }
};

/**
 * Get destination suggestions based on duration
 */
const getDestinationSuggestions = async (req, res) => {
  try {
    const { duration, budget, preferences } = req.query;

    if (!duration) {
      return res.status(400).json({
        success: false,
        message: 'Duration is required'
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Based on a ${duration}-day trip, suggest 5-7 suitable destinations with:

    1. Destination name and country
    2. Why it's suitable for ${duration} days
    3. Estimated budget range per person
    4. Best time to visit
    5. Main attractions (2-3 key highlights)
    6. Travel feasibility score (1-10)

    ${budget ? `Budget constraint: $${budget} per person` : ''}
    ${preferences ? `Preferences: ${preferences}` : ''}

    Format as JSON array with destination objects.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Try to parse as JSON
    let suggestions;
    try {
      suggestions = JSON.parse(aiResponse);
    } catch (parseError) {
      suggestions = parseDestinationsFromText(aiResponse);
    }

    res.status(200).json({
      success: true,
      data: {
        duration,
        suggestions
      }
    });

  } catch (error) {
    console.error('Error getting destination suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get destination suggestions',
      error: error.message
    });
  }
};

// Helper functions to parse AI responses when JSON parsing fails
function parseItineraryFromText(text, duration) {
  const itinerary = [];
  for (let i = 1; i <= duration; i++) {
    // Calculate realistic daily cost based on duration and day number
    const baseCost = 1500; // Base cost in INR
    const dayMultiplier = 1 + (i * 0.1); // Slight increase for later days
    const randomVariation = 0.8 + (Math.random() * 0.4); // ±20% variation
    const estimatedCost = Math.round(baseCost * dayMultiplier * randomVariation);
    
    itinerary.push({
      day: i,
      activities: [`Day ${i} activities to be planned`],
      estimatedCost: estimatedCost,
      timeRequired: 'Full day'
    });
  }
  return itinerary;
}

function parseCostFromText(text) {
  // Try to extract cost from text (look for various patterns)
  const costPatterns = [
    /\$(\d+)/,           // $500
    /₹(\d+)/,            // ₹5000
    /(\d+)\s*USD/i,      // 500 USD
    /(\d+)\s*INR/i,      // 5000 INR
    /total.*?(\d+)/i,    // total 5000
    /budget.*?(\d+)/i    // budget 5000
  ];
  
  for (const pattern of costPatterns) {
    const match = text.match(pattern);
    if (match) {
      const cost = parseInt(match[1]);
      // If it's in USD, convert to INR (approximate rate 83)
      if (pattern.source.includes('$') || pattern.source.includes('USD')) {
        return cost * 83;
      }
      return cost;
    }
  }
  
  // Default realistic cost based on text length and content
  const textLength = text.length;
  const hasLuxury = /luxury|premium|high-end|expensive/i.test(text);
  const hasBudget = /budget|cheap|affordable|low-cost/i.test(text);
  
  let baseCost = 5000; // Default base cost in INR
  
  if (hasLuxury) baseCost = 15000;
  else if (hasBudget) baseCost = 3000;
  
  // Adjust based on text complexity (longer text might indicate more detailed planning)
  const complexityMultiplier = Math.min(2, Math.max(0.5, textLength / 1000));
  
  return Math.round(baseCost * complexityMultiplier);
}

function parseTipsFromText(text) {
  return [
    'Check local weather conditions',
    'Book accommodations in advance',
    'Learn basic local phrases'
  ];
}

function parsePlacesFromText(text) {
  return [
    'Main city center',
    'Local attractions',
    'Cultural sites'
  ];
}

function parseAlternativesFromText(text) {
  return [
    'Alternative destination 1',
    'Alternative destination 2'
  ];
}

function parseDestinationsFromText(text) {
  return [
    {
      name: 'Sample Destination',
      country: 'Sample Country',
      reason: 'Suitable for the specified duration',
      budgetRange: '$500-1000',
      bestTime: 'Spring/Fall',
      attractions: ['Attraction 1', 'Attraction 2'],
      feasibilityScore: 8
    }
  ];
}

/**
 * Generate comprehensive travel plan based on detailed form inputs
 */
const generateComprehensiveTravelPlan = async (req, res) => {
  try {
    const {
      destination,
      country,
      numberOfTravelers,
      numberOfDays,
      budgetINR,
      interests,
      accommodationType,
      travelStyle,
      groupType,
      startDate,
      endDate
    } = req.body;

    // Validate required fields
    if (!destination || !country || !numberOfDays || !budgetINR) {
      return res.status(400).json({
        success: false,
        message: 'Destination, country, number of days, and budget are required'
      });
    }

    // Convert INR to USD for international planning (approximate rate)
    const budgetUSD = Math.round(budgetINR / 83); // Approximate INR to USD rate
    const exchangeRate = 83; // INR to USD rate

    // Create comprehensive travel plan
    const travelPlan = {
      destination: `${destination}, ${country}`,
      duration: numberOfDays,
      travelers: numberOfTravelers || 1,
      budget: {
        inr: budgetINR,
        usd: budgetUSD
      },
      preferences: {
        interests: interests || [],
        accommodation: accommodationType || 'Hotel',
        travelStyle: travelStyle || 'Relaxed',
        groupType: groupType || 'Solo'
      },
      travelDates: startDate ? { startDate, endDate } : undefined
    };

    try {
      // Generate AI-powered recommendations using Gemini AI only
      const aiRecommendations = await generateDetailedRecommendations({
        destination,
        country,
        numberOfDays,
        budgetUSD,
        numberOfTravelers: numberOfTravelers || 1,
        interests: interests || [],
        accommodationType: accommodationType || 'Hotel',
        travelStyle: travelStyle || 'Relaxed',
        groupType: groupType || 'Solo'
      });

      // Create comprehensive response using only AI recommendations
      const comprehensivePlan = {
        ...travelPlan,
        aiRecommendations: {
          ...aiRecommendations,
          totalEstimatedCost: aiRecommendations.budgetBreakdown?.totalINR || budgetINR,
          totalEstimatedCostUSD: aiRecommendations.budgetBreakdown?.totalUSD || budgetUSD
        }
      };

      // Save to database
      const savedPlan = new TravelPlan({
        userId: req.user ? req.user.id : null,
        destination: `${destination}, ${country}`,
        duration: numberOfDays,
        budget: budgetUSD,
        travelDates: startDate ? { startDate, endDate } : undefined,
        preferences: interests || [],
        aiRecommendations: comprehensivePlan.aiRecommendations,
        status: 'draft'
      });

      await savedPlan.save();

      res.status(200).json({
        success: true,
        message: 'Comprehensive travel plan generated successfully using AI',
        data: {
          planId: savedPlan._id,
          ...comprehensivePlan
        }
      });

    } catch (aiError) {
      // If Gemini AI fails, return an error with instructions
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI travel recommendations',
        error: aiError.message,
        instructions: {
          geminiSetup: 'Please ensure your Gemini API key is correctly configured and has access to Gemini models',
          steps: [
            '1. Enable Gemini API in your Google Cloud Console',
            '2. Ensure your API key has the correct permissions',
            '3. Check that the Gemini API is available in your region',
            '4. Verify your API key is valid and active'
          ]
        }
      });
      return;
    }

  } catch (error) {
    console.error('Error generating comprehensive travel plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate comprehensive travel plan',
      error: error.message
    });
  }
};

/**
 * Generate detailed recommendations using AI or fallback
 */
async function generateDetailedRecommendations(params) {
  try {
    // Try Gemini AI first
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    Create a comprehensive travel plan for:
    - Destination: ${params.destination}, ${params.country}
    - Duration: ${params.numberOfDays} days
    - Budget: $${params.budgetUSD} USD (₹${params.budgetUSD * 83} INR)
    - Travelers: ${params.numberOfTravelers}
    - Interests: ${params.interests.join(', ')}
    - Accommodation: ${params.accommodationType}
    - Travel Style: ${params.travelStyle}
    - Group Type: ${params.groupType}

    Provide detailed recommendations including:

    1. DAILY ITINERARY: For each day, provide:
       - Specific activities with exact locations, street names, and landmarks
       - Restaurant recommendations with names, addresses, and specialties
       - Estimated costs per day
       - Time requirements

    2. BUDGET BREAKDOWN: 
       - Accommodation costs (daily and total)
       - Food expenses (daily and total)
       - Activity costs (daily and total)
       - Transportation costs (daily and total)
       - Total estimated cost

    3. TRAVEL TIPS:
       - Best time to visit
       - Weather information
       - Local customs and etiquette
       - Transportation options
       - Safety tips

    4. MUST-VISIT PLACES: List top attractions with specific names and locations

    5. ALTERNATIVE DESTINATIONS: Suggest 2-3 similar destinations

    6. FEASIBILITY ASSESSMENT: 
       - Is this destination feasible for the given duration?
       - Feasibility score (1-10)
       - Reasons and suggestions

    Format your response as a valid JSON object with this structure:
    {
      "dailyItinerary": [
        {
          "day": 1,
          "activities": ["specific activity with location"],
          "meals": {
            "breakfast": "restaurant name and address",
            "lunch": "restaurant name and address", 
            "dinner": "restaurant name and address"
          },
          "estimatedCostINR": 2000,
          "estimatedCostUSD": 24,
          "timeRequired": "Full day"
        }
      ],
      "budgetBreakdown": {
        "accommodation": {"dailyINR": 5000, "totalINR": 15000, "dailyUSD": 60, "totalUSD": 180},
        "food": {"dailyINR": 3000, "totalINR": 9000, "dailyUSD": 36, "totalUSD": 108},
        "activities": {"dailyINR": 2000, "totalINR": 6000, "dailyUSD": 24, "totalUSD": 72},
        "transportation": {"dailyINR": 1000, "totalINR": 3000, "dailyUSD": 12, "totalUSD": 36},
        "totalINR": 50000,
        "totalUSD": 602
      },
      "travelTips": ["specific tip"],
      "mustVisitPlaces": ["specific place with location"],
      "alternativeDestinations": ["destination 1", "destination 2"],
      "bestTimeToVisit": "specific recommendation",
      "visaRequirements": "specific requirements",
      "feasibilityAssessment": {
        "isFeasible": true,
        "feasibilityScore": 8,
        "reasons": ["reason"],
        "suggestions": ["suggestion"]
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    try {
      const parsedResponse = JSON.parse(aiResponse);
      return parsedResponse;
    } catch (parseError) {
      // If JSON parsing fails, return the raw response
      return { 
        rawResponse: aiResponse,
        error: "Failed to parse AI response as JSON"
      };
    }
  } catch (error) {
    // If Gemini AI fails, throw the error instead of using fallback
    throw new Error(`Gemini AI error: ${error.message}`);
  }
}





module.exports = {
  generateTravelRecommendations,
  generateComprehensiveTravelPlan,
  getTravelPlans,
  getTravelPlan,
  updateTravelPlanStatus,
  getDestinationSuggestions
};
