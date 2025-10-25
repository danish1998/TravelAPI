# Favorites API - Complete cURL Examples
## Integration Guide for Frontend

This guide provides all the cURL commands you need to test and integrate the Favorites API with your frontend.

## 🔐 Authentication Setup

Your API uses **cookie-based authentication**. You need to login first to get the authentication cookie.

### Step 1: Login to Get Authentication Cookie

```bash
# Login to get authentication cookie
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id_here",
    "email": "your-email@example.com"
  }
}
```

**Note:** The `-c cookies.txt` saves the authentication cookie to a file.

---

## 🎯 Favorites API cURL Commands

### 1. Add Item to Favorites

```bash
# Add a product to favorites
curl -X POST http://localhost:8080/api/v1/favorites \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": "125057P4",
    "name": "Capital City, Churches & Forts Of Goa, Old Goa Churches, Panaji City.",
    "type": "product",
    "destinationName": "Goa",
    "price": "8998.19",
    "currency": "INR",
    "rating": 4.9,
    "reviewCount": 15,
    "duration": "6-8 hours",
    "location": "Goa, India",
    "description": "A view of the breath taking Forts of Goa and the magnificent churches of Old Goa. Enjoy a tour of the marvelous Panjim City.",
    "productUrl": "https://www.viator.com/tours/Goa/CAPITAL-CITY-CHURCHES-and-FORTS-OF-GOA-OLD-GOA-CHURCHES-PANAJI-CITY/d4594-125057P4",
    "images": [
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-100x100/07/69/3e/4c.jpg",
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-200x200/07/69/3e/4c.jpg"
    ]
  }'
```

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

### 2. Add Attraction to Favorites

```bash
# Add an attraction to favorites
curl -X POST http://localhost:8080/api/v1/favorites \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": "6824",
    "name": "Old Goa (Goa Velha)",
    "type": "attraction",
    "destinationName": "Goa",
    "rating": 4.6,
    "reviewCount": 106,
    "location": "Goa, India",
    "description": "Historic site with beautiful churches",
    "productUrl": "https://www.viator.com/x-attractions/y/d0-a6824",
    "images": [
      "https://dynamic-media-cdn.tripadvisor.com/media/attractions-content--1x-1/0b/27/71/8d.jpg"
    ]
  }'
```

### 3. Add Destination to Favorites

```bash
# Add a destination to favorites
curl -X POST http://localhost:8080/api/v1/favorites \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": "4594",
    "name": "Goa",
    "type": "destination",
    "destinationName": "Goa",
    "location": "India",
    "description": "Beautiful beach destination in India"
  }'
```

### 4. Get All Favorites

```bash
# Get all user favorites
curl -X GET http://localhost:8080/api/v1/favorites \
  -b cookies.txt
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

### 5. Get Favorites with Pagination

```bash
# Get favorites with pagination
curl -X GET "http://localhost:8080/api/v1/favorites?page=1&limit=10" \
  -b cookies.txt
```

### 6. Get Favorites by Type

```bash
# Get only product favorites
curl -X GET "http://localhost:8080/api/v1/favorites?type=product" \
  -b cookies.txt

# Get only attraction favorites
curl -X GET "http://localhost:8080/api/v1/favorites?type=attraction" \
  -b cookies.txt

# Get only destination favorites
curl -X GET "http://localhost:8080/api/v1/favorites?type=destination" \
  -b cookies.txt
```

### 7. Check if Item is Favorite

```bash
# Check if a product is in favorites
curl -X GET http://localhost:8080/api/v1/favorites/check/125057P4/product \
  -b cookies.txt

# Check if an attraction is in favorites
curl -X GET http://localhost:8080/api/v1/favorites/check/6824/attraction \
  -b cookies.txt
```

**Response:**
```json
{
  "success": true,
  "isFavorite": true,
  "message": "Item is in favorites"
}
```

### 8. Remove Item from Favorites

```bash
# Remove a product from favorites
curl -X DELETE http://localhost:8080/api/v1/favorites/125057P4/product \
  -b cookies.txt

# Remove an attraction from favorites
curl -X DELETE http://localhost:8080/api/v1/favorites/6824/attraction \
  -b cookies.txt
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

