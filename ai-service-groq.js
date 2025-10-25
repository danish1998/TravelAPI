// Groq AI Service - Free alternative to Gemini
const Groq = require('groq-sdk');

// Initialize Groq with free API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_your_free_api_key_here'
});

/**
 * Generate travel recommendations using Groq AI
 */
async function generateTravelRecommendations(params) {
  try {
    const { destination, duration, budget, preferences, startDate, endDate } = params;

    const prompt = `
    You are an expert travel planner. Create a detailed travel plan for:

    Destination: ${destination}
    Duration: ${duration} days
    Budget: ${budget ? `$${budget}` : 'Not specified'}
    Preferences: ${preferences ? preferences.join(', ') : 'No specific preferences'}
    Travel Dates: ${startDate ? `From ${startDate} to ${endDate}` : 'Not specified'}

    Provide a comprehensive travel plan with:

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

    5. **Alternative Destinations**: Suggest 2-3 similar destinations

    6. **Feasibility Assessment**: Is this destination feasible for the given duration?

    Format your response as a structured JSON object.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192", // Free model on Groq
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = completion.choices[0]?.message?.content;
    
    // Try to parse as JSON, fallback to structured response
    try {
      return JSON.parse(response);
    } catch (parseError) {
      return {
        rawResponse: response,
        itinerary: generateFallbackItinerary(duration),
        totalEstimatedCost: budget || calculateRealisticBudget(duration),
        travelTips: [
          'Check local weather conditions',
          'Book accommodations in advance',
          'Learn basic local phrases'
        ],
        mustVisitPlaces: [
          'Main city center',
          'Local attractions',
          'Cultural sites'
        ],
        alternativeDestinations: [
          'Alternative destination 1',
          'Alternative destination 2'
        ]
      };
    }

  } catch (error) {
    console.error('Groq AI Error:', error.message);
    throw new Error(`Groq AI error: ${error.message}`);
  }
}

/**
 * Get destination suggestions using Groq AI
 */
async function getDestinationSuggestions(params) {
  try {
    const { duration, budget, preferences } = params;

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

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a travel destination expert. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content;
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      return generateFallbackDestinations(duration);
    }

  } catch (error) {
    console.error('Groq AI Error:', error.message);
    throw new Error(`Groq AI error: ${error.message}`);
  }
}

/**
 * Generate comprehensive travel plan using Groq AI
 */
async function generateComprehensivePlan(params) {
  try {
    const {
      destination,
      country,
      numberOfDays,
      budgetUSD,
      numberOfTravelers,
      interests,
      accommodationType,
      travelStyle,
      groupType
    } = params;

    const prompt = `
    Create a comprehensive travel plan for:
    - Destination: ${destination}, ${country}
    - Duration: ${numberOfDays} days
    - Budget: $${budgetUSD} USD
    - Travelers: ${numberOfTravelers}
    - Interests: ${interests.join(', ')}
    - Accommodation: ${accommodationType}
    - Travel Style: ${travelStyle}
    - Group Type: ${groupType}

    Provide detailed recommendations including:

    1. DAILY ITINERARY: For each day, provide:
       - Specific activities with exact locations
       - Restaurant recommendations with names and specialties
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

    Format your response as a valid JSON object.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = completion.choices[0]?.message?.content;
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      return {
        rawResponse: response,
        dailyItinerary: generateFallbackItinerary(numberOfDays),
        budgetBreakdown: calculateRealisticBudgetBreakdown(numberOfDays, budgetUSD),
        travelTips: [
          'Check local weather conditions',
          'Book accommodations in advance',
          'Learn basic local phrases'
        ],
        mustVisitPlaces: [
          'Main city center',
          'Local attractions',
          'Cultural sites'
        ],
        alternativeDestinations: [
          'Alternative destination 1',
          'Alternative destination 2'
        ],
        feasibilityAssessment: {
          isFeasible: true,
          feasibilityScore: 8,
          reasons: ['Good duration for the destination'],
          suggestions: ['Consider extending your stay']
        }
      };
    }

  } catch (error) {
    console.error('Groq AI Error:', error.message);
    throw new Error(`Groq AI error: ${error.message}`);
  }
}

// Helper functions for fallback responses
function generateFallbackItinerary(days) {
  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    // Calculate realistic daily cost
    const baseCost = 2000; // Base cost in INR
    const dayMultiplier = 1 + (i * 0.15); // Increase for later days
    const randomVariation = 0.7 + (Math.random() * 0.6); // ±30% variation
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

// Calculate realistic budget based on duration
function calculateRealisticBudget(duration) {
  const baseCost = 3000; // Base cost per day in INR
  const totalCost = baseCost * duration;
  const randomVariation = 0.8 + (Math.random() * 0.4); // ±20% variation
  return Math.round(totalCost * randomVariation);
}

// Calculate realistic budget breakdown
function calculateRealisticBudgetBreakdown(days, budgetUSD) {
  const totalBudget = budgetUSD || (days * 100); // Default $100/day if no budget provided
  
  // Distribute budget across categories
  const accommodation = Math.round(totalBudget * 0.4 / days); // 40% for accommodation
  const food = Math.round(totalBudget * 0.3 / days); // 30% for food
  const activities = Math.round(totalBudget * 0.2 / days); // 20% for activities
  const transportation = Math.round(totalBudget * 0.1 / days); // 10% for transportation
  
  return {
    accommodation: { 
      dailyUSD: accommodation, 
      totalUSD: accommodation * days,
      dailyINR: Math.round(accommodation * 83),
      totalINR: Math.round(accommodation * 83 * days)
    },
    food: { 
      dailyUSD: food, 
      totalUSD: food * days,
      dailyINR: Math.round(food * 83),
      totalINR: Math.round(food * 83 * days)
    },
    activities: { 
      dailyUSD: activities, 
      totalUSD: activities * days,
      dailyINR: Math.round(activities * 83),
      totalINR: Math.round(activities * 83 * days)
    },
    transportation: { 
      dailyUSD: transportation, 
      totalUSD: transportation * days,
      dailyINR: Math.round(transportation * 83),
      totalINR: Math.round(transportation * 83 * days)
    },
    totalUSD: totalBudget,
    totalINR: Math.round(totalBudget * 83)
  };
}

function generateFallbackDestinations(duration) {
  return [
    {
      name: 'Paris, France',
      country: 'France',
      reason: `Perfect for ${duration} days`,
      budgetRange: '$800-1200',
      bestTime: 'Spring/Fall',
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Seine River'],
      feasibilityScore: 9
    },
    {
      name: 'Tokyo, Japan',
      country: 'Japan',
      reason: `Great for ${duration} days`,
      budgetRange: '$900-1300',
      bestTime: 'Spring/Fall',
      attractions: ['Tokyo Skytree', 'Senso-ji Temple', 'Tsukiji Market'],
      feasibilityScore: 8
    },
    {
      name: 'Barcelona, Spain',
      country: 'Spain',
      reason: `Ideal for ${duration} days`,
      budgetRange: '$600-1000',
      bestTime: 'Spring/Fall',
      attractions: ['Sagrada Familia', 'Park Güell', 'Las Ramblas'],
      feasibilityScore: 9
    }
  ];
}

module.exports = {
  generateTravelRecommendations,
  getDestinationSuggestions,
  generateComprehensivePlan
};
