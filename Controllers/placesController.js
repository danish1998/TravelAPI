const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyD0auWJH3lGEPh9jSXRsH6vlltahJj5kuM';

// Weekend getaway search queries for different regions
const weekendSearchQueries = [
    "hill station near",
    "beach destination near", 
    "tourist places near",
    "weekend getaway near",
    "vacation spots near",
    "resort near",
    "national park near",
    "heritage city near",
    "adventure destination near",
    "spiritual places near",
    "waterfall near",
    "lake near",
    "fort near",
    "palace near",
    "temple near",
    "wildlife sanctuary near"
];

// Popular weekend getaway destinations for major cities
const cityWeekendDestinations = {
    "Delhi": ["Mussorie", "Shimla", "Manali", "Rishikesh", "Nainital", "Agra", "Jaipur", "Udaipur"],
    "Mumbai": ["Lonavala", "Mahabaleshwar", "Matheran", "Goa", "Pune", "Alibaug", "Khandala", "Lavasa"],
    "Bangalore": ["Mysore", "Coorg", "Ooty", "Kodaikanal", "Munnar", "Hampi", "Chikmagalur", "Nandi Hills"],
    "Chennai": ["Pondicherry", "Mahabalipuram", "Kanchipuram", "Vellore", "Tirupati", "Yelagiri", "Hogenakkal", "Kodaikanal"],
    "Kolkata": ["Darjeeling", "Gangtok", "Puri", "Bhubaneswar", "Shantiniketan", "Digha", "Mandarmani", "Bakkhali"],
    "Hyderabad": ["Warangal", "Vijayawada", "Tirupati", "Araku Valley", "Hampi", "Bidar", "Gulbarga", "Nagarjuna Sagar"],
    "Pune": ["Lonavala", "Mahabaleshwar", "Matheran", "Khandala", "Lavasa", "Panchgani", "Bhandardara", "Sinhagad"]
};

// Function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

