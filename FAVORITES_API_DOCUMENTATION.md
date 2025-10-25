# Favorites API Documentation

## Overview
The Favorites API allows users to save, manage, and retrieve their favorite travel items (products, attractions, destinations) from search results. All endpoints require authentication.

## Base URL
```
http://localhost:8080/api/v1/favorites
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Add Item to Favorites
**POST** `/api/v1/favorites`

Adds a new item to the user's favorites list.

**Request Body:**
```json
{
  "id": "125057P4",
  "name": "Capital City, Churches & Forts Of Goa",
  "type": "product",
  "destinationName": "Goa",
  "price": "8998.19",
  "currency": "INR",
  "rating": 4.9,
  "reviewCount": 15,
  "duration": "6-8 hours",
  "location": "Goa, India",
  "description": "A view of the breath taking Forts of Goa...",
  "productUrl": "https://www.viator.com/tours/Goa/...",
  "images": ["https://media-cdn.tripadvisor.com/..."]
}
```

**Required Fields:**
- `id` (string): Unique identifier for the item
- `type` (string): Type of item ("product", "attraction", "destination")

**Optional Fields:**
- `name`: Item name
- `destinationName`: Destination name
- `price`: Price as string
- `currency`: Currency code (default: "INR")
- `rating`: Rating number
- `reviewCount`: Number of reviews
- `duration`: Duration description
- `location`: Location string
- `description`: Item description
- `productUrl`: URL to the item
- `images`: Array of image URLs

**Response:**
```json
{
  "success": true,
  "message": "Item added to favorites successfully",
  "data": {
    "favoriteId": "125057P4",
    "type": "product",
    "totalFavorites": 1
  }
}
```

### 2. Get User's Favorites
**GET** `/api/v1/favorites`

Retrieves the user's favorites with optional filtering and pagination.

**Query Parameters:**
- `type` (optional): Filter by type ("product", "attraction", "destination")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example:**
```
GET /api/v1/favorites?type=product&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "message": "Favorites retrieved successfully",
  "data": {
    "favorites": [
      {
        "id": "125057P4",
        "name": "Capital City, Churches & Forts Of Goa",
        "type": "product",
        "destinationName": "Goa",
        "price": "8998.19",
        "currency": "INR",
        "rating": 4.9,
        "reviewCount": 15,
        "duration": "6-8 hours",
        "location": "Goa, India",
        "description": "A view of the breath taking Forts of Goa...",
        "productUrl": "https://www.viator.com/tours/Goa/...",
        "images": ["https://media-cdn.tripadvisor.com/..."]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "limit": 20,
      "totalResults": 1,
      "totalPages": 1,
      "breakdown": {
        "total": 1,
        "products": 1,
        "attractions": 0,
        "destinations": 0
      }
    }
  }
}
```

### 3. Check if Item is Favorite
**GET** `/api/v1/favorites/check/:id/:type`

Checks if a specific item is in the user's favorites.

**Parameters:**
- `id`: Item ID
- `type`: Item type ("product", "attraction", "destination")

**Example:**
```
GET /api/v1/favorites/check/125057P4/product
```

**Response:**
```json
{
  "success": true,
  "isFavorite": true,
  "message": "Item is in favorites"
}
```

### 4. Remove Item from Favorites
**DELETE** `/api/v1/favorites/:id/:type`

Removes a specific item from the user's favorites.

**Parameters:**
- `id`: Item ID
- `type`: Item type ("product", "attraction", "destination")

**Example:**
```
DELETE /api/v1/favorites/125057P4/product
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from favorites successfully",
  "data": {
    "removedItemId": "125057P4",
    "type": "product",
    "remainingFavorites": 0
  }
}
```

### 5. Clear All Favorites
**DELETE** `/api/v1/favorites/clear`

Removes all items from the user's favorites.

**Response:**
```json
{
  "success": true,
  "message": "All favorites cleared successfully",
  "data": {
    "clearedCount": 5
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Item ID and type are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Item not found in favorites"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error while adding to favorites",
  "error": "Detailed error message in development"
}
```

## Frontend Integration Examples

### React/JavaScript Example

```javascript
// Add to favorites
async function addToFavorites(item) {
  try {
    const response = await fetch('/api/v1/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken
      },
      body: JSON.stringify({
        id: item.productCode || item.id,
        name: item.title || item.name,
        type: 'product',
        destinationName: item.destinationName,
        price: item.pricing?.summary?.fromPrice,
        currency: item.pricing?.summary?.currency || 'INR',
        rating: item.reviews?.combinedAverageRating,
        reviewCount: item.reviews?.totalReviews,
        duration: formatDuration(item.duration),
        location: item.destinationName,
        description: item.description,
        productUrl: item.productUrl,
        images: item.images?.map(img => img.variants?.[0]?.url).filter(Boolean) || []
      })
    });
    
    const result = await response.json();
    if (result.success) {
      updateFavoriteButton(item.id, true);
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}

// Remove from favorites
async function removeFromFavorites(id, type) {
  try {
    const response = await fetch(`/api/v1/favorites/${id}/${type}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + userToken
      }
    });
    
    const result = await response.json();
    if (result.success) {
      updateFavoriteButton(id, false);
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

// Get user's favorites
async function getUserFavorites(type = null) {
  try {
    const url = type ? `/api/v1/favorites?type=${type}` : '/api/v1/favorites';
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + userToken
      }
    });
    
    const result = await response.json();
    return result.data.favorites;
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

// Toggle favorite status
async function toggleFavorite(item) {
  const isFavorite = await checkIfFavorite(item.id, item.type);
  
  if (isFavorite) {
    await removeFromFavorites(item.id, item.type);
  } else {
    await addToFavorites(item);
  }
}
```

### cURL Examples

```bash
# Add to favorites
curl -X POST http://localhost:8080/api/v1/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "id": "125057P4",
    "name": "Capital City, Churches & Forts Of Goa",
    "type": "product",
    "destinationName": "Goa",
    "price": "8998.19",
    "currency": "INR"
  }'

# Get favorites
curl -X GET http://localhost:8080/api/v1/favorites \
  -H "Authorization: Bearer your-jwt-token"

# Remove from favorites
curl -X DELETE http://localhost:8080/api/v1/favorites/125057P4/product \
  -H "Authorization: Bearer your-jwt-token"
```

## Data Model

The favorites are stored in MongoDB with the following structure:

```javascript
{
  userId: ObjectId, // Reference to User model
  favorites: [
    {
      id: String, // Required
      name: String,
      type: String, // Required: "product", "attraction", "destination"
      destinationName: String,
      price: String,
      currency: String,
      rating: Number,
      reviewCount: Number,
      duration: String,
      location: String,
      description: String,
      productUrl: String,
      images: [String]
    }
  ]
}
```

## Notes

1. **Authentication Required**: All endpoints require a valid JWT token
2. **Duplicate Prevention**: The API prevents adding duplicate items (same ID and type)
3. **Pagination**: The get favorites endpoint supports pagination
4. **Filtering**: You can filter favorites by type (product, attraction, destination)
5. **Data Persistence**: Favorites are stored per user and persist across sessions
6. **Error Handling**: Comprehensive error handling with descriptive messages
7. **Validation**: Input validation for required fields and data types
