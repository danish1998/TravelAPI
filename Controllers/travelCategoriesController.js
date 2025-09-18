const fetch = require("node-fetch");

// Free APIs for travel data
const FREE_APIS = {
    // OpenStreetMap Nominatim (Free geocoding)
    GEOCODING: "https://nominatim.openstreetmap.org/search",
    
    // Foursquare API (Free tier with 1000 requests/day)
    FOURSQUARE: "https://api.foursquare.com/v3/places/search",
    
    // OpenTripMap API (Free with 1000 requests/day)
    OPENTRIPMAP: "https://api.opentripmap.com/0.1/en/places",
    
    // REST Countries API (Free)
    COUNTRIES: "https://restcountries.com/v3.1",
    
    // Weather API (Free tier)
    WEATHER: "https://api.openweathermap.org/data/2.5/weather"
};

// Travel category mappings for API searches
const CATEGORY_MAPPINGS = {
    "beach escape": {
        keywords: ["beach", "coastal", "seaside", "ocean", "shore"],
        foursquareTypes: ["beach", "coastal_area"],
        opentripmapTypes: ["beach", "coast"]
    },
    "mountain treks": {
        keywords: ["mountain", "trek", "hiking", "peak", "summit"],
        foursquareTypes: ["mountain", "hiking_area", "trail"],
        opentripmapTypes: ["mountain", "peak", "trail"]
    },
    "city breaks": {
        keywords: ["city", "urban", "metropolitan", "downtown"],
        foursquareTypes: ["city", "neighborhood", "downtown"],
        opentripmapTypes: ["city", "urban"]
    },
    "food and culture": {
        keywords: ["restaurant", "food", "culture", "museum", "heritage"],
        foursquareTypes: ["restaurant", "museum", "cultural_center"],
        opentripmapTypes: ["restaurant", "museum", "cultural"]
    },
    "adventure trips": {
        keywords: ["adventure", "sports", "outdoor", "extreme"],
        foursquareTypes: ["sports_center", "outdoor_recreation"],
        opentripmapTypes: ["sports", "adventure", "outdoor"]
    }
};

// Helper function to get city coordinates using free geocoding API
const getCityCoordinates = async (cityName) => {
    try {
        const response = await fetch(`${FREE_APIS.GEOCODING}?format=json&q=${encodeURIComponent(cityName)}&limit=1&countrycodes=in`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                displayName: data[0].display_name,
                country: data[0].country || "India"
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching city coordinates:', error);
        return null;
    }
};

// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

// Fetch places from OpenTripMap API (Free)
const fetchPlacesFromOpenTripMap = async (lat, lon, category, radius = 50000) => {
    try {
        const categoryMapping = CATEGORY_MAPPINGS[category];
        if (!categoryMapping) return [];

        const places = [];
        
        // Search for different types in the category
        for (const type of categoryMapping.opentripmapTypes) {
            try {
                const response = await fetch(
                    `${FREE_APIS.OPENTRIPMAP}/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${type}&format=json&limit=10`
                );
                const data = await response.json();
                
                if (data && Array.isArray(data)) {
                    places.push(...data.slice(0, 5)); // Limit to 5 per type
                }
            } catch (error) {
                console.error(`Error fetching ${type} places:`, error);
            }
        }
        
        return places;
    } catch (error) {
        console.error('Error fetching places from OpenTripMap:', error);
        return [];
    }
};

// Fetch places from Foursquare API (Free tier)
const fetchPlacesFromFoursquare = async (lat, lon, category, radius = 50000) => {
    try {
        const categoryMapping = CATEGORY_MAPPINGS[category];
        if (!categoryMapping) return [];

        const places = [];
        
        // Search for different types in the category
        for (const type of categoryMapping.foursquareTypes) {
            try {
                const response = await fetch(
                    `${FREE_APIS.FOURSQUARE}?ll=${lat},${lon}&radius=${radius}&categories=${type}&limit=10`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': process.env.FOURSQUARE_API_KEY || 'demo_key'
                        }
                    }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.results && Array.isArray(data.results)) {
                        places.push(...data.results.slice(0, 3)); // Limit to 3 per type
                    }
                }
            } catch (error) {
                console.error(`Error fetching ${type} places from Foursquare:`, error);
            }
        }
        
        return places;
    } catch (error) {
        console.error('Error fetching places from Foursquare:', error);
        return [];
    }
};

