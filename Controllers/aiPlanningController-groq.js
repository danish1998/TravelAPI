// Updated AI Planning Controller using Groq (Free AI)
const { generateTravelRecommendations: groqTravelRecs, getDestinationSuggestions: groqDestinations, generateComprehensivePlan: groqComprehensive } = require('../ai-service-groq');
const TravelPlan = require('../Models/TravelPlan');

/**
 * Generate AI travel recommendations using Groq AI
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

    // Generate recommendations using Groq AI
    const aiRecommendations = await groqTravelRecs({
      destination,
      duration,
      budget,
      preferences,
      startDate,
      endDate
    });

    // Create travel plan record
    const travelPlan = new TravelPlan({
      userId: req.user ? req.user.id : null,
      destination,
      duration,
      budget,
      travelDates: startDate ? { startDate, endDate } : undefined,
      preferences: preferences || [],
      aiRecommendations,
      status: 'draft'
    });

    await travelPlan.save();

    res.status(200).json({
      success: true,
      message: 'Travel recommendations generated successfully using Groq AI',
      data: {
        planId: travelPlan._id,
        destination,
        duration,
        recommendations: aiRecommendations
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
 * Get destination suggestions using Groq AI
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

    const suggestions = await groqDestinations({
      duration,
      budget,
      preferences
    });

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

/**
 * Generate comprehensive travel plan using Groq AI
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
      // Generate AI-powered recommendations using Groq AI
      const aiRecommendations = await groqComprehensive({
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

      // Create comprehensive response using AI recommendations
      const comprehensivePlan = {
        ...travelPlan,
        aiRecommendations: {
          ...aiRecommendations,
          totalEstimatedCost: aiRecommendations.budgetBreakdown?.totalUSD || budgetUSD,
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
        message: 'Comprehensive travel plan generated successfully using Groq AI',
        data: {
          planId: savedPlan._id,
          ...comprehensivePlan
        }
      });

    } catch (aiError) {
      // If Groq AI fails, return an error with instructions
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI travel recommendations',
        error: aiError.message,
        instructions: {
          groqSetup: 'Please ensure your Groq API key is correctly configured',
          steps: [
            '1. Get a free API key from https://console.groq.com/',
            '2. Add GROQ_API_KEY to your .env file',
            '3. Install groq-sdk: npm install groq-sdk',
            '4. Restart your server'
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

module.exports = {
  generateTravelRecommendations,
  generateComprehensiveTravelPlan,
  getTravelPlans,
  getTravelPlan,
  updateTravelPlanStatus,
  getDestinationSuggestions
};
