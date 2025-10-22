# Hotel API Curl Commands

## 🚀 **Server Health Check**

```bash
# Test if server is running
curl -X GET http://localhost:8080/api/v1/health
```

## 🏨 **Hotel Search API**

### **Basic Hotel Search**
```bash
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'
```

### **Hotel Search with Filters**
```bash
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD",
    "priceMax": 200,
    "minRating": 3,
    "maxRating": 5,
    "amenities": "wifi,pool,gym"
  }'
```

### **Hotel Search with City Name**
```bash
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityName": "New Delhi",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'
```

### **Hotel Search with Coordinates**
```bash
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 28.6139,
    "longitude": 77.2090,
    "radius": 10,
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'
```

### **Hotel Search with Sorting**
```bash
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD",
    "sortBy": "price",
    "sortOrder": "asc"
  }'
```

## 🏨 **Hotel Details API**

### **Get Hotel Details**
```bash
curl -X GET "http://localhost:8080/api/v1/hotels/details/12345"
```

### **Get Hotel Details with Dates**
```bash
curl -X GET "http://localhost:8080/api/v1/hotels/details/12345?checkInDate=2024-12-25&checkOutDate=2024-12-27&adults=2&rooms=1&currency=USD"
```

## 🏨 **Hotel Availability API**

### **Check Hotel Availability**
```bash
curl -X GET "http://localhost:8080/api/v1/hotels/availability/12345?checkInDate=2024-12-25&checkOutDate=2024-12-27&adults=2&rooms=1&currency=USD"
```

## 🧪 **Error Testing**

### **Test Invalid Search (Missing Dates)**
```bash
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'
```

### **Test Invalid Hotel ID**
```bash
curl -X GET "http://localhost:8080/api/v1/hotels/details/invalid-id"
```

### **Test Missing Required Fields**
```bash
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27"
  }'
```

## 🔍 **Advanced Testing**

### **Test with Different Cities (City Codes)**
```bash
# New York
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "NYC",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

# London
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "LON",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

# Paris
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "PAR",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'
```

### **Test with Different Cities (City Names)**
```bash
# New York City
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityName": "New York",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

# London
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityName": "London",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

# Paris
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityName": "Paris",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

# Mumbai
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityName": "Mumbai",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

# Tokyo
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityName": "Tokyo",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

# Dubai
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityName": "Dubai",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'
```

### **Test with Different Currencies**
```bash
# USD
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

# EUR
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "EUR"
  }'

# GBP
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "GBP"
  }'
```

### **Test with Different Occupancy**
```bash
# Single adult
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 1,
    "rooms": 1,
    "currency": "USD"
  }'

# Family with children
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

# Multiple rooms
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 4,
    "rooms": 2,
    "currency": "USD"
  }'
```

## 📊 **Response Examples**

### **Successful Hotel Search Response**
```json
{
  "count": 20,
  "hotels": [
    {
      "hotelId": "12345",
      "name": "Sample Hotel",
      "description": "A beautiful hotel in the city center",
      "rating": 4.5,
      "latitude": 28.6139,
      "longitude": 77.2090,
      "address": {
        "street": "123 Main Street",
        "city": "New Delhi",
        "state": "DL",
        "country": "IN",
        "postalCode": "110001"
      },
      "amenities": ["WiFi", "Pool", "Gym", "Restaurant"],
      "amenitiesDetails": {
        "2070": {
          "id": "2070",
          "name": "Dry cleaning/laundry service",
          "categories": ["drycleaning_and_laundry_services"]
        }
      },
      "pricing": {
        "currency": "USD",
        "totalPrice": 150,
        "pricePerNight": 75,
        "taxes": {...},
        "fees": {...}
      },
      "images": [...],
      "reviews": {...},
      "checkInDate": "2024-12-25",
      "checkOutDate": "2024-12-27",
      "rooms": [...],
      "adults": 2,
      "status": "available",
      "availableRooms": 5,
      "links": {...}
    }
  ]
}
```

### **Error Response Example**
```json
{
  "error": "Failed to find properties in the specified location",
  "message": "No hotels found for the given criteria",
  "status": 404
}
```

## 🚀 **Quick Test Script**

```bash
#!/bin/bash

echo "🚀 Testing Hotel API with Curl Commands"
echo "======================================"

# Test server health
echo "🏥 Testing Server Health..."
curl -X GET http://localhost:8080/api/v1/health

echo -e "\n🔍 Testing Hotel Search..."
curl -X POST http://localhost:8080/api/v1/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "cityCode": "DEL",
    "checkInDate": "2024-12-25",
    "checkOutDate": "2024-12-27",
    "adults": 2,
    "rooms": 1,
    "currency": "USD"
  }'

echo -e "\n🏨 Testing Hotel Details..."
curl -X GET "http://localhost:8080/api/v1/hotels/details/12345"

echo -e "\n🏨 Testing Hotel Availability..."
curl -X GET "http://localhost:8080/api/v1/hotels/availability/12345?checkInDate=2024-12-25&checkOutDate=2024-12-27&adults=2&rooms=1&currency=USD"

echo -e "\n✅ All tests completed!"
```

## 📝 **Notes**

- Make sure your server is running on `http://localhost:8080`
- Replace `12345` with actual hotel IDs from your search results
- Adjust dates, cities, and other parameters as needed
- All commands include proper headers and JSON formatting
- Error testing commands are included to verify error handling

## 🔧 **Troubleshooting**

If you get connection errors:
1. Make sure your server is running: `npm start`
2. Check the port number (default is 3000)
3. Verify the API endpoints are correct
4. Check server logs for any errors

If you get 404 errors:
1. This is expected due to API access restrictions
2. The API structure is working correctly
3. Contact Expedia support for API access