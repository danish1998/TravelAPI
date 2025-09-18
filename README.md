# 🌍 Travel API

A comprehensive REST API for travel-related services including flight search, hotel search, weekend getaways, travel categories, continents data, and user authentication.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Rate Limiting](#-rate-limiting)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Contributing](#-contributing)

## ✨ Features

- **🔐 User Authentication** - JWT-based authentication with secure cookies
- **✈️ Flight Search** - Real-time flight data using Amadeus API
- **🏨 Hotel Search** - Hotel booking with Amadeus API integration
- **🏖️ Weekend Getaways** - Find weekend destinations using free APIs
- **🎯 Travel Categories** - Categorized travel destinations (beach, mountain, city, etc.)
- **🌍 Continents API** - Global country and city data
- **📍 Location Services** - IP-based geolocation
- **🛡️ Security** - Rate limiting, CORS, input validation
- **📊 Real-time Data** - Live data from multiple third-party APIs

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **APIs**: Amadeus, OpenStreetMap, Wikipedia, OpenWeatherMap, Foursquare
- **Security**: CORS, Rate Limiting, Input Validation
- **Environment**: dotenv for configuration

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TravelAPI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/travelapi

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_COOKIE_NAME=token
JWT_EXPIRES_IN=1d
JWT_ALG=HS256

# Amadeus API Configuration (Required for flights/hotels)
AMADEUS_CLIENT_ID=your-amadeus-client-id
AMADEUS_CLIENT_SECRET=your-amadeus-client-secret

# Optional API Keys (for enhanced data)
FOURSQUARE_API_KEY=your_foursquare_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Server Configuration
NODE_ENV=development
PORT=8080

# Rate Limiting Configuration
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Database Connection (optional)
ALLOW_START_WITHOUT_DB=false
```

### 🔑 Getting API Keys

#### **Required APIs:**
- **Amadeus API**: [Sign up here](https://developers.amadeus.com/) for flight and hotel data

#### **Optional APIs (Free tiers available):**
- **Foursquare API**: [Sign up here](https://developer.foursquare.com/) (1000 requests/day)
- **OpenWeatherMap API**: [Sign up here](https://openweathermap.org/api) (1000 requests/day)

#### **Free APIs (No keys required):**
- OpenStreetMap Nominatim
- Wikipedia API
- REST Countries API
- OpenTripMap API

## 📚 API Endpoints

### 🔐 Authentication Endpoints

#### **POST** `/api/v1/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890"
}
```

#### **POST** `/api/v1/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890"
}
```

#### **GET** `/api/v1/auth/logout`
Logout user (clears JWT cookie).

**Response:**
```json
{
  "success": true
}
```

#### **GET** `/api/v1/protected`
Protected route example (requires authentication).

**Headers:** `Cookie: token=jwt_token`

**Response:**
```json
{
  "message": "Token is valid",
  "user": {
    "id": "user_id",
    "email": "john@example.com"
  }
}
```

### ✈️ Flight Search Endpoints

#### **POST** `/api/v1/flights/search`
Search for flights.

**Request Body:**
```json
{
  "origin": "DEL",
  "destination": "BOM",
  "departureDate": "2024-03-15",
  "returnDate": "2024-03-20",
  "adults": 2,
  "children": 1,
  "infants": 0,
  "currencyCode": "USD",
  "travelClass": "ECONOMY",
  "nonStop": false,
  "maxPrice": 1000,
  "sortBy": "price",
  "sortOrder": "asc",
  "limit": 10
}
```

**Response:**
```json
{
  "count": 5,
  "offers": [
    {
      "id": "offer_id",
      "oneWay": false,
      "price": 450.50,
      "currency": "USD",
      "passengerMix": {
        "adults": 2,
        "children": 1,
        "infants": 0,
        "travelClass": "ECONOMY"
      },
      "carrierCodes": ["AI", "6E"],
      "carrierNames": ["Air India", "IndiGo"],
      "primaryCarrierLogo": "https://pics.avs.io/200/50/AI.png",
      "totalDurationMin": 180,
      "earliestDepartureTs": 1647302400000,
      "itineraries": [
        {
          "duration": "PT3H",
          "stops": 1,
          "segments": [
            {
              "carrierCode": "AI",
              "carrierName": "Air India",
              "carrierLogo": "https://pics.avs.io/200/50/AI.png",
              "number": "AI101",
              "departure": {
                "iataCode": "DEL",
                "at": "2024-03-15T08:00:00"
              },
              "arrival": {
                "iataCode": "BOM",
                "at": "2024-03-15T11:00:00"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 🏨 Hotel Search Endpoints

#### **POST** `/api/v1/hotels/search`
Search for hotels.

**Request Body:**
```json
{
  "cityCode": "DEL",
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-18",
  "adults": 2,
  "roomQuantity": 1,
  "currency": "USD",
  "priceMax": 200,
  "ratings": "4,5",
  "amenities": "WIFI,PARKING,POOL",
  "sortBy": "price",
  "sortOrder": "asc",
  "limit": 10
}
```

**Response:**
```json
{
  "count": 8,
  "hotels": [
    {
      "hotelId": "hotel_123",
      "name": "Taj Palace Hotel",
      "chainCode": "TAJ",
      "brandCode": "TAJ",
      "rating": 5,
      "latitude": 28.6139,
      "longitude": 77.2090,
      "distance": 5.2,
      "distanceUnit": "KM",
      "address": {
        "cityName": "New Delhi",
        "countryCode": "IN",
        "lines": ["2 Sardar Patel Marg"]
      },
      "amenities": ["WIFI", "PARKING", "POOL", "SPA"],
      "offer": {
        "checkInDate": "2024-03-15",
        "checkOutDate": "2024-03-18",
        "room": "Deluxe Room",
        "guests": {
          "adults": 2
        },
        "boardType": "ROOM_ONLY",
        "price": 180.50,
        "currency": "USD",
        "policies": {
          "cancellation": "Free cancellation until 24 hours before check-in"
        }
      }
    }
  ]
}
```

### 🏖️ Weekend Getaways Endpoints

#### **GET** `/api/v1/weekend-getaways/search`
Search for weekend getaways near a city.

**Query Parameters:**
- `city` (required): City name (e.g., "Mumbai", "Delhi")
- `radius` (optional): Search radius in km (default: 300)
- `limit` (optional): Number of results (default: 10)
- `weekendType` (optional): Type of getaway (default: "hill stations")

**Available Weekend Types:**
- `hill stations` - Mountain destinations
- `beach destinations` - Coastal getaways
- `historical places` - Heritage sites
- `adventure spots` - Outdoor activities
- `religious places` - Sacred destinations
- `wildlife sanctuaries` - Nature reserves

**Example:**
```bash
GET /api/v1/weekend-getaways/search?city=Mumbai&radius=300&weekendType=hill stations&limit=5
```

**Response:**
```json
{
  "searchParams": {
    "city": "Mumbai",
    "cityCoordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777,
      "displayName": "Mumbai, Maharashtra, India",
      "country": "India"
    },
    "radius": 300,
    "weekendType": "hill stations",
    "limit": 5
  },
  "weather": {
    "temperature": 28.5,
    "description": "clear sky",
    "humidity": 65,
    "windSpeed": 3.2
  },
  "results": {
    "count": 4,
    "destinations": [
      {
        "id": "place_123",
        "name": "Matheran Hill Station",
        "description": "Matheran is a hill station and a municipal council...",
        "weekendType": "hill stations",
        "source": "opentripmap",
        "region": "Maharashtra",
        "highlights": ["Hill Station", "Scenic Views", "Toy Train"],
        "budget": "₹2000-8000 per day",
        "idealFor": ["Weekend Travelers", "Tourists", "Explorers"],
        "bestMonths": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        "thingsToDo": ["Toy Train Ride", "Scenic Views", "Nature Walks", "Photography"],
        "travelTime": "4-8 hours from major cities",
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        "distanceFromCity": "85 km",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Matheran",
        "coordinates": {
          "latitude": 18.9878,
          "longitude": 73.2658
        }
      }
    ]
  }
}
```

#### **GET** `/api/v1/weekend-getaways/types`
Get all available weekend getaway types.

**Response:**
```json
{
  "count": 6,
  "weekendTypes": [
    {
      "name": "hill stations",
      "displayName": "Hill stations",
      "keywords": ["hill station", "mountain", "resort", "scenic"],
      "description": "Mountain destinations perfect for weekend getaways with scenic views and cool climate"
    }
  ]
}
```

#### **GET** `/api/v1/weekend-getaways/destinations/:weekendType`
Get destinations for a specific weekend type.

**Example:**
```bash
GET /api/v1/weekend-getaways/destinations/hill stations?limit=8
```

### 🎯 Travel Categories Endpoints

#### **GET** `/api/v1/travel-categories/search`
Search destinations by travel category.

**Query Parameters:**
- `category` (required): Travel category
- `city` (optional): City name for location-based search
- `radius` (optional): Search radius in km (default: 500)
- `limit` (optional): Number of results

**Available Categories:**
- `beach escape` - Beach destinations
- `mountain treks` - Mountain trekking
- `city breaks` - Urban destinations
- `food and culture` - Cultural experiences
- `adventure trips` - Adventure activities

**Example:**
```bash
GET /api/v1/travel-categories/search?category=beach escape&city=Mumbai&radius=500&limit=5
```

**Response:**
```json
{
  "searchParams": {
    "category": "beach escape",
    "city": "Mumbai",
    "cityCoordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777,
      "displayName": "Mumbai, Maharashtra, India",
      "country": "India"
    },
    "radius": 500,
    "limit": 5
  },
  "weather": {
    "temperature": 28.5,
    "description": "clear sky",
    "humidity": 65
  },
  "results": {
    "count": 3,
    "destinations": [
      {
        "id": "place_456",
        "name": "Juhu Beach",
        "description": "Juhu Beach is one of the most popular beaches in Mumbai...",
        "category": "beach escape",
        "source": "foursquare",
        "region": "Mumbai",
        "highlights": ["Beach", "Entertainment", "Food"],
        "budget": "₹2000-8000 per day",
        "idealFor": ["Travelers", "Tourists", "Explorers"],
        "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
        "distanceFromCity": "15 km",
        "coordinates": {
          "latitude": 19.1077,
          "longitude": 72.8262
        }
      }
    ]
  }
}
```

#### **GET** `/api/v1/travel-categories/categories`
Get all available travel categories.

#### **GET** `/api/v1/travel-categories/destinations/:category`
Get destinations for a specific category.

### 🌍 Continents Endpoints

#### **GET** `/api/v1/continents/search`
Search countries and cities by continent.

**Query Parameters:**
- `continent` (required): Continent name
- `limit` (optional): Number of results (default: 10)
- `includeWeather` (optional): Include weather data (default: false)

**Available Continents:**
- `europe` - European countries and cities
- `asia` - Asian countries and cities
- `middle east` - Middle Eastern countries and cities
- `africa` - African countries and cities
- `oceania` - Oceanian countries and cities

**Example:**
```bash
GET /api/v1/continents/search?continent=europe&limit=5&includeWeather=true
```

**Response:**
```json
{
  "searchParams": {
    "continent": "europe",
    "limit": 5,
    "includeWeather": true
  },
  "continentInfo": {
    "name": "europe",
    "regions": ["Western Europe", "Eastern Europe", "Northern Europe", "Southern Europe"],
    "wikipediaDescription": "Europe is a continent located entirely in the Northern Hemisphere...",
    "wikipediaUrl": "https://en.wikipedia.org/wiki/Europe"
  },
  "results": {
    "countries": {
      "count": 5,
      "data": [
        {
          "name": "France",
          "officialName": "French Republic",
          "capital": "Paris",
          "region": "Europe",
          "subregion": "Western Europe",
          "population": 67391582,
          "area": 551695,
          "currency": "Euro",
          "language": "French",
          "flag": "https://flagcdn.com/w320/fr.png"
        }
      ]
    },
    "cities": {
      "count": 5,
      "data": [
        {
          "name": "Paris",
          "fullName": "Paris, Île-de-France, France",
          "country": "France",
          "state": "Île-de-France",
          "type": "city",
          "coordinates": {
            "latitude": 48.8566,
            "longitude": 2.3522
          },
          "weather": {
            "temperature": 15.2,
            "description": "light rain",
            "humidity": 78,
            "windSpeed": 3.2
          }
        }
      ]
    }
  }
}
```

#### **GET** `/api/v1/continents/continents`
Get all available continents.

#### **GET** `/api/v1/continents/countries/:continent`
Get countries for a specific continent.

#### **GET** `/api/v1/continents/cities/:continent`
Get cities for a specific continent.

### 📍 Location Endpoints

#### **GET** `/api/v1/location/find`
Get current location based on IP address.

**Response:**
```json
{
  "ip": "103.21.220.50",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "area": "New Delhi, Delhi, India",
  "source": "ip-api"
}
```

## 🔐 Authentication

The API uses JWT-based authentication with secure HTTP-only cookies.

### **How to Authenticate:**

1. **Register/Login** to get a JWT token stored in cookies
2. **Include the cookie** in subsequent requests
3. **Protected routes** will automatically validate the token

### **Example with curl:**
```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","mobile":"+1234567890","password":"password123"}'

# Login (sets cookie automatically)
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' \
  -c cookies.txt

# Use protected route
curl -X GET http://localhost:8080/api/v1/protected \
  -b cookies.txt
```

## ⚡ Rate Limiting

The API implements rate limiting to prevent abuse:
- **Default**: 100 requests per 15 minutes
- **Configurable** via environment variables
- **Headers**: Rate limit info included in response headers

## 🛡️ Error Handling

The API provides comprehensive error handling:

### **Error Response Format:**
```json
{
  "status": "error",
  "message": "Error description",
  "code": 400
}
```

### **Common Error Codes:**
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (invalid endpoint)
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 🧪 Testing

### **Start the server:**
```bash
npm run dev
```

### **Test endpoints:**
```bash
# Health check
curl http://localhost:8080/api/v1

# Test weekend getaways
curl "http://localhost:8080/api/v1/weekend-getaways/search?city=Delhi&radius=300&limit=3"

# Test continents
curl "http://localhost:8080/api/v1/continents/search?continent=asia&limit=3"

# Test travel categories
curl "http://localhost:8080/api/v1/travel-categories/search?category=beach escape&city=Mumbai&limit=3"
```

## 📝 API Documentation

### **Base URL:**
```
http://localhost:8080/api/v1
```

### **Response Format:**
All responses are in JSON format with consistent structure.

### **Pagination:**
Use `limit` parameter to control number of results returned.

### **Filtering:**
Most endpoints support filtering by:
- Location (city, radius)
- Category/Type
- Date ranges
- Price ranges

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error messages for troubleshooting

---

**Happy Traveling! 🌍✈️🏖️**