// Get places of interest using Google Places API
const getPlacesOfInterest = async (req, res, next) => {
    try {
        const { lat, lng, area, radius = 5, type = 'tourist_attraction' } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ 
                message: "Latitude and longitude are required" 
            });
        }

        const location = `${lat},${lng}`;
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

        // Convert kilometers to meters for Google Places API
        const radiusInMeters = radius * 1000;

        const params = {
            location: location,
            radius: radiusInMeters,
            type: type,
            key: GOOGLE_API_KEY
        };

        const response = await axios.get(url, { params });
        
        if (response.data.status !== 'OK') {
            return res.status(400).json({
                message: "Error fetching places",
                error: response.data.error_message || response.data.status
            });
        }

        // Format the response to include relevant information
        const places = response.data.results.map(place => ({
            place_id: place.place_id,
            name: place.name,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            vicinity: place.vicinity,
            types: place.types,
            geometry: {
                location: {
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng
                }
            },
            photos: place.photos ? place.photos.map(photo => {
                console.log(photo)
                return({
                photo_reference: photo.photo_reference,
                height: photo.height,
                width: photo.width
            })}) : []
        }));

        res.json({
            success: true,
            location: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                area: area || 'Unknown'
            },
            search_radius_km: parseFloat(radius),
            total_results: places.length,
            places: places
        });

    } catch (error) {
        console.error('Google Places API Error:', error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get place details by place_id
const getPlaceDetails = async (req, res, next) => {
    try {
        const { place_id } = req.params;

        if (!place_id) {
            return res.status(400).json({ 
                message: "Place ID is required" 
            });
        }

        const url = `https://maps.googleapis.com/maps/api/place/details/json`;

        const params = {
            place_id: place_id,
            fields: 'name,rating,formatted_phone_number,formatted_address,opening_hours,photos,reviews,website,url',
            key: GOOGLE_API_KEY
        };

        const response = await axios.get(url, { params });
        
        if (response.data.status !== 'OK') {
            return res.status(400).json({
                message: "Error fetching place details",
                error: response.data.error_message || response.data.status
            });
        }

        const place = response.data.result;
        
        res.json({
            success: true,
            place: {
                place_id: place.place_id,
                name: place.name,
                rating: place.rating,
                user_ratings_total: place.user_ratings_total,
                formatted_address: place.formatted_address,
                formatted_phone_number: place.formatted_phone_number,
                website: place.website,
                url: place.url,
                opening_hours: place.opening_hours,
                photos: place.photos ? place.photos.map(photo => ({
                    photo_reference: photo.photo_reference,
                    height: photo.height,
                    width: photo.width
                })) : [],
                reviews: place.reviews ? place.reviews.map(review => ({
                    author_name: review.author_name,
                    rating: review.rating,
                    text: review.text,
                    time: review.time
                })) : []
            }
        });

    } catch (error) {
        console.error('Google Places Details API Error:', error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Search places by text query
const searchPlaces = async (req, res, next) => {
    try {
        const { query, lat, lng, radius = 5 } = req.query;

        if (!query) {
            return res.status(400).json({ 
                message: "Search query is required" 
            });
        }

        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;

        const params = {
            query: query,
            key: GOOGLE_API_KEY
        };

        // Add location bias if provided
        if (lat && lng) {
            params.location = `${lat},${lng}`;
            // Convert kilometers to meters for Google Places API
            params.radius = radius * 1000;
        }

        const response = await axios.get(url, { params });
        
        if (response.data.status !== 'OK') {
            return res.status(400).json({
                message: "Error searching places",
                error: response.data.error_message || response.data.status
            });
        }

        const places = response.data.results.map(place => ({
            place_id: place.place_id,
            name: place.name,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            formatted_address: place.formatted_address,
            types: place.types,
            geometry: {
                location: {
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng
                }
            },
            photos: place.photos ? place.photos.map(photo => ({
                photo_reference: photo.photo_reference,
                height: photo.height,
                width: photo.width
            })) : []
        }));

        res.json({
            success: true,
            query: query,
            search_radius_km: parseFloat(radius),
            total_results: places.length,
            places: places
        });

    } catch (error) {
        console.error('Google Places Search API Error:', error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get weekend getaways within radius of user's city using Google Places API
const getWeekendGetaways = async (req, res, next) => {
    try {
        const { city, radius = 300 } = req.query;

        if (!city) {
            return res.status(400).json({ 
                message: "City name is required" 
            });
        }

        // First, get coordinates for the city using Geocoding API
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json`;
        const geocodeParams = {
            address: city,
            key: GOOGLE_API_KEY
        };

        const geocodeResponse = await axios.get(geocodeUrl, { params: geocodeParams });
        
        if (geocodeResponse.data.status !== 'OK' || !geocodeResponse.data.results.length) {
            return res.status(400).json({
                message: "City not found. Please provide a valid city name.",
                suggestion: "Try cities like Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad"
            });
        }

        const location = geocodeResponse.data.results[0].geometry.location;
        const userLat = location.lat;
        const userLng = location.lng;
        const searchRadius = parseFloat(radius);

        // Search for weekend getaway destinations using multiple queries
        const allDestinations = [];
        const seenPlaces = new Set();

        // First, search for specific popular destinations for the city
        const cityKey = Object.keys(cityWeekendDestinations).find(key => 
            key.toLowerCase() === city.toLowerCase()
        );
        
        if (cityKey) {
            const popularDestinations = cityWeekendDestinations[cityKey];
            for (const destination of popularDestinations) {
                try {
                    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
                    const params = {
                        query: destination,
                        key: GOOGLE_API_KEY,
                        location: `${userLat},${userLng}`,
                        radius: searchRadius * 1000
                    };

                    const response = await axios.get(url, { params });
                    
                    if (response.data.status === 'OK' && response.data.results) {
                        response.data.results.forEach(place => {
                            if (!seenPlaces.has(place.place_id)) {
                                seenPlaces.add(place.place_id);
                                
                                const distance = calculateDistance(
                                    userLat,
                                    userLng,
                                    place.geometry.location.lat,
                                    place.geometry.location.lng
                                );

                                if (distance <= searchRadius && distance >= 10) {
                                    allDestinations.push({
                                        place_id: place.place_id,
                                        name: place.name,
                                        rating: place.rating,
                                        user_ratings_total: place.user_ratings_total,
                                        vicinity: place.vicinity,
                                        types: place.types,
                                        distance_km: Math.round(distance * 10) / 10,
                                        geometry: {
                                            location: {
                                                lat: place.geometry.location.lat,
                                                lng: place.geometry.location.lng
                                            }
                                        },
                                        photos: place.photos ? place.photos.map(photo => ({
                                            photo_reference: photo.photo_reference,
                                            height: photo.height,
                                            width: photo.width
                                        })) : []
                                    });
                                }
                            }
                        });
                    }
                } catch (queryError) {
                    console.error(`Error searching for ${destination}:`, queryError.message);
                }
            }
        }

        // Then search using general queries with broader search
        for (const query of weekendSearchQueries) {
            try {
                const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
                const searchQuery = `${query} ${city} India`;
                const params = {
                    query: searchQuery,
                    key: GOOGLE_API_KEY,
                    location: `${userLat},${userLng}`,
                    radius: searchRadius * 1000 // Convert km to meters
                };

                const response = await axios.get(url, { params });
                
                if (response.data.status === 'OK' && response.data.results) {
                    response.data.results.forEach(place => {
                        // Avoid duplicates
                        if (!seenPlaces.has(place.place_id)) {
                            seenPlaces.add(place.place_id);
                            
                            const distance = calculateDistance(
                                userLat,
                                userLng,
                                place.geometry.location.lat,
                                place.geometry.location.lng
                            );

                            // Only include places within the specified radius and exclude very close places (within 10km)
                            if (distance <= searchRadius && distance >= 10) {
                                allDestinations.push({
                                    place_id: place.place_id,
                                    name: place.name,
                                    rating: place.rating,
                                    user_ratings_total: place.user_ratings_total,
                                    vicinity: place.vicinity,
                                    types: place.types,
                                    distance_km: Math.round(distance * 10) / 10,
                                    geometry: {
                                        location: {
                                            lat: place.geometry.location.lat,
                                            lng: place.geometry.location.lng
                                        }
                                    },
                                    photos: place.photos ? place.photos.map(photo => ({
                                        photo_reference: photo.photo_reference,
                                        height: photo.height,
                                        width: photo.width
                                    })) : []
                                });
                            }
                        }
                    });
                }
            } catch (queryError) {
                console.error(`Error searching for ${query}:`, queryError.message);
                // Continue with other queries even if one fails
            }
        }

        // Sort by distance and limit results
        const sortedDestinations = allDestinations
            .sort((a, b) => a.distance_km - b.distance_km)
            .slice(0, 50); // Limit to top 50 results

        res.json({
            success: true,
            user_location: {
                city: city,
                lat: userLat,
                lng: userLng,
                formatted_address: geocodeResponse.data.results[0].formatted_address
            },
            search_radius_km: searchRadius,
            total_destinations: sortedDestinations.length,
            destinations: sortedDestinations
        });

    } catch (error) {
        console.error('Weekend Getaways Error:', error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get places of interest for a specific weekend getaway destination
const getWeekendGetawayPlaces = async (req, res, next) => {
    try {
        const { destination } = req.params;
        const { radius = 10, type = 'tourist_attraction' } = req.query;

        // First, search for the destination using Google Places Text Search
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
        const searchParams = {
            query: destination,
            key: GOOGLE_API_KEY
        };

        const searchResponse = await axios.get(searchUrl, { params: searchParams });
        
        if (searchResponse.data.status !== 'OK' || !searchResponse.data.results.length) {
            return res.status(404).json({
                message: "Weekend getaway destination not found",
                suggestion: "Try searching for popular destinations like Mussorie, Shimla, Goa, Manali, Nainital"
            });
        }

        // Use the first result as the destination
        const dest = searchResponse.data.results[0];
        const { lat, lng } = dest.geometry.location;
        const location = `${lat},${lng}`;
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

        // Convert kilometers to meters for Google Places API
        const radiusInMeters = radius * 1000;

        const params = {
            location: location,
            radius: radiusInMeters,
            type: type,
            key: GOOGLE_API_KEY
        };

        const response = await axios.get(url, { params });
        
        if (response.data.status !== 'OK') {
            return res.status(400).json({
                message: "Error fetching places",
                error: response.data.error_message || response.data.status
            });
        }

        // Format the response
        const places = response.data.results.map(place => ({
            place_id: place.place_id,
            name: place.name,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            vicinity: place.vicinity,
            types: place.types,
            geometry: {
                location: {
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng
                }
            },
            photos: place.photos ? place.photos.map(photo => ({
                photo_reference: photo.photo_reference,
                height: photo.height,
                width: photo.width
            })) : []
        }));

        res.json({
            success: true,
            destination: {
                name: dest.name,
                formatted_address: dest.formatted_address,
                rating: dest.rating,
                user_ratings_total: dest.user_ratings_total,
                coordinates: {
                    lat: dest.geometry.location.lat,
                    lng: dest.geometry.location.lng
                },
                types: dest.types
            },
            search_radius_km: parseFloat(radius),
            total_places: places.length,
            places: places
        });

    } catch (error) {
        console.error('Weekend Getaway Places Error:', error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    getPlacesOfInterest,
    getPlaceDetails,
    searchPlaces,
    getWeekendGetaways,
    getWeekendGetawayPlaces
};
