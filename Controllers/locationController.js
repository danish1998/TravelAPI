const fetch = require("node-fetch"); // skip in Node 18+

// Geoapify API configuration
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || "0e3bca515bea4d978e253b28c7ce3ffc";
const GEOAPIFY_BASE_URL = "https://api.geoapify.com/v1/geocode";

const location = async (req, res, next) => {
    try {
        let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

        // Handle localhost / private ranges
        if (
            ip === "::1" || 
            ip === "127.0.0.1" || 
            ip.startsWith("192.168") || 
            ip.startsWith("10.") || 
            ip.startsWith("172.16.")
        ) {
            ip = "103.21.220.50"; // ✅ Delhi IP for local testing
        }

        // Call ip-api first
        let response = await fetch(`http://ip-api.com/json/${ip}`);
        let data = await response.json();

        // If ip-api fails, fallback to ipwho.is
        if (data.status === "fail") {
            response = await fetch(`https://ipwho.is/${ip}`);
            data = await response.json();

            if (!data.success) {
                return res.status(400).json({
                    message: "Unable to fetch location",
                    reason: data.message || "Unknown error"
                });
            }

            return res.json({
                ip,
                latitude: data.latitude,
                longitude: data.longitude,
                area: `${data.city}, ${data.region}, ${data.country}`,
                source: "ipwho.is"
            });
        }

        // Successful ip-api response
        return res.json({
            ip,
            latitude: data.lat,
            longitude: data.lon,
            area: `${data.city}, ${data.regionName}, ${data.country}`,
            source: "ip-api"
        });
    } catch (err) {
        next(err);
    }
};

// Geocoding function using Geoapify API
const geocode = async (req, res, next) => {
    try {
        const { text, limit = 10, filter = "countrycode:in" } = req.query;

        // Validate required parameters
        if (!text || text.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Text parameter is required for geocoding"
            });
        }

        // Build Geoapify API URL
        const params = new URLSearchParams({
            text: text.trim(),
            apiKey: GEOAPIFY_API_KEY,
            limit: Math.min(parseInt(limit), 50) // Max 50 results
        });

        // Add filter if provided
        if (filter) {
            params.append('filter', filter);
        }

        const apiUrl = `${GEOAPIFY_BASE_URL}/search?${params.toString()}`;
        
        console.log(`Geocoding request: ${apiUrl}`);

        // Make request to Geoapify API
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Geoapify API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if we have results
        if (!data.features || data.features.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No results found for the given location",
                query: {
                    text: text.trim(),
                    limit: parseInt(limit)
                }
            });
        }

        // Format the response
        const results = data.features.map(feature => {
            const props = feature.properties;
            const coords = feature.geometry.coordinates;
            
            return {
                place_id: props.place_id,
                formatted_address: props.formatted,
                name: props.name || props.address_line1,
                country: props.country,
                country_code: props.country_code,
                state: props.state,
                city: props.city,
                latitude: coords[1],
                longitude: coords[0],
                confidence: props.rank?.confidence || 0,
                importance: props.rank?.importance || 0,
                result_type: props.result_type,
                timezone: props.timezone,
                bbox: feature.bbox
            };
        });

        return res.json({
            success: true,
            message: "Geocoding results retrieved successfully",
            query: {
                text: text.trim(),
                limit: parseInt(limit),
                filter: filter
            },
            results: {
                count: results.length,
                data: results
            },
            source: "geoapify"
        });

    } catch (error) {
        console.error('Geocoding error:', error);
        return res.status(500).json({
            success: false,
            message: "Geocoding service error",
            error: error.message
        });
    }
};

// Reverse geocoding function
const reverseGeocode = async (req, res, next) => {
    try {
        const { lat, lon, limit = 10 } = req.query;

        // Validate required parameters
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude parameters are required for reverse geocoding"
            });
        }

        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude values"
            });
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                success: false,
                message: "Latitude must be between -90 and 90, longitude must be between -180 and 180"
            });
        }

        // Build Geoapify reverse geocoding URL
        const params = new URLSearchParams({
            lat: latitude,
            lon: longitude,
            apiKey: GEOAPIFY_API_KEY,
            limit: Math.min(parseInt(limit), 50)
        });

        const apiUrl = `${GEOAPIFY_BASE_URL}/reverse?${params.toString()}`;
        
        console.log(`Reverse geocoding request: ${apiUrl}`);

        // Make request to Geoapify API
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Geoapify API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if we have results
        if (!data.features || data.features.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No results found for the given coordinates",
                query: {
                    latitude: latitude,
                    longitude: longitude,
                    limit: parseInt(limit)
                }
            });
        }

        // Format the response
        const results = data.features.map(feature => {
            const props = feature.properties;
            const coords = feature.geometry.coordinates;
            
            return {
                place_id: props.place_id,
                formatted_address: props.formatted,
                name: props.name || props.address_line1,
                country: props.country,
                country_code: props.country_code,
                state: props.state,
                city: props.city,
                latitude: coords[1],
                longitude: coords[0],
                confidence: props.rank?.confidence || 0,
                importance: props.rank?.importance || 0,
                result_type: props.result_type,
                timezone: props.timezone,
                bbox: feature.bbox
            };
        });

        return res.json({
            success: true,
            message: "Reverse geocoding results retrieved successfully",
            query: {
                latitude: latitude,
                longitude: longitude,
                limit: parseInt(limit)
            },
            results: {
                count: results.length,
                data: results
            },
            source: "geoapify"
        });

    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return res.status(500).json({
            success: false,
            message: "Reverse geocoding service error",
            error: error.message
        });
    }
};

module.exports = { location, geocode, reverseGeocode };