// Get weather information for a location
const getWeatherInfo = async (lat, lon) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY || 'demo_key';
        const response = await fetch(
            `${FREE_APIS.WEATHER}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        
        if (response.ok) {
            const data = await response.json();
            return {
                temperature: data.main?.temp,
                description: data.weather?.[0]?.description,
                humidity: data.main?.humidity
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
};

// Format place data from different APIs
const formatPlaceData = (place, source, category) => {
    const baseData = {
        id: place.xid || place.fsq_id || place.id || Math.random().toString(36).substr(2, 9),
        name: place.name || place.title || "Unknown Place",
        category: category,
        source: source,
        latitude: place.point?.lat || place.geocodes?.main?.latitude || place.lat,
        longitude: place.point?.lon || place.geocodes?.main?.longitude || place.lon,
        image: place.preview?.source || place.photos?.[0]?.prefix + "300x200" + place.photos?.[0]?.suffix || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    };

    // Add source-specific data
    if (source === 'opentripmap') {
        return {
            ...baseData,
            description: place.wikipedia_extracts?.text || place.kinds || "Travel destination",
            highlights: place.kinds ? place.kinds.split(',').slice(0, 3) : ["Attraction", "Tourism"],
            region: place.address?.state || place.address?.country || "India",
            budget: "₹2000-8000 per day",
            idealFor: ["Travelers", "Tourists", "Explorers"]
        };
    } else if (source === 'foursquare') {
        return {
            ...baseData,
            description: place.description || place.categories?.[0]?.name || "Travel destination",
            highlights: place.categories?.map(cat => cat.name).slice(0, 3) || ["Attraction", "Tourism"],
            region: place.location?.locality || place.location?.country || "India",
            budget: "₹2000-8000 per day",
            idealFor: ["Travelers", "Tourists", "Explorers"]
        };
    }

    return baseData;
};

// GET /api/v1/travel-categories/search
// Query params: category (required), city (optional), radius (optional, default 500km), limit (optional)
const searchByCategory = async (req, res, next) => {
    try {
        const { category, city, radius = 500, limit } = req.query;

        if (!category) {
            return res.status(400).json({ 
                message: 'Category parameter is required',
                availableCategories: Object.keys(CATEGORY_MAPPINGS),
                example: '/api/v1/travel-categories/search?category=beach escape&city=Mumbai&radius=500'
            });
        }

        const normalizedCategory = category.toLowerCase().replace(/\s+/g, ' ');
        
        if (!CATEGORY_MAPPINGS[normalizedCategory]) {
            return res.status(400).json({ 
                message: 'Invalid category',
                availableCategories: Object.keys(CATEGORY_MAPPINGS),
                provided: category
            });
        }

        let searchLat, searchLon, cityInfo = null;

        // If city is provided, get its coordinates
        if (city) {
            cityInfo = await getCityCoordinates(city);
            if (!cityInfo) {
                return res.status(400).json({ 
                    message: 'Could not find coordinates for the specified city',
                    city: city
                });
            }
            searchLat = cityInfo.latitude;
            searchLon = cityInfo.longitude;
        } else {
            // Default to Delhi coordinates if no city provided
            searchLat = 28.6139;
            searchLon = 77.2090;
            cityInfo = {
                latitude: 28.6139,
                longitude: 77.2090,
                displayName: "Delhi, India",
                country: "India"
            };
        }

        const maxRadius = parseInt(radius);
        if (isNaN(maxRadius) || maxRadius <= 0) {
            return res.status(400).json({ 
                message: 'Radius must be a positive number',
                provided: radius
            });
        }

        // Convert km to meters for API calls
        const radiusInMeters = maxRadius * 1000;

        // Fetch places from multiple free APIs
        const [openTripMapPlaces, foursquarePlaces] = await Promise.all([
            fetchPlacesFromOpenTripMap(searchLat, searchLon, normalizedCategory, radiusInMeters),
            fetchPlacesFromFoursquare(searchLat, searchLon, normalizedCategory, radiusInMeters)
        ]);

        // Format and combine results
        let allPlaces = [
            ...openTripMapPlaces.map(place => formatPlaceData(place, 'opentripmap', normalizedCategory)),
            ...foursquarePlaces.map(place => formatPlaceData(place, 'foursquare', normalizedCategory))
        ];

        // Remove duplicates based on coordinates
        const uniquePlaces = allPlaces.filter((place, index, self) => 
            index === self.findIndex(p => 
                Math.abs(p.latitude - place.latitude) < 0.001 && 
                Math.abs(p.longitude - place.longitude) < 0.001
            )
        );

        // Calculate distances if city is provided
        let destinations = uniquePlaces;
        if (city) {
            destinations = uniquePlaces
                .map(place => {
                    const distance = calculateDistance(
                        cityInfo.latitude,
                        cityInfo.longitude,
                        place.latitude,
                        place.longitude
                    );
                    return {
                        ...place,
                        distanceFromCity: Math.round(distance)
                    };
                })
                .filter(place => place.distanceFromCity <= maxRadius)
                .sort((a, b) => a.distanceFromCity - b.distanceFromCity);
        }

        // Apply limit if specified
        if (limit) {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum) && limitNum > 0) {
                destinations = destinations.slice(0, limitNum);
            }
        }

        // Get weather info for the search location
        const weatherInfo = await getWeatherInfo(searchLat, searchLon);

        // Format response
        const response = {
            searchParams: {
                category: category,
                city: city || "Delhi (default)",
                cityCoordinates: {
                    latitude: cityInfo.latitude,
                    longitude: cityInfo.longitude,
                    displayName: cityInfo.displayName,
                    country: cityInfo.country
                },
                radius: maxRadius,
                limit: limit ? parseInt(limit) : null
            },
            weather: weatherInfo,
            results: {
                count: destinations.length,
                destinations: destinations.map(dest => ({
                    id: dest.id,
                    name: dest.name,
                    description: dest.description,
                    category: dest.category,
                    source: dest.source,
                    region: dest.region,
                    highlights: dest.highlights,
                    budget: dest.budget,
                    idealFor: dest.idealFor,
                    image: dest.image,
                    ...(city && { distanceFromCity: `${dest.distanceFromCity} km` }),
                    coordinates: {
                        latitude: dest.latitude,
                        longitude: dest.longitude
                    }
                }))
            }
        };

        return res.json(response);

    } catch (err) {
        console.error('Error in searchByCategory:', err);
        next(err);
    }
};

// GET /api/v1/travel-categories/categories
// Returns all available categories
const getAllCategories = async (req, res, next) => {
    try {
        const categories = Object.keys(CATEGORY_MAPPINGS).map(category => ({
            name: category,
            displayName: category.charAt(0).toUpperCase() + category.slice(1),
            keywords: CATEGORY_MAPPINGS[category].keywords,
            description: getCategoryDescription(category)
        }));

        return res.json({
            count: categories.length,
            categories: categories
        });

    } catch (err) {
        next(err);
    }
};

// GET /api/v1/travel-categories/destinations/:category
// Returns sample destinations for a specific category (using free APIs)
const getDestinationsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const { limit = 10 } = req.query;

        const normalizedCategory = category.toLowerCase().replace(/\s+/g, ' ');
        
        if (!CATEGORY_MAPPINGS[normalizedCategory]) {
            return res.status(400).json({ 
                message: 'Invalid category',
                availableCategories: Object.keys(CATEGORY_MAPPINGS),
                provided: category
            });
        }

        // Use Delhi as default search location
        const searchLat = 28.6139;
        const searchLon = 77.2090;
        const radiusInMeters = 100000; // 100km radius

        // Fetch places from free APIs
        const [openTripMapPlaces, foursquarePlaces] = await Promise.all([
            fetchPlacesFromOpenTripMap(searchLat, searchLon, normalizedCategory, radiusInMeters),
            fetchPlacesFromFoursquare(searchLat, searchLon, normalizedCategory, radiusInMeters)
        ]);

        // Format and combine results
        let allPlaces = [
            ...openTripMapPlaces.map(place => formatPlaceData(place, 'opentripmap', normalizedCategory)),
            ...foursquarePlaces.map(place => formatPlaceData(place, 'foursquare', normalizedCategory))
        ];

        // Remove duplicates and apply limit
        const uniquePlaces = allPlaces.filter((place, index, self) => 
            index === self.findIndex(p => 
                Math.abs(p.latitude - place.latitude) < 0.001 && 
                Math.abs(p.longitude - place.longitude) < 0.001
            )
        ).slice(0, parseInt(limit));

        return res.json({
            category: category,
            count: uniquePlaces.length,
            destinations: uniquePlaces.map(dest => ({
                id: dest.id,
                name: dest.name,
                description: dest.description,
                category: dest.category,
                source: dest.source,
                region: dest.region,
                highlights: dest.highlights,
                budget: dest.budget,
                idealFor: dest.idealFor,
                image: dest.image,
                coordinates: {
                    latitude: dest.latitude,
                    longitude: dest.longitude
                }
            }))
        });

    } catch (err) {
        next(err);
    }
};

// Helper function to get category descriptions
const getCategoryDescription = (category) => {
    const descriptions = {
        "beach escape": "Relaxing beach destinations with water activities and coastal experiences",
        "mountain treks": "High-altitude trekking destinations with scenic trails and mountain views",
        "city breaks": "Urban destinations perfect for short city getaways and metropolitan experiences",
        "food and culture": "Cultural destinations known for their cuisine, heritage, and local traditions",
        "adventure trips": "Thrilling destinations offering extreme sports and adventure activities"
    };
    return descriptions[category] || "Travel destinations for various experiences";
};

module.exports = { 
    searchByCategory, 
    getAllCategories, 
    getDestinationsByCategory 
};