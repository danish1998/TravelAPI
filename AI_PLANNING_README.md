# AI Travel Planning API

This API provides AI-powered travel planning capabilities using Google Gemini AI to generate personalized travel recommendations, itineraries, and destination suggestions.

## Features

- 🤖 **AI-Powered Recommendations**: Generate detailed travel plans using Google Gemini AI
- 💰 **Budget Estimation**: Get estimated costs for accommodations, activities, and meals
- 📍 **Destination Suggestions**: Get AI-curated destination recommendations based on duration and preferences
- ⏱️ **Duration-Based Planning**: Optimize travel plans based on available time
- 🎯 **Feasibility Assessment**: Check if destinations are suitable for your travel duration
- 💾 **Plan Management**: Save, retrieve, and update travel plans

## Setup

### 1. Install Dependencies

The AI planning feature requires the Google Generative AI package:

```bash
npm install @google/generative-ai
```

### 2. Environment Configuration

Add your Google Gemini API key to your environment variables:

```bash
# Add to your .env file
GEMINI_API_KEY=your_gemini_api_key_here
```

**To get your Gemini API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

### 3. Database Model

The AI planning feature uses the `TravelPlan` model which is automatically created when you run the application.

## API Endpoints

### Generate Travel Recommendations

**POST** `/api/v1/ai-planning/generate`

Generate detailed AI-powered travel recommendations for a specific destination.

**Request Body:**
```json
{
  "destination": "Paris",
  "duration": 3,
  "budget": 1500,
  "preferences": ["culture", "food", "sightseeing"],
  "startDate": "2024-06-01",
  "endDate": "2024-06-04"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Travel recommendations generated successfully",
  "data": {
    "planId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "destination": "Paris",
    "duration": 3,
    "recommendations": {
      "itinerary": [
        {
          "day": 1,
          "activities": ["Visit Eiffel Tower", "Explore Louvre Museum"],
          "estimatedCost": 150,
          "timeRequired": "Full day"
        }
      ],
      "totalEstimatedCost": 1200,
      "travelTips": ["Best time to visit", "Local customs"],
      "mustVisitPlaces": ["Eiffel Tower", "Louvre Museum"]
    }
  }
}
```

### Get Destination Suggestions

**GET** `/api/v1/ai-planning/destinations`

Get AI-curated destination suggestions based on travel duration and preferences.

**Query Parameters:**
- `duration` (required): Number of days
- `budget` (optional): Budget constraint
- `preferences` (optional): Comma-separated preferences

**Example:**
```
GET /api/v1/ai-planning/destinations?duration=7&budget=2500&preferences=beach,adventure
```

### Quick Plan Generation

**POST** `/api/v1/ai-planning/quick-plan`

Generate a quick travel plan with minimal input requirements.

**Request Body:**
```json
{
  "days": 5,
  "budget": 2000
}
```

### Feasibility Check

**GET** `/api/v1/ai-planning/feasibility/:destination/:days`

Check if a destination is feasible for the given number of days.

**Example:**
```
GET /api/v1/ai-planning/feasibility/Paris/3
```

**Response:**
```json
{
  "success": true,
  "data": {
    "destination": "Paris",
    "days": 3,
    "isFeasible": true,
    "feasibilityScore": 9,
    "reasons": ["Ideal duration for most destinations"],
    "suggestions": ["Consider multiple cities with good train connections"]
  }
}
```

### Plan Management

**GET** `/api/v1/ai-planning/plans` - Get all saved travel plans
**GET** `/api/v1/ai-planning/plans/:planId` - Get a specific travel plan
**PUT** `/api/v1/ai-planning/plans/:planId/status` - Update plan status

## Usage Examples

### 1. Generate a 3-Day Paris Itinerary

```javascript
const response = await fetch('/api/v1/ai-planning/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    destination: 'Paris',
    duration: 3,
    budget: 1500,
    preferences: ['culture', 'food', 'sightseeing']
  })
});

const result = await response.json();
console.log(result.data.recommendations);
```

### 2. Get Destination Suggestions for 7 Days

```javascript
const response = await fetch('/api/v1/ai-planning/destinations?duration=7&budget=2500');
const destinations = await response.json();
console.log(destinations.data.suggestions);
```

### 3. Check Feasibility

```javascript
const response = await fetch('/api/v1/ai-planning/feasibility/Tokyo/2');
const feasibility = await response.json();
console.log(feasibility.data.isFeasible);
```

## Testing

Run the comprehensive test suite:

```bash
node test-ai-planning-api.js
```

This will test all endpoints and functionality.

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Missing required fields or invalid input
- **404 Not Found**: Travel plan not found
- **500 Internal Server Error**: AI service errors or database issues

## Rate Limiting

The AI planning endpoints are subject to the same rate limiting as other API endpoints (1000 requests per 15 minutes by default).

## Security

- All endpoints are publicly accessible (no authentication required)
- User authentication is optional for saving plans
- Input validation prevents malicious requests

## Future Enhancements

- [ ] Integration with existing flight and hotel APIs
- [ ] Real-time pricing updates
- [ ] Multi-language support
- [ ] Advanced preference matching
- [ ] Social sharing capabilities
- [ ] Offline itinerary generation

## Troubleshooting

### Common Issues

1. **Gemini API Key Not Working**
   - Verify the API key is correct
   - Check if the key has proper permissions
   - Ensure the key is added to your `.env` file

2. **AI Response Parsing Errors**
   - The system includes fallback parsing for non-JSON responses
   - Check the `rawResponse` field for debugging

3. **Database Connection Issues**
   - Ensure MongoDB is running
   - Check connection string in environment variables

### Support

For issues or questions, please check the logs or create an issue in the project repository.
