const fetch = require("node-fetch");

// Free APIs for weekend getaways data
const FREE_APIS = {
    // OpenStreetMap Nominatim (Free geocoding)
    GEOCODING: "https://nominatim.openstreetmap.org/search",
    
    // OpenTripMap API (Free)
    OPENTRIPMAP: "https://api.opentripmap.com/0.1/en/places",
    
    // Foursquare API (Free tier with 1000 requests/day)
    FOURSQUARE: "https://api.foursquare.com/v3/places/search",
    
    // Wikipedia API (Free)
    WIKIPEDIA: "https://en.wikipedia.org/api/rest_v1/page/summary",
    
    // Weather API (Free tier)
    WEATHER: "https://api.openweathermap.org/data/2.5/weather"
};

// Weekend getaway types and their corresponding search terms
const WEEKEND_TYPES = {
    "hill stations": {
        keywords: ["hill station", "mountain", "resort", "scenic"],
        foursquareTypes: ["mountain", "resort", "scenic_area"],
        opentripmapTypes: ["mountain", "peak", "resort"]
    },
    "beach destinations": {
        keywords: ["beach", "coastal", "seaside", "ocean"],
        foursquareTypes: ["beach", "coastal_area"],
        opentripmapTypes: ["beach", "coast"]
    },
    "historical places": {
        keywords: ["historical", "heritage", "monument", "fort", "palace"],
        foursquareTypes: ["historical_site", "monument", "museum"],
        opentripmapTypes: ["historic", "monument", "castle", "palace"]
    },
    "adventure spots": {
        keywords: ["adventure", "trekking", "rafting", "camping"],
        foursquareTypes: ["outdoor_recreation", "sports_center"],
        opentripmapTypes: ["adventure", "sports", "outdoor"]
    },
    "religious places": {
        keywords: ["temple", "church", "mosque", "gurudwara", "religious"],
        foursquareTypes: ["religious_site", "temple", "church"],
        opentripmapTypes: ["religious", "temple", "church", "mosque"]
    },
    "wildlife sanctuaries": {
        keywords: ["wildlife", "sanctuary", "national park", "nature"],
        foursquareTypes: ["wildlife_sanctuary", "national_park"],
        opentripmapTypes: ["wildlife", "nature", "park"]
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
const fetchPlacesFromOpenTripMap = async (lat, lon, weekendType, radius = 50000) => {
    try {
        const typeMapping = WEEKEND_TYPES[weekendType];
        if (!typeMapping) return [];

        const places = [];
        
        // Search for different types in the weekend category
        for (const type of typeMapping.opentripmapTypes) {
            try {
                const response = await fetch(
                    `${FREE_APIS.OPENTRIPMAP}/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${type}&format=json&limit=8`
                );
                const data = await response.json();
                
                if (data && Array.isArray(data)) {
                    places.push(...data.slice(0, 4)); // Limit to 4 per type
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
const fetchPlacesFromFoursquare = async (lat, lon, weekendType, radius = 50000) => {
    try {
        const typeMapping = WEEKEND_TYPES[weekendType];
        if (!typeMapping) return [];

        const places = [];
        
        // Search for different types in the weekend category
        for (const type of typeMapping.foursquareTypes) {
            try {
                const response = await fetch(
                    `${FREE_APIS.FOURSQUARE}?ll=${lat},${lon}&radius=${radius}&categories=${type}&limit=8`,
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

// Get Wikipedia description for a place
const getWikipediaDescription = async (placeName) => {
    try {
        const response = await fetch(`${FREE_APIS.WIKIPEDIA}/${encodeURIComponent(placeName)}`);
        const data = await response.json();
        
        if (data && data.extract) {
            return {
                description: data.extract.substring(0, 200) + "...", // Truncate for brevity
                summary: data.description,
                url: data.content_urls?.desktop?.page
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching Wikipedia description for ${placeName}:`, error);
        return null;
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
                humidity: data.main?.humidity,
                windSpeed: data.wind?.speed
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
};

// Format place data from different APIs
const formatPlaceData = async (place, source, weekendType) => {
    const baseData = {
        id: place.xid || place.fsq_id || place.id || Math.random().toString(36).substr(2, 9),
        name: place.name || place.title || "Unknown Place",
        weekendType: weekendType,
        source: source,
        latitude: place.point?.lat || place.geocodes?.main?.latitude || place.lat,
        longitude: place.point?.lon || place.geocodes?.main?.longitude || place.lon,
        image: place.preview?.source || place.photos?.[0]?.prefix + "300x200" + place.photos?.[0]?.suffix || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    };

    // Get Wikipedia description
    const wikiInfo = await getWikipediaDescription(baseData.name);

    // Add source-specific data
    if (source === 'opentripmap') {
        return {
            ...baseData,
            description: wikiInfo?.description || place.wikipedia_extracts?.text || place.kinds || "Weekend getaway destination",
            highlights: place.kinds ? place.kinds.split(',').slice(0, 3) : ["Attraction", "Tourism", "Weekend Destination"],
            region: place.address?.state || place.address?.country || "India",
            budget: "₹2000-8000 per day",
            idealFor: ["Weekend Travelers", "Tourists", "Explorers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: place.kinds ? place.kinds.split(',').slice(0, 4) : ["Sightseeing", "Photography", "Relaxation"],
            travelTime: "4-8 hours from major cities",
            wikipediaUrl: wikiInfo?.url
        };
    } else if (source === 'foursquare') {
        return {
            ...baseData,
            description: wikiInfo?.description || place.description || place.categories?.[0]?.name || "Weekend getaway destination",
            highlights: place.categories?.map(cat => cat.name).slice(0, 3) || ["Attraction", "Tourism", "Weekend Destination"],
            region: place.location?.locality || place.location?.country || "India",
            budget: "₹2000-8000 per day",
            idealFor: ["Weekend Travelers", "Tourists", "Explorers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: place.categories?.map(cat => cat.name).slice(0, 4) || ["Sightseeing", "Photography", "Relaxation"],
            travelTime: "4-8 hours from major cities",
            wikipediaUrl: wikiInfo?.url
        };
    }

    return baseData;
};

// GET /api/v1/weekend-getaways/search
// Query params: city (required), radius (optional, default 300km), limit (optional), weekendType (optional)
const searchWeekendGetaways = async (req, res, next) => {
    try {
        const { city, radius = 300, limit, weekendType = "hill stations" } = req.query;

        if (!city) {
            return res.status(400).json({ 
                message: 'City parameter is required',
                availableWeekendTypes: Object.keys(WEEKEND_TYPES),
                example: '/api/v1/weekend-getaways/search?city=Delhi&radius=300&weekendType=hill stations'
            });
        }

        // Get city coordinates
        const cityCoords = await getCityCoordinates(city);
        if (!cityCoords) {
            return res.status(400).json({ 
                message: 'Could not find coordinates for the specified city',
                city: city
            });
        }

        const maxRadius = parseInt(radius);
        if (isNaN(maxRadius) || maxRadius <= 0) {
            return res.status(400).json({ 
                message: 'Radius must be a positive number',
                provided: radius
            });
        }

        // Check if weekend type is valid
        const normalizedWeekendType = weekendType.toLowerCase();
        if (!WEEKEND_TYPES[normalizedWeekendType]) {
            return res.status(400).json({ 
                message: 'Invalid weekend type',
                availableWeekendTypes: Object.keys(WEEKEND_TYPES),
                provided: weekendType
            });
        }

        // Convert km to meters for API calls
        const radiusInMeters = maxRadius * 1000;

        // Fetch places from multiple free APIs
        const [openTripMapPlaces, foursquarePlaces] = await Promise.all([
            fetchPlacesFromOpenTripMap(cityCoords.latitude, cityCoords.longitude, normalizedWeekendType, radiusInMeters),
            fetchPlacesFromFoursquare(cityCoords.latitude, cityCoords.longitude, normalizedWeekendType, radiusInMeters)
        ]);

        // Format and combine results
        let allPlaces = [
            ...(await Promise.all(openTripMapPlaces.map(place => formatPlaceData(place, 'opentripmap', normalizedWeekendType)))),
            ...(await Promise.all(foursquarePlaces.map(place => formatPlaceData(place, 'foursquare', normalizedWeekendType))))
        ];

        // Remove duplicates based on coordinates
        const uniquePlaces = allPlaces.filter((place, index, self) => 
            index === self.findIndex(p => 
                Math.abs(p.latitude - place.latitude) < 0.001 && 
                Math.abs(p.longitude - place.longitude) < 0.001
            )
        );

        // Calculate distances and filter by radius
        let destinations = uniquePlaces
            .map(place => {
                const distance = calculateDistance(
                    cityCoords.latitude,
                    cityCoords.longitude,
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

        // Apply limit if specified
        if (limit) {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum) && limitNum > 0) {
                destinations = destinations.slice(0, limitNum);
            }
        }

        // Get weather info for the search city
        const weatherInfo = await getWeatherInfo(cityCoords.latitude, cityCoords.longitude);

        // Format response
        const response = {
            searchParams: {
                city: city,
                cityCoordinates: {
                    latitude: cityCoords.latitude,
                    longitude: cityCoords.longitude,
                    displayName: cityCoords.displayName,
                    country: cityCoords.country
                },
                radius: maxRadius,
                weekendType: weekendType,
                limit: limit ? parseInt(limit) : null
            },
            weather: weatherInfo,
            results: {
                count: destinations.length,
                destinations: destinations.map(dest => ({
                    id: dest.id,
                    name: dest.name,
                    description: dest.description,
                    weekendType: dest.weekendType,
                    source: dest.source,
                    region: dest.region,
                    highlights: dest.highlights,
                    budget: dest.budget,
                    idealFor: dest.idealFor,
                    bestMonths: dest.bestMonths,
                    thingsToDo: dest.thingsToDo,
                    travelTime: dest.travelTime,
                    image: dest.image,
                    distanceFromCity: `${dest.distanceFromCity} km`,
                    wikipediaUrl: dest.wikipediaUrl,
                    coordinates: {
                        latitude: dest.latitude,
                        longitude: dest.longitude
                    }
                }))
            }
        };

        return res.json(response);

    } catch (err) {
        console.error('Error in searchWeekendGetaways:', err);
        next(err);
    }
};

// GET /api/v1/weekend-getaways/types
// Returns all available weekend getaway types
const getAllWeekendTypes = async (req, res, next) => {
    try {
        const weekendTypes = Object.keys(WEEKEND_TYPES).map(type => ({
            name: type,
            displayName: type.charAt(0).toUpperCase() + type.slice(1),
            keywords: WEEKEND_TYPES[type].keywords,
            description: getWeekendTypeDescription(type)
        }));

        return res.json({
            count: weekendTypes.length,
            weekendTypes: weekendTypes
        });

    } catch (err) {
        next(err);
    }
};

// GET /api/v1/weekend-getaways/destinations/:weekendType
// Returns sample destinations for a specific weekend type (using free APIs)
const getDestinationsByType = async (req, res, next) => {
    try {
        const { weekendType } = req.params;
        const { limit = 10 } = req.query;

        const normalizedWeekendType = weekendType.toLowerCase().replace(/\s+/g, ' ');
        
        if (!WEEKEND_TYPES[normalizedWeekendType]) {
            return res.status(400).json({ 
                message: 'Invalid weekend type',
                availableWeekendTypes: Object.keys(WEEKEND_TYPES),
                provided: weekendType
            });
        }

        // Use Delhi as default search location
        const searchLat = 28.6139;
        const searchLon = 77.2090;
        const radiusInMeters = 100000; // 100km radius

        // Fetch places from free APIs
        const [openTripMapPlaces, foursquarePlaces] = await Promise.all([
            fetchPlacesFromOpenTripMap(searchLat, searchLon, normalizedWeekendType, radiusInMeters),
            fetchPlacesFromFoursquare(searchLat, searchLon, normalizedWeekendType, radiusInMeters)
        ]);

        // Format and combine results
        let allPlaces = [
            ...(await Promise.all(openTripMapPlaces.map(place => formatPlaceData(place, 'opentripmap', normalizedWeekendType)))),
            ...(await Promise.all(foursquarePlaces.map(place => formatPlaceData(place, 'foursquare', normalizedWeekendType))))
        ];

        // Remove duplicates and apply limit
        const uniquePlaces = allPlaces.filter((place, index, self) => 
            index === self.findIndex(p => 
                Math.abs(p.latitude - place.latitude) < 0.001 && 
                Math.abs(p.longitude - place.longitude) < 0.001
            )
        ).slice(0, parseInt(limit));

        return res.json({
            weekendType: weekendType,
            count: uniquePlaces.length,
            destinations: uniquePlaces.map(dest => ({
                id: dest.id,
                name: dest.name,
                description: dest.description,
                weekendType: dest.weekendType,
                source: dest.source,
                region: dest.region,
                highlights: dest.highlights,
                budget: dest.budget,
                idealFor: dest.idealFor,
                bestMonths: dest.bestMonths,
                thingsToDo: dest.thingsToDo,
                travelTime: dest.travelTime,
                image: dest.image,
                wikipediaUrl: dest.wikipediaUrl,
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

// Helper function to get weekend type descriptions
const getWeekendTypeDescription = (weekendType) => {
    const descriptions = {
        "hill stations": "Mountain destinations perfect for weekend getaways with scenic views and cool climate",
        "beach destinations": "Coastal destinations ideal for weekend relaxation and water activities",
        "historical places": "Heritage sites and monuments perfect for cultural weekend trips",
        "adventure spots": "Thrilling destinations offering outdoor activities and adventure sports",
        "religious places": "Sacred destinations for spiritual weekend retreats and pilgrimages",
        "wildlife sanctuaries": "Nature destinations for wildlife spotting and eco-tourism"
    };
    return descriptions[weekendType] || "Weekend getaway destinations for various experiences";
};

module.exports = { 
    searchWeekendGetaways, 
    getAllWeekendTypes, 
    getDestinationsByType 
};