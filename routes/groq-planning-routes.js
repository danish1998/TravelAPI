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
 * Get currency and pricing guidelines for a country
 */
function getCurrencyInfo(country) {
  const countryLower = country.toLowerCase();
  
  // Indian cities and regions
  const indianCities = [
    'india', 'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 
    'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur',
    'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri',
    'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik',
    'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar', 'aurangabad',
    'dhanbad', 'amritsar', 'navi mumbai', 'allahabad', 'ranchi', 'howrah',
    'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai',
    'raipur', 'kota', 'guwahati', 'chandigarh', 'solapur', 'hubli',
    'mysore', 'tiruchirappalli', 'bareilly', 'moradabad', 'gurgaon',
    'aligarh', 'jalandhar', 'bhubaneswar', 'salem', 'warangal', 'guntur',
    'bhiwandi', 'saharanpur', 'gorakhpur', 'bikaner', 'amravati', 'noida',
    'jamshedpur', 'bhilai', 'cuttack', 'firozabad', 'kochi', 'dehradun',
    'durgapur', 'pondicherry', 'goa', 'kerala', 'rajasthan', 'kashmir',
    'uttarakhand', 'himachal', 'sikkim', 'assam', 'meghalaya'
  ];
  
  // Check if it's India first
  if (indianCities.some(c => countryLower.includes(c))) {
    return { 
      currency: 'INR', 
      symbol: '₹', 
      conversionRate: 1,
      priceGuidelines: {
        metro_ticket: { low: 20, medium: 40, high: 60 },
        meal_budget: { low: 80, medium: 150, high: 250 },
        meal_midrange: { low: 250, medium: 400, high: 700 },
        meal_fine: { low: 800, medium: 1500, high: 3000 },
        attraction_free: 0,
        attraction_paid: { low: 50, medium: 200, high: 500 },
        hotel_budget: { low: 1000, medium: 2000, high: 3500 },
        hotel_midrange: { low: 2500, medium: 4500, high: 7000 },
        hotel_luxury: { low: 6000, medium: 12000, high: 25000 },
        taxi_per_km: 15,
        coffee: { low: 50, medium: 120, high: 250 }
      }
    };
  }
  
  // European countries (EUR)
  const euroCountries = [
    'amsterdam', 'netherlands', 'paris', 'france', 'germany', 'berlin', 
    'italy', 'rome', 'spain', 'madrid', 'barcelona', 'portugal', 'lisbon',
    'austria', 'vienna', 'belgium', 'brussels', 'greece', 'athens'
  ];
  
  // US cities and states (USD)
  const usdCountries = [
    'usa', 'united states', 'america', 'new york', 'los angeles', 
    'san francisco', 'chicago', 'miami', 'las vegas', 'seattle', 
    'boston', 'washington', 'orlando', 'hawaii', 'california', 
    'texas', 'florida', 'nevada'
  ];
  
  const cadCountries = ['canada', 'toronto', 'vancouver', 'montreal'];
  const gbpCountries = ['uk', 'united kingdom', 'england', 'london', 'scotland', 'edinburgh'];
  const thbCountries = ['thailand', 'bangkok', 'phuket', 'chiang mai'];
  const jpyCountries = ['japan', 'tokyo', 'osaka', 'kyoto'];
  const sgdCountries = ['singapore'];
  const myrCountries = ['malaysia', 'kuala lumpur'];
  const aedCountries = ['dubai', 'uae', 'united arab emirates', 'abu dhabi'];
  
  // Check country and return currency info
  if (euroCountries.some(c => countryLower.includes(c))) {
    return { 
      currency: 'EUR', 
      symbol: '€', 
      conversionRate: 90,
      priceGuidelines: {
        metro_ticket: { low: 2.5, medium: 3.5, high: 5 },
        meal_budget: { low: 8, medium: 15, high: 25 },
        meal_midrange: { low: 15, medium: 25, high: 40 },
        meal_fine: { low: 40, medium: 70, high: 120 },
        attraction_free: 0,
        attraction_paid: { low: 10, medium: 17, high: 25 },
        hotel_budget: { low: 50, medium: 80, high: 120 },
        hotel_midrange: { low: 100, medium: 150, high: 220 },
        hotel_luxury: { low: 200, medium: 300, high: 500 },
        taxi_per_km: 2,
        coffee: { low: 2.5, medium: 3.5, high: 5 }
      }
    };
  } else if (usdCountries.some(c => countryLower.includes(c))) {
    return { 
      currency: 'USD', 
      symbol: '$', 
      conversionRate: 83,
      priceGuidelines: {
        metro_ticket: { low: 2, medium: 3, high: 4 },
        meal_budget: { low: 10, medium: 15, high: 22 },
        meal_midrange: { low: 18, medium: 30, high: 50 },
        meal_fine: { low: 50, medium: 80, high: 150 },
        attraction_free: 0,
        attraction_paid: { low: 15, medium: 25, high: 40 },
        hotel_budget: { low: 70, medium: 100, high: 150 },
        hotel_midrange: { low: 120, medium: 180, high: 280 },
        hotel_luxury: { low: 250, medium: 400, high: 700 },
        taxi_per_km: 2.5,
        coffee: { low: 3, medium: 5, high: 7 }
      }
    };
  } else if (cadCountries.some(c => countryLower.includes(c))) {
    return { 
      currency: 'CAD', 
      symbol: 'C$', 
      conversionRate: 62,
      priceGuidelines: {
        metro_ticket: { low: 3, medium: 4, high: 5 },
        meal_budget: { low: 12, medium: 18, high: 25 },
        meal_midrange: { low: 20, medium: 35, high: 55 },
        meal_fine: { low: 60, medium: 90, high: 160 },
        attraction_free: 0,
        attraction_paid: { low: 15, medium: 25, high: 35 },
        hotel_budget: { low: 80, medium: 120, high: 170 },
        hotel_midrange: { low: 130, medium: 200, high: 300 },
        hotel_luxury: { low: 280, medium: 450, high: 800 },
        taxi_per_km: 2.2,
        coffee: { low: 3.5, medium: 5, high: 7 }
      }
    };
  } else if (gbpCountries.some(c => countryLower.includes(c))) {
    return { 
      currency: 'GBP', 
      symbol: '£', 
      conversionRate: 105,
      priceGuidelines: {
        metro_ticket: { low: 2.5, medium: 4, high: 6 },
        meal_budget: { low: 8, medium: 12, high: 18 },
        meal_midrange: { low: 15, medium: 25, high: 40 },
        meal_fine: { low: 40, medium: 65, high: 110 },
        attraction_free: 0,
        attraction_paid: { low: 12, medium: 20, high: 30 },
        hotel_budget: { low: 60, medium: 90, high: 130 },
        hotel_midrange: { low: 110, medium: 170, high: 260 },
        hotel_luxury: { low: 250, medium: 400, high: 700 },
        taxi_per_km: 2.5,
        coffee: { low: 2.8, medium: 4, high: 6 }
      }
    };
  } else if (thbCountries.some(c => countryLower.includes(c))) {
    return { 
      currency: 'THB', 
      symbol: '฿', 
      conversionRate: 2.4,
      priceGuidelines: {
        metro_ticket: { low: 20, medium: 35, high: 50 },
        meal_budget: { low: 50, medium: 100, high: 150 },
        meal_midrange: { low: 150, medium: 300, high: 500 },
        meal_fine: { low: 600, medium: 1000, high: 2000 },
        attraction_free: 0,
        attraction_paid: { low: 100, medium: 300, high: 500 },
        hotel_budget: { low: 400, medium: 800, high: 1300 },
        hotel_midrange: { low: 1200, medium: 2000, high: 3500 },
        hotel_luxury: { low: 3500, medium: 6000, high: 12000 },
        taxi_per_km: 10,
        coffee: { low: 40, medium: 80, high: 120 }
      }
    };
  } else {
    // Default to INR for unknown countries
    return { 
      currency: 'INR', 
      symbol: '₹', 
      conversionRate: 1,
      priceGuidelines: {
        metro_ticket: { low: 20, medium: 40, high: 60 },
        meal_budget: { low: 80, medium: 150, high: 250 },
        meal_midrange: { low: 250, medium: 400, high: 700 },
        meal_fine: { low: 800, medium: 1500, high: 3000 },
        attraction_free: 0,
        attraction_paid: { low: 50, medium: 200, high: 500 },
        hotel_budget: { low: 1000, medium: 2000, high: 3500 },
        hotel_midrange: { low: 2500, medium: 4500, high: 7000 },
        hotel_luxury: { low: 6000, medium: 12000, high: 25000 },
        taxi_per_km: 15,
        coffee: { low: 50, medium: 120, high: 250 }
      }
    };
  }
}

