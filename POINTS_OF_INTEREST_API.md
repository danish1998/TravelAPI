# Points of Interest API Documentation

This API provides access to Amadeus Points of Interest data, allowing you to search for tourist attractions, restaurants, shopping areas, and other points of interest around the world.

## Base URL
```
http://localhost:8080/api/v1/points-of-interest
```

## Endpoints

### 1. Search Points of Interest by Coordinates
Search for points of interest near a specific latitude and longitude.

**Endpoint:** `GET /search`

**Query Parameters:**
- `latitude` (required): Latitude coordinate (-90 to 90)
- `longitude` (required): Longitude coordinate (-180 to 180)
- `radius` (optional): Search radius in kilometers (1-500, default: 20)
- `category` (optional): Category filter (default: SIGHTS)
  - `SIGHTS` - Tourist attractions and landmarks
  - `NIGHTLIFE` - Bars, clubs, and entertainment venues
  - `RESTAURANT` - Restaurants and dining
  - `SHOPPING` - Shopping centers and markets
  - `CASINO` - Casinos and gaming venues
  - `SPA` - Spas and wellness centers
  - `LIKELY_TO_GO` - Popular destinations
- `page_limit` (optional): Number of results per page (1-20, default: 10)
- `page_offset` (optional): Number of results to skip (0+, default: 0)

**Example Request:**
```bash
GET /api/v1/points-of-interest/search?latitude=40.7589&longitude=-73.9851&radius=5&category=SIGHTS&page_limit=5
```

**Example Response:**
```json
{
  "success": true,
  "message": "Points of interest retrieved successfully",
  "data": [
    {
      "type": "pointOfInterest",
      "id": "Q9304",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/pois/Q9304",
        "methods": ["GET"]
      },
      "name": "Times Square",
      "category": "SIGHTS",
      "tags": ["landmark", "tourist attraction"],
      "geoCode": {
        "latitude": 40.7589,
        "longitude": -73.9851
      },
      "address": {
        "streetNumber": "1",
        "streetName": "Times Square",
        "cityName": "New York",
        "stateCode": "NY",
        "postalCode": "10036",
        "countryCode": "US"
      }
    }
  ],
  "meta": {
    "count": 5,
    "links": {
      "self": "https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=40.7589&longitude=-73.9851&radius=5&category=SIGHTS&page[limit]=5&page[offset]=0"
    }
  }
}
```

### 2. Search Points of Interest by Square
Search for points of interest within a rectangular area defined by north, south, east, and west coordinates.

**Endpoint:** `GET /search-by-square`

**Query Parameters:**
- `north` (required): Northern boundary latitude (-90 to 90)
- `west` (required): Western boundary longitude (-180 to 180)
- `south` (required): Southern boundary latitude (-90 to 90)
- `east` (required): Eastern boundary longitude (-180 to 180)
- `category` (optional): Category filter (same as above)
- `page_limit` (optional): Number of results per page (1-20, default: 10)
- `page_offset` (optional): Number of results to skip (0+, default: 0)

**Example Request:**
```bash
GET /api/v1/points-of-interest/search-by-square?north=40.7851&west=-73.9730&south=40.7648&east=-73.9585&category=RESTAURANT&page_limit=3
```

### 3. Get Point of Interest by ID
Retrieve detailed information about a specific point of interest using its ID.

**Endpoint:** `GET /:poiId`

**Path Parameters:**
- `poiId` (required): The unique identifier of the point of interest

**Example Request:**
```bash
GET /api/v1/points-of-interest/Q9304
```

**Example Response:**
```json
{
  "success": true,
  "message": "Point of interest retrieved successfully",
  "data": {
    "type": "pointOfInterest",
    "id": "Q9304",
    "self": {
      "href": "https://test.api.amadeus.com/v1/reference-data/locations/pois/Q9304",
      "methods": ["GET"]
    },
    "name": "Times Square",
    "category": "SIGHTS",
    "tags": ["landmark", "tourist attraction"],
    "geoCode": {
      "latitude": 40.7589,
      "longitude": -73.9851
    },
    "address": {
      "streetNumber": "1",
      "streetName": "Times Square",
      "cityName": "New York",
      "stateCode": "NY",
      "postalCode": "10036",
      "countryCode": "US"
    },
    "contact": {
      "phone": "+1 212-768-1560",
      "website": "https://www.timessquarenyc.org"
    },
    "openingHours": {
      "monday": "24 hours",
      "tuesday": "24 hours",
      "wednesday": "24 hours",
      "thursday": "24 hours",
      "friday": "24 hours",
      "saturday": "24 hours",
      "sunday": "24 hours"
    }
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "code": "ERROR_CODE",
      "detail": "Detailed error message"
    }
  ]
}
```

### Common Error Codes:
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API credentials)
- `404` - Not Found (POI not found)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Usage Examples

### JavaScript/Node.js
```javascript
const fetch = require('node-fetch');

// Search for restaurants near Times Square
async function searchRestaurants() {
  const params = new URLSearchParams({
    latitude: '40.7589',
    longitude: '-73.9851',
    radius: '2',
    category: 'RESTAURANT',
    page_limit: '10'
  });

  const response = await fetch(`http://localhost:8080/api/v1/points-of-interest/search?${params}`);
  const data = await response.json();
  
  console.log(data);
}
```

### cURL
```bash
# Search for sights in Paris
curl "http://localhost:8080/api/v1/points-of-interest/search?latitude=48.8566&longitude=2.3522&radius=10&category=SIGHTS&page_limit=5"

# Search by square area in London
curl "http://localhost:8080/api/v1/points-of-interest/search-by-square?north=51.5074&west=-0.1278&south=51.5074&east=-0.1278&category=SHOPPING"

# Get specific POI details
curl "http://localhost:8080/api/v1/points-of-interest/Q9304"
```

## Testing

Run the test file to verify the API functionality:

```bash
node test-points-of-interest.js
```

## Rate Limits

The API respects Amadeus rate limits. By default, the server is configured with:
- 1000 requests per 15 minutes (configurable via environment variables)

## Environment Variables

Make sure the following environment variables are set:
- `AMADEUS_CLIENT_ID` - Your Amadeus API client ID
- `AMADEUS_CLIENT_SECRET` - Your Amadeus API client secret

## Notes

- All coordinates should be in decimal degrees format
- The API uses Amadeus test environment by default
- Results are paginated with a maximum of 20 items per page
- Some POI details may not be available for all locations
- The API supports both test and production Amadeus environments
