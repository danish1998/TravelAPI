const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const mongoose = require("mongoose");
const TravelPlan = require("../Models/TravelPlan");
const { verifyToken } = require("../middleware/auth");

// Initialize DeepSeek AI
let deepseek;



if (process.env.DEEPSEEK_API_KEY) {
  deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });
}




// All AI planning routes require authentication
router.use(verifyToken());

/**
 * Convert budget string to number
 */
function convertBudgetToNumber(budget) {
  if (typeof budget === "number") return budget;

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
 * POST /api/v1/ai-deepseek/generate-comprehensive-plan
 */
router.post("/generate-comprehensive-plan", async (req, res) => {
  try {
    const {
      country,
      numberOfDays,
      travelStyle,
      interests,
      budget,
      groupType,
    } = req.body;

    // Validate required fields
    if (!country || !numberOfDays) {
      return res.status(400).json({
        success: false,
        message: "Country and number of days are required",
      });
    }

    // Convert budget early
    const budgetNumber = convertBudgetToNumber(budget);
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

    // ---------------------- FULL PROMPT ----------------------
    const prompt = `You are an expert travel planner. Generate a detailed ${numberOfDays}-day travel itinerary for ${country} with SPECIFIC locations... (FULL PROMPT YOU PROVIDED — EVERYTHING INCLUDED)`;

    let trip;

    try {
      console.log(`🤖 DeepSeek generating itinerary for ${country}...`);

      // --------------------- CALL DEEPSEEK ---------------------
      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 7000,
      });

      let aiResponse = response.choices[0].message.content.trim();

      // Clean ```
      aiResponse = aiResponse.replace(/```json|```/g, "").trim();

      // Parse JSON
      try {
        trip = JSON.parse(aiResponse);
        console.log("✅ DeepSeek returned valid JSON");
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError.message);
        console.error("AI Response (first 500 chars):", aiResponse.substring(0, 500));

        return res.status(500).json({
          success: false,
          message: "AI generated invalid JSON. Try again.",
          error: "Failed to parse DeepSeek response",
        });
      }
    } catch (err) {
      console.error("❌ DeepSeek Error:", err.message);
      return res.status(503).json({
        success: false,
        message: "AI service currently unavailable.",
        error: err.message,
      });
    }

    // ---------------- Fetch Images from Unsplash ----------------
    let imageUrls = [];
    if (unsplashApiKey) {
      try {
        const searchQuery = `${country} ${Array.isArray(interests) ? interests.join(" ") : interests} travel`;
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchQuery
        )}&client_id=${unsplashApiKey}&per_page=5`;

        const imageResponse = await fetch(url);
        const imageData = await imageResponse.json();

        if (imageData.results) {
          imageUrls = imageData.results
            .slice(0, 5)
            .map((img) => img.urls?.regular)
            .filter(Boolean);
        }

        console.log(`📸 Unsplash images fetched: ${imageUrls.length}`);
      } catch (imgErr) {
        console.warn("❌ Unsplash error:", imgErr.message);
      }
    }

    // ---------------- Transform Data for DB ----------------
    const transformed = {
      itinerary: trip.itinerary?.map((day) => {
        const activities = day.activities?.map((act) => {
          const cost = act.cost_breakdown;
          const costString = cost
            ? ` [Total: ₹${cost.total} - Entry: ₹${cost.entry_fee}, Transport: ₹${cost.transport}, Food: ₹${
                cost.breakfast || cost.lunch || cost.dinner || 0
              }, Misc: ₹${cost.misc || 0}]`
            : "";

          const tips = act.tips ? ` | Tips: ${act.tips}` : "";

          return `${act.time}: ${act.description}${costString}${tips}`;
        });

        const dailyCost =
          day.daily_total ||
          day.activities?.reduce(
            (sum, a) => sum + (a.cost_breakdown?.total || 0),
            0
          );

        const stayCost = day.accommodation?.estimated_cost || 0;

        return {
          day: day.day,
          location: day.location,
          activities,
          estimatedCost: dailyCost + stayCost,
          timeRequired: "Full day",
          accommodation: `${day.accommodation.type} - ₹${stayCost}`,
        };
      }),
      totalEstimatedCost: 0,
      bestTimeToVisit: Array.isArray(trip.bestTimeToVisit)
        ? trip.bestTimeToVisit.join("; ")
        : "",
      weatherInfo: Array.isArray(trip.weatherInfo)
        ? trip.weatherInfo.join("; ")
        : "",
      budgetSummary: trip.budget_summary || null,
    };

    transformed.totalEstimatedCost = transformed.itinerary.reduce(
      (a, b) => a + (b.estimatedCost || 0),
      0
    );

    // ---------------- Save to DB ----------------
    const travelPlan = new TravelPlan({
      userId: req.user.id,
      destination: country,
      duration: numberOfDays,
      budget: budgetNumber,
      preferences: interests,
      aiRecommendations: transformed,
      imageUrls,
      status: "draft",
      name: trip.name,
      description: trip.description,
      estimatedPrice:
        trip.estimatedPrice || `₹${transformed.totalEstimatedCost}`,
      travelStyle,
      groupType,
    });

    await travelPlan.save();

    res.status(200).json({
      success: true,
      message: "DeepSeek travel plan generated successfully",
      data: {
        planId: travelPlan._id,
        trip,
        imageUrls,
        totalCost: transformed.totalEstimatedCost,
      },
    });
  } catch (error) {
    console.error("❌ Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate travel plan",
      error: error.message,
    });
  }
});

// ---------------- GET: Get Plan by ID ----------------
router.get("/plan/:planId", async (req, res) => {
  try {
    const plan = await TravelPlan.findById(req.params.planId);
    if (!plan)
      return res.status(404).json({
        success: false,
        message: "Travel plan not found",
      });

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plan",
      error: error.message,
    });
  }
});

// ---------------- GET: All Plans ----------------
router.get("/plans", async (req, res) => {
  try {
    const plans = await TravelPlan.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
      error: error.message,
    });
  }
});

// ---------------- PUT: Update Status ----------------
router.put("/plan/:planId/status", async (req, res) => {
  try {
    const plan = await TravelPlan.findByIdAndUpdate(
      req.params.planId,
      { status: req.body.status },
      { new: true }
    );

    if (!plan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });

    res.json({
      success: true,
      message: "Status updated",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update plan status",
      error: error.message,
    });
  }
});

module.exports = router;