/**
 * Get budget-specific pricing
 */
function getBudgetPricing(priceGuidelines, budgetLevel) {
  const level = budgetLevel.toLowerCase();
  const index = level === 'low' ? 'low' : level === 'luxury' || level === 'high' ? 'high' : 'medium';
  
  return {
    metro: priceGuidelines.metro_ticket[index],
    breakfast: priceGuidelines.meal_budget[index],
    lunch: level === 'low' ? priceGuidelines.meal_budget[index] : 
           level === 'luxury' || level === 'high' ? priceGuidelines.meal_fine[index] : 
           priceGuidelines.meal_midrange[index],
    dinner: level === 'low' ? priceGuidelines.meal_midrange[index] : 
            level === 'luxury' || level === 'high' ? priceGuidelines.meal_fine[index] : 
            priceGuidelines.meal_midrange[index],
    attraction: priceGuidelines.attraction_paid[index],
    hotel: level === 'low' ? priceGuidelines.hotel_budget[index] : 
           level === 'luxury' || level === 'high' ? priceGuidelines.hotel_luxury[index] : 
           priceGuidelines.hotel_midrange[index],
    taxi_km: priceGuidelines.taxi_per_km,
    coffee: priceGuidelines.coffee[index]
  };
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
    
    // Get currency info for the destination
    const currencyInfo = getCurrencyInfo(country);
    const budgetPrices = getBudgetPricing(currencyInfo.priceGuidelines, budget);

    // Create enhanced prompt for detailed, location-specific travel planning
    const prompt = `You are an expert travel planner. Generate a detailed ${numberOfDays}-day travel itinerary for ${country} with SPECIFIC locations, attractions, and ACCURATE cost breakdowns.

USER PREFERENCES:
- Destination: ${country}
- Budget Level: ${budget}
- Travel Style: ${travelStyle}
- Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}
- Group Type: ${groupType}
- Number of Days: ${numberOfDays}

MANDATORY CURRENCY AND PRICING RULES:
- Local Currency: ${currencyInfo.currency} (${currencyInfo.symbol})
- YOU MUST USE ${currencyInfo.currency} FOR ALL PRICES
- Conversion Rate: 1 ${currencyInfo.currency} = ${currencyInfo.conversionRate} INR

REALISTIC PRICE RANGES FOR ${country.toUpperCase()} (${budget} BUDGET):
- Metro/Public Transport: ${currencyInfo.symbol}${budgetPrices.metro} per ride
- Breakfast: ${currencyInfo.symbol}${budgetPrices.breakfast}
- Lunch: ${currencyInfo.symbol}${budgetPrices.lunch}
- Dinner: ${currencyInfo.symbol}${budgetPrices.dinner}
- Attraction Entry: ${currencyInfo.symbol}${budgetPrices.attraction} (paid attractions)
- Hotel per night: ${currencyInfo.symbol}${budgetPrices.hotel}
- Taxi: ${currencyInfo.symbol}${budgetPrices.taxi_km} per km
- Coffee/Snacks: ${currencyInfo.symbol}${budgetPrices.coffee}

EXAMPLE COST BREAKDOWN FOR ONE ACTIVITY IN ${country}:
{
  "entry_fee": ${budgetPrices.attraction},
  "transport": ${budgetPrices.metro},
  "breakfast": ${budgetPrices.breakfast},
  "misc": ${Math.round(budgetPrices.coffee)},
  "total": ${budgetPrices.attraction + budgetPrices.metro + budgetPrices.breakfast + Math.round(budgetPrices.coffee)}
}

CRITICAL REQUIREMENTS:

1. SPECIFIC LOCATIONS & ATTRACTIONS:
   - Mention ONLY real, well-known landmarks and attractions in ${country}
   - Use accurate, officially recognized names (no generic or invented places)
   ${country.toLowerCase().includes('lucknow') ?
     '- Examples: Bara Imambara, Rumi Darwaza, Chota Imambara, British Residency, Hazratganj, Ambedkar Park, Constantia House' :
   country.toLowerCase().includes('delhi') ?
     '- Examples: Red Fort, India Gate, Qutub Minar, Lotus Temple, Humayuns Tomb, Chandni Chowk, Connaught Place' :
   country.toLowerCase().includes('amsterdam') || country.toLowerCase().includes('netherlands') ? 
     '- Examples: Anne Frank House, Van Gogh Museum, Rijksmuseum, Vondelpark, Canal Ring, Jordaan District, Red Light District' :
   country.toLowerCase().includes('las vegas') || country.toLowerCase().includes('vegas') ?
     '- Examples: Bellagio Fountains, Fremont Street, High Roller, Strip, Downtown, Arts District, Red Rock Canyon' :
   country.toLowerCase().includes('paris') ?
     '- Examples: Eiffel Tower, Louvre Museum, Arc de Triomphe, Notre-Dame, Montmartre, Champs-Élysées' :
     '- Include ACTUAL names of landmarks, districts, and neighborhoods'}
   - Include ACTUAL names of popular restaurants, cafes, markets, museums, and streets
   - Clearly specify the neighborhood, district, or locality for every activity

2. REALISTIC LOCAL PRICING (MANDATORY):
   - ALL numeric cost values MUST be in ${currencyInfo.currency}, NOT any other currency
   - Use the price ranges provided above as your guide
   - For ${budget} budget in ${country}:
     * Transport per activity: ${currencyInfo.symbol}${budgetPrices.metro} - ${currencyInfo.symbol}${budgetPrices.metro * 2}
     * Meals: Breakfast ~${currencyInfo.symbol}${budgetPrices.breakfast}, Lunch ~${currencyInfo.symbol}${budgetPrices.lunch}, Dinner ~${currencyInfo.symbol}${budgetPrices.dinner}
     * Attractions: Free to ${currencyInfo.symbol}${budgetPrices.attraction * 2}
     * Hotels: ${currencyInfo.symbol}${budgetPrices.hotel} per night

3. JSON FORMAT REQUIREMENTS:
   - ALL cost fields MUST be plain numbers (no currency symbols in numeric fields)
   - Currency is ${currencyInfo.currency}
   - Example: "entry_fee": ${budgetPrices.attraction} (CORRECT - number in ${currencyInfo.currency})
   - Example: "transport": ${budgetPrices.metro} (CORRECT for ${country})

4. TIME MANAGEMENT:
   - Include realistic travel time between locations
   - Suggest optimal visiting hours for each attraction
   - Account for opening/closing times

YOU MUST RESPOND WITH ONLY VALID JSON. No markdown, no code blocks, no explanatory text.

JSON STRUCTURE:
{
  "name": "Captivating trip title",
  "description": "Brief 2-3 sentence description (max 100 words)",
  "estimatedPrice": "${currencyInfo.symbol}[TOTAL]",
  "estimatedPriceINR": "₹[TOTAL_IN_INR]",
  "currency": "${currencyInfo.currency}",
  "currencySymbol": "${currencyInfo.symbol}",
  "conversionRate": ${currencyInfo.conversionRate},
  "duration": ${numberOfDays},
  "budget": "${budget}",
  "travelStyle": "${travelStyle}",
  "country": "${country}",
  "interests": ${JSON.stringify(interests)},
  "groupType": "${groupType}",
  "bestTimeToVisit": [
    "Season descriptions for ${country}"
  ],
  "weatherInfo": [
    "Temperature ranges for ${country}"
  ],
  "location": {
    "city": "${country}",
    "coordinates": [latitude, longitude],
    "openStreetMap": "https://www.openstreetmap.org/search?query=${encodeURIComponent(country)}"
  },
  "itinerary": [
    {
      "day": 1,
      "location": "Specific District/Area",
      "activities": [
        {
          "time": "Morning (9:00 AM - 12:00 PM)",
          "description": "🏛️ [SPECIFIC ATTRACTION] - Brief description",
          "cost_breakdown": {
            "entry_fee": ${budgetPrices.attraction},
            "transport": ${budgetPrices.metro},
            "breakfast": ${budgetPrices.breakfast},
            "misc": ${Math.round(budgetPrices.coffee)},
            "total": ${budgetPrices.attraction + budgetPrices.metro + budgetPrices.breakfast + Math.round(budgetPrices.coffee)}
          },
          "tips": "Insider tip"
        },
        {
          "time": "Afternoon (12:00 PM - 5:00 PM)",
          "description": "Activity description",
          "cost_breakdown": {
            "entry_fee": ${Math.round(budgetPrices.attraction * 1.2)},
            "transport": ${budgetPrices.metro},
            "lunch": ${budgetPrices.lunch},
            "misc": ${Math.round(budgetPrices.coffee * 2)},
            "total": ${Math.round(budgetPrices.attraction * 1.2) + budgetPrices.metro + budgetPrices.lunch + Math.round(budgetPrices.coffee * 2)}
          },
          "tips": "Helpful advice"
        },
        {
          "time": "Evening (5:00 PM - 9:00 PM)",
          "description": "Evening activity",
          "cost_breakdown": {
            "entry_fee": 0,
            "transport": ${budgetPrices.metro},
            "dinner": ${budgetPrices.dinner},
            "misc": ${Math.round(budgetPrices.coffee * 3)},
            "total": ${budgetPrices.metro + budgetPrices.dinner + Math.round(budgetPrices.coffee * 3)}
          },
          "tips": "Evening tip"
        }
      ],
      "daily_total": ${(budgetPrices.attraction + budgetPrices.metro + budgetPrices.breakfast + Math.round(budgetPrices.coffee)) + (Math.round(budgetPrices.attraction * 1.2) + budgetPrices.metro + budgetPrices.lunch + Math.round(budgetPrices.coffee * 2)) + (budgetPrices.metro + budgetPrices.dinner + Math.round(budgetPrices.coffee * 3))},
      "accommodation": {
        "type": "${budget} hotel/hostel in ${country}",
        "estimated_cost": ${budgetPrices.hotel},
        "notes": "Accommodation description"
      }
    }
  ],
  "budget_summary": {
    "accommodation_total": "${currencyInfo.symbol}[AMOUNT]",
    "activities_total": "${currencyInfo.symbol}[AMOUNT]",
    "food_total": "${currencyInfo.symbol}[AMOUNT]",
    "transport_total": "${currencyInfo.symbol}[AMOUNT]",
    "miscellaneous_total": "${currencyInfo.symbol}[AMOUNT]",
    "grand_total": "${currencyInfo.symbol}[AMOUNT]"
  }
}

FINAL REMINDER:
- Currency is ${currencyInfo.currency}, use it for ALL prices
- All numeric costs must reflect real ${country} prices in ${currencyInfo.currency}
- Transport in ${country} costs around ${currencyInfo.symbol}${budgetPrices.metro}
- Meals in ${country} cost ${currencyInfo.symbol}${budgetPrices.lunch}
- Hotels in ${country} cost ${currencyInfo.symbol}${budgetPrices.hotel}`;

    let trip;

    // -------------------------------
    // CALL GROQ
    // -------------------------------
    try {
      console.log(`🤖 Groq: Generating itinerary for ${country}...`);
      console.log(`💱 Currency: ${currencyInfo.currency} (${currencyInfo.symbol})`);
      console.log(`💰 Sample prices - Metro: ${currencyInfo.symbol}${budgetPrices.metro}, Lunch: ${currencyInfo.symbol}${budgetPrices.lunch}, Hotel: ${currencyInfo.symbol}${budgetPrices.hotel}`);

      const ai = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: 8192,
        messages: [
          {
            role: 'system',
            content: `You are an expert international travel planner with deep knowledge of real prices in different countries. 

CRITICAL: When planning for ${country}:
- Currency is ${currencyInfo.currency}
- Transport costs around ${currencyInfo.symbol}${budgetPrices.metro} per ride in ${country}
- Meals cost ${currencyInfo.symbol}${budgetPrices.lunch} in ${country}
- Hotels cost ${currencyInfo.symbol}${budgetPrices.hotel} per night in ${country}

You MUST respond only with valid JSON. No markdown, no code blocks, no explanation. All numeric cost fields must be plain numbers in ${currencyInfo.currency}.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      let aiResponse = ai.choices?.[0]?.message?.content || '';

      // Clean the response
      aiResponse = aiResponse.trim();
      if (aiResponse.includes('```json')) {
        aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      if (aiResponse.includes('```')) {
        aiResponse = aiResponse.replace(/```\n?/g, '');
      }
      aiResponse = aiResponse.trim();

      try {
        trip = JSON.parse(aiResponse);
        console.log('✅ AI travel plan generated');
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError.message);
        console.error('Response preview:', aiResponse.substring(0, 500));

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
        message: 'AI service is currently unavailable. Please try again later.',
        error: groqError.message,
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
        console.log(`📸 Fetched ${imageUrls.length} images`);
      } catch (imageError) {
        console.warn('❌ Image fetch failed:', imageError.message);
      }
    }

    // -------------------------------
    // Transform AI response
    // -------------------------------
    const transformedRecommendations = {
      itinerary:
        trip.itinerary?.map((day) => {
          const activities =
            day.activities?.map((activity) => {
              const cost = activity.cost_breakdown || {};
              const food = cost.breakfast || cost.lunch || cost.dinner || 0;

              const costInfo = activity.cost_breakdown
                ? ` [Total: ${currencyInfo.symbol}${cost.total} - Entry: ${currencyInfo.symbol}${cost.entry_fee}, Transport: ${currencyInfo.symbol}${cost.transport}, Food: ${currencyInfo.symbol}${food}, Misc: ${currencyInfo.symbol}${cost.misc || 0}]`
                : '';

              const tips = activity.tips ? ` | Tips: ${activity.tips}` : '';
              return `${activity.time}: ${activity.description}${costInfo}${tips}`;
            }) || [];

          let dailyCost = 0;
          if (typeof day.daily_total === 'number') {
            dailyCost = day.daily_total;
          } else if (day.daily_total) {
            dailyCost = parseFloat(String(day.daily_total).replace(/[^\d.]/g, '')) || 0;
          }

          if (dailyCost === 0) {
            dailyCost = day.activities?.reduce((sum, act) => {
              const actTotal = act.cost_breakdown?.total || 0;
              return sum + (typeof actTotal === 'number' ? actTotal : parseFloat(String(actTotal).replace(/[^\d.]/g, '')) || 0);
            }, 0) || 0;
          }

          let accommodationCost = 0;
          if (day.accommodation?.estimated_cost) {
            if (typeof day.accommodation.estimated_cost === 'number') {
              accommodationCost = day.accommodation.estimated_cost;
            } else {
              accommodationCost = parseFloat(String(day.accommodation.estimated_cost).replace(/[^\d.]/g, '')) || 0;
            }
          }

          const totalDailyCost = Number(dailyCost) + Number(accommodationCost);
          const totalDailyCostINR = Math.round(totalDailyCost * currencyInfo.conversionRate);

          return {
            day: day.day,
            location: day.location,
            activities,
            estimatedCost: totalDailyCostINR,
            estimatedCostLocal: totalDailyCost,
            localCurrency: currencyInfo.currency,
            timeRequired: 'Full day',
            accommodation: day.accommodation
              ? `${day.accommodation.type} - ${currencyInfo.symbol}${accommodationCost.toFixed(2)}${currencyInfo.currency !== 'INR' ? ` (₹${Math.round(accommodationCost * currencyInfo.conversionRate)})` : ''}`
              : null,
          };
        }) || [],
      totalEstimatedCost: 0,
      totalEstimatedCostLocal: 0,
      currency: currencyInfo.currency,
      currencySymbol: currencyInfo.symbol,
      conversionRate: currencyInfo.conversionRate,
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

    transformedRecommendations.totalEstimatedCostLocal =
      transformedRecommendations.itinerary.reduce(
        (total, day) => total + (Number(day.estimatedCostLocal) || 0),
        0
      );
    
    transformedRecommendations.totalEstimatedCost = Math.round(
      transformedRecommendations.totalEstimatedCostLocal * currencyInfo.conversionRate
    );

    // FIX: Calculate estimatedPrice with fallback
    let estimatedPriceString = '';
    if (trip.estimatedPrice && trip.estimatedPrice !== `${currencyInfo.symbol}`) {
      // Use AI's estimatedPrice if valid
      estimatedPriceString = trip.estimatedPrice;
    } else {
      // Fallback: calculate from totalEstimatedCostLocal
      if (currencyInfo.currency === 'INR') {
        estimatedPriceString = `₹${transformedRecommendations.totalEstimatedCost}`;
      } else {
        estimatedPriceString = `${currencyInfo.symbol}${transformedRecommendations.totalEstimatedCostLocal.toFixed(2)} (₹${transformedRecommendations.totalEstimatedCost})`;
      }
    }

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
      estimatedPrice: estimatedPriceString,
      travelStyle: travelStyle || null,
      groupType: groupType || null,
    });

    await travelPlan.save();

    console.log(`✅ Plan saved: ${travelPlan._id}`);
    console.log(`💰 Total: ${estimatedPriceString}`);

    res.status(200).json({
      success: true,
      message: 'Travel plan generated successfully',
      data: {
        planId: travelPlan._id,
        trip,
        imageUrls,
        totalCost: transformedRecommendations.totalEstimatedCost,
        totalCostLocal: transformedRecommendations.totalEstimatedCostLocal,
        currency: currencyInfo.currency,
        currencySymbol: currencyInfo.symbol,
      },
    });
  } catch (error) {
    console.error('❌ Error:', error);
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
    console.error('Error:', error);
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
    console.error('Error:', error);
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
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update travel plan status',
      error: error.message,
    });
  }
});

module.exports = router;