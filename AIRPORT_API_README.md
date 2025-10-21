# Airport Search API

A simple REST API for searching airports by name, IATA code, city, or country from a MongoDB database.

## 🚀 Quick Start

### 1. Check Your Database

The API uses airport data from your existing MongoDB database. Check if you have airport data:

```bash
node seedAirports.js
```

This will:
- Connect to your MongoDB database
- Check if airport data already exists
- Show you sample data if found
- Tell you if you need to add data

### 2. Import Data (if needed)

If you don't have airport data yet, you can import from the JSON file:

```bash
node seedAirports.js --import
```

This will:
- Read the airport data from `helpers/Airport.json`
- Insert all airports into the `airports` collection
- Create optimized indexes for fast searching

### 3. Start the Server

```bash
npm run dev
```

### 4. Test the API

```bash
node test-airports-api.js
```

## 📋 API Endpoint

### Base URL
```
http://localhost:8080/api/v1/airports
```

### Search Airports
```
GET /airports/search?q={search_term}&limit={limit}&page={page}&priority_country={country_code}
```

**Query Parameters:**
- `q` (required): Search query - can be airport name, IATA code, city, country name, or country code
- `limit` (optional): Results per page (default: 20)
- `page` (optional): Page number (default: 1)
- `priority_country` (optional): ISO country code to prioritize in results (e.g., "IN" for India)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  },
  "searchTerm": "JFK",
  "priorityCountry": "IN"
}
```

**Examples:**
```bash
# Search by airport name
GET /airports/search?q=Kennedy

# Search by IATA code
GET /airports/search?q=JFK

# Search by city
GET /airports/search?q=New York

# Search by country code
GET /airports/search?q=US

# Search by country name
GET /airports/search?q=Iraq
GET /airports/search?q=Saudi
GET /airports/search?q=Saudi Arabia
GET /airports/search?q=India
GET /airports/search?q=USA

# Search with pagination
GET /airports/search?q=London&page=1&limit=5

# Search with country priority (India airports first)
GET /airports/search?q=International&priority_country=IN

# Search Delhi airports with India priority
GET /airports/search?q=Delhi&priority_country=IN&limit=10
```

## 📊 Data Structure

Each airport document contains:

```json
{
  "icao": "KJFK",
  "iata": "JFK",
  "name": "John F Kennedy International Airport",
  "city": "New York",
  "state": "New York",
  "country": "US",
  "elevation": 13,
  "lat": 40.63980103,
  "lon": -73.77890015,
  "tz": "America/New_York",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 Search Features

### Text Search
The API supports full-text search across airport names, cities, and countries using MongoDB's text search capabilities.

### Geospatial Search
Find airports near specific coordinates using the `/nearby` endpoint.

### Filtered Search
Combine multiple search criteria for precise results.

### Pagination
All list endpoints support pagination to handle large result sets efficiently.

## 🚀 Performance Optimizations

### Database Indexes
The following indexes are created for optimal performance:
- `icao` (unique)
- `iata`
- Text search on `name`, `city`, `country`
- `city`
- `country`
- `state`

### Search Optimization
- Text search uses MongoDB's built-in text search with scoring
- Geospatial queries use efficient coordinate-based filtering
- Pagination prevents memory issues with large datasets

## 🧪 Testing

Run the test suite to verify all endpoints:

```bash
node test-airports-api.js
```

The test script will:
1. Test pagination
2. Test general search
3. Test IATA/ICAO lookups
4. Test country/city filtering
5. Test nearby airport search
6. Test statistics endpoint

## 📝 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (airport not found)
- `500`: Internal Server Error

## 🔧 Configuration

### Environment Variables
Make sure these are set in your `.env` file:
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)

### Database Schema
The airport collection uses the following schema:
- **icao**: 4-character ICAO code (required, unique)
- **iata**: 3-character IATA code (optional, can be empty)
- **name**: Airport name (required)
- **city**: City name (required)
- **state**: State/province (optional)
- **country**: Country code (required)
- **elevation**: Elevation in feet (optional)
- **lat**: Latitude (required)
- **lon**: Longitude (required)
- **tz**: Timezone (optional)

## 📈 Usage Examples

### Find airports in a specific city:
```bash
curl "http://localhost:8080/api/v1/airports/search?city=Paris&limit=5"
```

### Search for airports with "International" in the name:
```bash
curl "http://localhost:8080/api/v1/airports/search?q=International&limit=10"
```

### Find airports near Tokyo:
```bash
curl "http://localhost:8080/api/v1/airports/nearby?lat=35.6762&lon=139.6503&radius=50"
```

### Get specific airport details:
```bash
curl "http://localhost:8080/api/v1/airports/iata/CDG"
```

This API provides comprehensive airport search capabilities for travel applications, booking systems, and location-based services.
