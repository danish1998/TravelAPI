const express = require('express');
const router = express.Router();
const {
  generateTravelRecommendations,
  generateComprehensiveTravelPlan,
  getTravelPlans,
  getTravelPlan,
  updateTravelPlanStatus,
  getDestinationSuggestions
} = require('../Controllers/aiPlanningController');
const { verifyToken } = require('../middleware/auth');

/**
 * @route POST /api/v1/ai-planning/generate
 * @desc Generate AI travel recommendations
 * @access Public (optional auth)
 */
router.post('/generate', async (req, res) => {
  // Optional authentication - if user is logged in, associate plan with user
  return generateTravelRecommendations(req, res);
});

/**
 * @route POST /api/v1/ai-planning/comprehensive
 * @desc Generate comprehensive travel plan with detailed form inputs
 * @access Public (optional auth)
 */
router.post('/comprehensive', async (req, res) => {
  return generateComprehensiveTravelPlan(req, res);
});

/**
 * @route GET /api/v1/ai-planning/destinations
 * @desc Get destination suggestions based on duration
 * @access Public
 */
router.get('/destinations', getDestinationSuggestions);

/**
 * @route GET /api/v1/ai-planning/plans
 * @desc Get saved travel plans (requires auth for user plans)
 * @access Public (for anonymous plans) / Private (for user plans)
 */
router.get('/plans', async (req, res) => {
  return getTravelPlans(req, res);
});

/**
 * @route GET /api/v1/ai-planning/plans/:planId
 * @desc Get a specific travel plan
 * @access Public
 */
router.get('/plans/:planId', getTravelPlan);

/**
 * @route PUT /api/v1/ai-planning/plans/:planId/status
 * @desc Update travel plan status
 * @access Public
 */
router.put('/plans/:planId/status', updateTravelPlanStatus);

/**
 * @route POST /api/v1/ai-planning/quick-plan
 * @desc Generate a quick travel plan with minimal input
 * @access Public
 */
router.post('/quick-plan', async (req, res) => {
  try {
    const { days, budget } = req.body;
    
    if (!days) {
      return res.status(400).json({
        success: false,
        message: 'Number of days is required'
      });
    }

    // Generate a quick plan with destination suggestions
    const quickPlan = {
      destination: 'Multiple destinations suggested',
      duration: days,
      budget: budget || null,
      preferences: [],
      recommendations: {
        suggestedDestinations: [
          {
            name: 'Paris, France',
            reason: `Perfect for ${days} days`,
            estimatedCost: budget ? `${budget * 0.8}-${budget}` : '$800-1200',
            highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise']
          },
          {
            name: 'Tokyo, Japan',
            reason: `Great for ${days} days`,
            estimatedCost: budget ? `${budget * 0.9}-${budget}` : '$900-1300',
            highlights: ['Tokyo Skytree', 'Senso-ji Temple', 'Tsukiji Fish Market']
          },
          {
            name: 'Barcelona, Spain',
            reason: `Ideal for ${days} days`,
            estimatedCost: budget ? `${budget * 0.7}-${budget}` : '$600-1000',
            highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas']
          }
        ],
        totalEstimatedCost: budget || 1000,
        travelTips: [
          'Book flights and accommodation in advance',
          'Check visa requirements',
          'Pack according to season and destination',
          'Download offline maps and translation apps'
        ]
      }
    };

    res.status(200).json({
      success: true,
      message: 'Quick travel plan generated',
      data: quickPlan
    });

  } catch (error) {
    console.error('Error generating quick plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quick plan',
      error: error.message
    });
  }
});

/**
 * @route GET /api/v1/ai-planning/feasibility/:destination/:days
 * @desc Check if a destination is feasible for given number of days
 * @access Public
 */
router.get('/feasibility/:destination/:days', async (req, res) => {
  try {
    const { destination, days } = req.params;
    const daysNum = parseInt(days);

    if (isNaN(daysNum) || daysNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid number of days'
      });
    }

    // Simple feasibility logic based on destination and days
    let feasibility = {
      destination,
      days: daysNum,
      isFeasible: true,
      feasibilityScore: 8,
      reasons: [],
      suggestions: []
    };

    if (daysNum < 2) {
      feasibility.isFeasible = false;
      feasibility.feasibilityScore = 3;
      feasibility.reasons.push('Less than 2 days is too short for meaningful travel');
      feasibility.suggestions.push('Consider extending to at least 3 days');
    } else if (daysNum > 14) {
      feasibility.feasibilityScore = 7;
      feasibility.reasons.push('Long trips require more planning and budget');
      feasibility.suggestions.push('Consider breaking into multiple shorter trips');
    } else if (daysNum >= 3 && daysNum <= 7) {
      feasibility.feasibilityScore = 9;
      feasibility.reasons.push('Ideal duration for most destinations');
    }

    // Destination-specific logic
    const destinationLower = destination.toLowerCase();
    if (destinationLower.includes('island') || destinationLower.includes('maldives')) {
      feasibility.feasibilityScore = Math.min(feasibility.feasibilityScore + 1, 10);
      feasibility.reasons.push('Island destinations are perfect for relaxation');
    }

    if (destinationLower.includes('europe')) {
      feasibility.suggestions.push('Consider multiple cities with good train connections');
    }

    res.status(200).json({
      success: true,
      data: feasibility
    });

  } catch (error) {
    console.error('Error checking feasibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check feasibility',
      error: error.message
    });
  }
});

module.exports = router;
