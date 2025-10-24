const mongoose = require('mongoose');

const travelPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous plans
  },
  destination: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // Number of days
    required: true
  },
  budget: {
    type: Number,
    required: false
  },
  travelDates: {
    startDate: {
      type: Date,
      required: false
    },
    endDate: {
      type: Date,
      required: false
    }
  },
  preferences: {
    type: [String], // e.g., ['beach', 'mountains', 'city', 'adventure']
    default: []
  },
  aiRecommendations: {
    itinerary: [{
      day: Number,
      activities: [String],
      estimatedCost: Number,
      timeRequired: String
    }],
    totalEstimatedCost: Number,
    bestTimeToVisit: String,
    weatherInfo: String,
    travelTips: [String],
    mustVisitPlaces: [String],
    alternativeDestinations: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'saved', 'booked'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for better query performance
travelPlanSchema.index({ userId: 1, createdAt: -1 });
travelPlanSchema.index({ destination: 1, duration: 1 });

module.exports = mongoose.model('TravelPlan', travelPlanSchema);