### 9. Clear All Favorites

```bash
# Remove all favorites
curl -X DELETE http://localhost:8080/api/v1/favorites/clear \
  -b cookies.txt
```

**Response:**
```json
{
  "success": true,
  "message": "All favorites cleared successfully",
  "data": {
    "clearedCount": 3
  }
}
```

---

## 🌐 Frontend Integration Examples

### JavaScript/Fetch API Examples

```javascript
// 1. Add to Favorites
async function addToFavorites(item) {
  try {
    const response = await fetch('/api/v1/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Important: includes cookies
      body: JSON.stringify({
        id: item.productCode || item.id,
        name: item.title || item.name,
        type: 'product', // or 'attraction', 'destination'
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
      console.log('Added to favorites:', result);
      // Update UI
      updateFavoriteButton(item.id, true);
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}

// 2. Get Favorites
async function getFavorites(type = null) {
  try {
    const url = type ? `/api/v1/favorites?type=${type}` : '/api/v1/favorites';
    const response = await fetch(url, {
      credentials: 'include' // Important: includes cookies
    });
    
    const result = await response.json();
    if (result.success) {
      return result.data.favorites;
    }
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

// 3. Remove from Favorites
async function removeFromFavorites(id, type) {
  try {
    const response = await fetch(`/api/v1/favorites/${id}/${type}`, {
      method: 'DELETE',
      credentials: 'include' // Important: includes cookies
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Removed from favorites:', result);
      // Update UI
      updateFavoriteButton(id, false);
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

// 4. Check if Favorite
async function checkIfFavorite(id, type) {
  try {
    const response = await fetch(`/api/v1/favorites/check/${id}/${type}`, {
      credentials: 'include' // Important: includes cookies
    });
    
    const result = await response.json();
    return result.isFavorite;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

// 5. Toggle Favorite (Add/Remove)
async function toggleFavorite(item) {
  const isFavorite = await checkIfFavorite(item.id, item.type);
  
  if (isFavorite) {
    await removeFromFavorites(item.id, item.type);
  } else {
    await addToFavorites(item);
  }
}
```

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [item.id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/v1/favorites/check/${item.id}/${item.type}`, {
        credentials: 'include'
      });
      const result = await response.json();
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        await fetch(`/api/v1/favorites/${item.id}/${item.type}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        setIsFavorite(false);
      } else {
        // Add to favorites
        await fetch('/api/v1/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            id: item.id,
            name: item.name,
            type: item.type,
            destinationName: item.destinationName,
            price: item.price,
            currency: item.currency,
            rating: item.rating,
            reviewCount: item.reviewCount,
            duration: item.duration,
            location: item.location,
            description: item.description,
            productUrl: item.productUrl,
            images: item.images
          })
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleFavorite} 
      disabled={loading}
      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
    >
      {loading ? '...' : isFavorite ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteButton;
```

---

## 🔧 Testing Commands

### Test All Endpoints

```bash
# 1. Login first
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "test@example.com", "password": "password"}'

# 2. Add to favorites
curl -X POST http://localhost:8080/api/v1/favorites \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"id": "test123", "name": "Test Item", "type": "product"}'

# 3. Get favorites
curl -X GET http://localhost:8080/api/v1/favorites -b cookies.txt

# 4. Check favorite
curl -X GET http://localhost:8080/api/v1/favorites/check/test123/product -b cookies.txt

# 5. Remove favorite
curl -X DELETE http://localhost:8080/api/v1/favorites/test123/product -b cookies.txt

# 6. Clear all
curl -X DELETE http://localhost:8080/api/v1/favorites/clear -b cookies.txt
```

---

## 📝 Important Notes

1. **Authentication**: Always include `credentials: 'include'` in fetch requests
2. **Cookies**: Use `-b cookies.txt` in cURL commands
3. **Content-Type**: Always set `Content-Type: application/json` for POST requests
4. **Error Handling**: Always check response status and handle errors
5. **UI Updates**: Update your UI after successful API calls

This should give you everything you need to integrate the Favorites API with your frontend! 🚀
