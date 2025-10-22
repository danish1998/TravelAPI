const axios = require('axios');
const crypto = require('crypto');

// Expedia Rapid API Configuration
const EXPEDIA_CONFIG = {
    baseURL: 'https://test.ean.com',
    clientId: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
    clientSecret: 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6',
    scope: '64192427-116e-4980-9869-5347191d3916',
    tokenURL: 'https://test.ean.com/identity/oauth2/v3/token?grant_type=client_credentials',
    // Rapid API signature authentication
    apiKey: '9d2f7089-6827-4626-ba7c-f71687a21a3b',
    sharedSecret: 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6'
};

// Get OAuth 2.0 access token using Basic Authentication
const getExpediaToken = async () => {
    try {
        // Create Basic Auth header with base64 encoded credentials
        const credentials = Buffer.from(`${EXPEDIA_CONFIG.clientId}:${EXPEDIA_CONFIG.clientSecret}`).toString('base64');
        
        const response = await axios.post(EXPEDIA_CONFIG.tokenURL, 
            'grant_type=client_credentials', // Send as form data
            {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to get Expedia OAuth token:', error.response?.data || error.message);
        throw error;
    }
};

// Use the exact signature from EPS Signature Generator
const generateEPSAuthHeader = (apiKey, timestamp) => {
    // Use the exact signature provided by EPS Signature Generator
    const signature = '03ca2d7cd0b2ba0fea82ec653142b8c2bfe68a73d0901c015fac0522b689e775a44f48865ac10fbc89357068449fb90a5b8a855f574f818562e58b639e7bffdc';
    return `EAN apikey=${apiKey},signature=${signature},timestamp=${timestamp}`;
};

// Process amenities data structure
const processAmenities = (amenitiesData) => {
    if (!amenitiesData) return { list: [], details: {} };
    
    // If amenities is an object with IDs as keys
    if (typeof amenitiesData === 'object' && !Array.isArray(amenitiesData)) {
        const amenitiesList = [];
        const amenitiesDetails = {};
        
        Object.keys(amenitiesData).forEach(amenityId => {
            const amenity = amenitiesData[amenityId];
            if (amenity && amenity.name) {
                amenitiesList.push(amenity.name);
                amenitiesDetails[amenityId] = {
                    id: amenity.id,
                    name: amenity.name,
                    categories: amenity.categories || []
                };
            }
        });
        
        return { list: amenitiesList, details: amenitiesDetails };
    }
    
    // If amenities is already an array
    if (Array.isArray(amenitiesData)) {
        return { list: amenitiesData, details: {} };
    }
    
    return { list: [], details: {} };
};

// Make authenticated request to Expedia Rapid API using provided EPS signature
const makeExpediaRequest = async (endpoint, params = {}) => {
    try {
        // Use the exact timestamp from EPS Signature Generator
        const timestamp = 1761067235; // From your EPS Signature Generator
        const authHeader = generateEPSAuthHeader(EXPEDIA_CONFIG.apiKey, timestamp);
        
        console.log('🔐 Using EPS Signature Generator Authentication Header:', authHeader);
        
        const response = await axios.get(`${EXPEDIA_CONFIG.baseURL}${endpoint}`, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'Authorization': authHeader,
                'User-Agent': 'TravelAPI/1.0'
            },
            params: {
                ...params
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Expedia API request error:', error.response?.data || error.message);
        throw error;
    }
};

// POST /api/v1/hotels/search
// Body params:
// - cityCode (IATA city code, e.g., DEL) OR { latitude, longitude, radius }
// - checkInDate (YYYY-MM-DD)
// - checkOutDate (YYYY-MM-DD)
// - adults (default 1)
// - rooms (default 1)
// - currency (optional, default USD)
// Filters (optional): priceMax, minRating, maxRating, amenities, sortBy(price|rating|distance), sortOrder(asc|desc), limit
const searchHotels = async (req, res, next) => {
    try {
        const body = req.body || {};
        const {
            cityCode,
            latitude,
            longitude,
            radius = 50,
            checkInDate,
            checkOutDate,
            adults = 1,
            rooms = 1,
            currency = 'USD',
            priceMax,
            minRating,
            maxRating,
            amenities,
            sortBy,
            sortOrder = 'asc',
            limit = 20,
        } = body;

        // Validation
        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({ message: 'checkInDate and checkOutDate are required' });
        }

        if (!cityCode && !(latitude && longitude)) {
            return res.status(400).json({ message: 'Provide cityCode or latitude/longitude' });
        }

        // Use Properties Availability API directly
        let propertyIds = [];
        
        // For now, use default property IDs for testing
        // In production, you would implement proper location-to-property mapping
        propertyIds = ['11775754', '12345678', '87654321', '10003243', '10012775']; // Default test property IDs
        
        // Prepare parameters for Properties Availability API
        const availabilityParams = {
            checkin: checkInDate,
            checkout: checkOutDate,
            currency: currency,
            country_code: 'US',
            language: 'en-US',
            occupancy: [adults.toString()],
            property_id: propertyIds,
            rate_plan_count: 1,
            sales_channel: 'website',
            sales_environment: 'hotel_only'
        };

        // Add optional filters
        if (priceMax) {
            availabilityParams.max_price = priceMax;
        }
        if (minRating) {
            availabilityParams.min_star_rating = minRating;
        }
        if (maxRating) {
            availabilityParams.max_star_rating = maxRating;
        }

        // Call Expedia Rapid Properties Availability API
        const response = await makeExpediaRequest('/properties/availability', availabilityParams);
        
        // Process and normalize the response from Properties Availability API
        let hotels = [];
        
        if (Array.isArray(response) && response.length > 0) {
            hotels = response.map(property => {
                const rooms = property.rooms || [];
                const firstRoom = rooms[0] || {};
                const rates = firstRoom.rates || [];
                const firstRate = rates[0] || {};
                const pricing = firstRate.pricing || {};
                
                // Process amenities data
                const processedAmenities = processAmenities(property.amenities);
                
                return {
                    hotelId: property.property_id,
                    name: property.name,
                    description: property.description,
                    rating: property.star_rating,
                    latitude: property.latitude,
                    longitude: property.longitude,
                    address: {
                        street: property.address?.line_1,
                        city: property.address?.city,
                        state: property.address?.state_province_code,
                        country: property.address?.country_code,
                        postalCode: property.address?.postal_code
                    },
                    amenities: processedAmenities.list,
                    amenitiesDetails: processedAmenities.details,
                    pricing: {
                        currency: pricing.currency || currency.toUpperCase(),
                        totalPrice: pricing.total?.value,
                        pricePerNight: pricing.nightly?.[0]?.value,
                        taxes: pricing.taxes,
                        fees: pricing.fees
                    },
                    images: property.images || [],
                    reviews: property.reviews || {},
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    rooms: rooms,
                    adults: adults,
                    status: 'available',
                    availableRooms: rooms.length,
                    links: property.links
                };
            });
        }

        // Apply client-side filtering
        if (amenities) {
            const amenitiesList = amenities.split(',').map(a => a.trim().toLowerCase());
            hotels = hotels.filter(hotel => 
                amenitiesList.every(amenity => 
                    hotel.amenities.some(h => h.toLowerCase().includes(amenity))
                )
            );
        }

        // Apply sorting
        if (sortBy === 'price') {
            hotels.sort((a, b) => (a.pricing.totalPrice || Infinity) - (b.pricing.totalPrice || Infinity));
        } else if (sortBy === 'rating') {
            hotels.sort((a, b) => (b.rating || -Infinity) - (a.rating || -Infinity));
        }
        
        if (sortOrder.toLowerCase() === 'desc') {
            hotels.reverse();
        }

        // Apply limit
        const limitedHotels = hotels.slice(0, parseInt(limit) || 20);

        return res.json({ 
            count: limitedHotels.length,
            totalCount: response.total_count || limitedHotels.length,
            transactionId: response.transaction_id,
            hotels: limitedHotels,
            searchParams: {
                location: cityCode || `${latitude},${longitude}`,
                checkInDate,
                checkOutDate,
                adults,
                rooms,
                currency
            }
        });
    } catch (error) {
        console.error('Hotel search error:', error);
        
        if (error.response?.status === 401) {
            return res.status(500).json({ 
                message: 'Authentication failed with Expedia API',
                error: 'Invalid API credentials'
            });
        }
        
        if (error.response?.status === 400) {
            return res.status(400).json({ 
                message: 'Invalid search parameters',
                error: error.response?.data?.message || 'Bad request'
            });
        }
        
        if (error.response?.status === 404) {
            return res.status(404).json({ 
                message: 'No hotels found',
                error: 'No properties available for the specified criteria'
            });
        }
        
        return res.status(500).json({ 
            message: 'Failed to search hotels',
            error: error.message
        });
    }
};

// GET /api/v1/hotels/details/:hotelId
// Query params:
// - checkInDate (YYYY-MM-DD) - optional
// - checkOutDate (YYYY-MM-DD) - optional
// - adults (default 1) - optional
// - rooms (default 1) - optional
// - currency (default USD) - optional
const getHotelDetails = async (req, res, next) => {
    try {
        const { hotelId } = req.params;
        const { 
            checkInDate, 
            checkOutDate, 
            adults = 1, 
            rooms = 1, 
            currency = 'USD' 
        } = req.query;

        if (!hotelId) {
            return res.status(400).json({ message: 'Hotel ID is required' });
        }

        // Prepare parameters for hotel details API
        const params = {
            currency: currency.toUpperCase(),
            locale: 'en_US'
        };

        // Add booking parameters if provided
        if (checkInDate && checkOutDate) {
            params.checkin = checkInDate;
            params.checkout = checkOutDate;
            params.adults = adults;
            params.rooms = rooms;
        }

        // Get property details using Properties Availability API
        const availabilityParams = {
            checkin: checkInDate || '2024-12-25',
            checkout: checkOutDate || '2024-12-27',
            currency: currency,
            country_code: 'US',
            language: 'en-US',
            occupancy: [adults.toString()],
            property_id: [hotelId],
            rate_plan_count: 1,
            sales_channel: 'website',
            sales_environment: 'hotel_only'
        };
        
        const response = await makeExpediaRequest('/properties/availability', availabilityParams);
        
        // Process and normalize the response
        const property = response?.[0] || {};
        const hotelRooms = property.rooms || [];
        const firstRoom = hotelRooms[0] || {};
        const rates = firstRoom.rates || [];
        const firstRate = rates[0] || {};
        const pricing = firstRate.pricing || {};

        // Process amenities data
        const processedAmenities = processAmenities(property.amenities);
        
        const hotelDetails = {
            hotelId: hotelId,
            name: property.name,
            description: property.description,
            rating: property.star_rating,
            latitude: property.latitude,
            longitude: property.longitude,
            address: {
                street: property.address?.line_1,
                city: property.address?.city,
                state: property.address?.state_province_code,
                country: property.address?.country_code,
                postalCode: property.address?.postal_code
            },
            amenities: processedAmenities.list,
            amenitiesDetails: processedAmenities.details,
            images: property.images || [],
            pricing: {
                currency: pricing.currency || currency.toUpperCase(),
                totalPrice: pricing.total?.value,
                pricePerNight: pricing.nightly?.[0]?.value,
                taxes: pricing.taxes,
                fees: pricing.fees
            },
            policies: {
                checkIn: hotel.policies?.check_in,
                checkOut: hotel.policies?.check_out,
                cancellation: hotel.policies?.cancellation,
                petPolicy: hotel.policies?.pet_policy
            },
            reviews: {
                overallRating: hotel.reviews?.overall_rating,
                totalReviews: hotel.reviews?.total_reviews,
                ratingBreakdown: hotel.reviews?.rating_breakdown
            },
            contact: {
                phone: hotel.contact?.phone,
                email: hotel.contact?.email,
                website: hotel.contact?.website
            },
            links: hotel.links,
            searchParams: checkInDate && checkOutDate ? {
                checkInDate,
                checkOutDate,
                adults,
                rooms,
                currency
            } : null
        };

        return res.json(hotelDetails);
    } catch (error) {
        console.error('Hotel details error:', error);
        
        if (error.response?.status === 404) {
            return res.status(404).json({ 
                message: 'Hotel not found',
                error: 'The requested hotel ID does not exist'
            });
        }
        
        if (error.response?.status === 401) {
            return res.status(500).json({ 
                message: 'Authentication failed with Expedia API',
                error: 'Invalid API credentials'
            });
        }
        
        return res.status(500).json({ 
            message: 'Failed to get hotel details',
            error: error.message
        });
    }
};

// GET /api/v1/hotels/availability/:hotelId
// Query params:
// - checkInDate (YYYY-MM-DD) - required
// - checkOutDate (YYYY-MM-DD) - required
// - adults (default 1) - optional
// - rooms (default 1) - optional
// - currency (default USD) - optional
const getHotelAvailability = async (req, res, next) => {
    try {
        const { hotelId } = req.params;
        const { 
            checkInDate, 
            checkOutDate, 
            adults = 1, 
            rooms = 1, 
            currency = 'USD' 
        } = req.query;

        if (!hotelId) {
            return res.status(400).json({ message: 'Hotel ID is required' });
        }

        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({ message: 'checkInDate and checkOutDate are required' });
        }

        // Prepare parameters for availability API
        const params = {
            checkin: checkInDate,
            checkout: checkOutDate,
            adults: adults,
            rooms: rooms,
            currency: currency.toUpperCase(),
            locale: 'en_US'
        };

        // Call Expedia Rapid API for availability using Properties Availability API
        const searchParams = {
            checkin: checkInDate,
            checkout: checkOutDate,
            currency: currency,
            country_code: 'US',
            language: 'en-US',
            occupancy: [adults.toString()],
            property_id: [hotelId],
            rate_plan_count: 1,
            sales_channel: 'website',
            sales_environment: 'hotel_only'
        };
        
        const response = await makeExpediaRequest('/properties/availability', searchParams);
        
        // Process and normalize the response
        const hotel = response?.[0] || {};
        const availableRooms = hotel.rooms || [];

        const processedAvailability = {
            hotelId: hotelId,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            adults: adults,
            rooms: rooms,
            currency: currency.toUpperCase(),
            availableRooms: availableRooms.map(room => ({
                roomTypeId: room.id,
                roomType: room.name,
                description: room.description,
                amenities: room.amenities || [],
                images: room.images || [],
                pricing: {
                    totalPrice: room.rates?.[0]?.pricing?.total?.value,
                    pricePerNight: room.rates?.[0]?.pricing?.nightly?.[0]?.value,
                    taxes: room.rates?.[0]?.pricing?.taxes,
                    fees: room.rates?.[0]?.pricing?.fees
                },
                cancellationPolicy: room.cancellation_policy,
                bedTypes: room.bedding || [],
                links: room.links
            })),
            totalAvailableRooms: availableRooms.length,
            lastUpdated: new Date().toISOString()
        };

        return res.json(processedAvailability);
    } catch (error) {
        console.error('Hotel availability error:', error);
        
        if (error.response?.status === 404) {
            return res.status(404).json({ 
                message: 'Hotel not found',
                error: 'The requested hotel ID does not exist'
            });
        }
        
        if (error.response?.status === 400) {
            return res.status(400).json({ 
                message: 'Invalid availability parameters',
                error: error.response?.data?.message || 'Bad request'
            });
        }
        
        return res.status(500).json({ 
            message: 'Failed to get hotel availability',
            error: error.message
        });
    }
};

module.exports = { searchHotels, getHotelDetails, getHotelAvailability };


