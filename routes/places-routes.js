const express = require('express');
const router = express.Router();
const { getPlacesOfInterest, getPlaceDetails, searchPlaces, getWeekendGetaways, getWeekendGetawayPlaces } = require('../Controllers/placesController');

// Get places of interest near a location
// GET /api/places/nearby?lat=28.6542&lng=77.2373&area=Delhi&radius=5&type=tourist_attraction
router.get('/nearby', getPlacesOfInterest);

// Get detailed information about a specific place
// GET /api/places/details/:place_id
router.get('/details/:place_id', getPlaceDetails);

// Search places by text query
// GET /api/places/search?query=restaurants in Delhi&lat=28.6542&lng=77.2373&radius=5
router.get('/search', searchPlaces);

// Get weekend getaways within radius of user's city
// GET /api/places/weekend-getaways?city=Delhi&radius=300
router.get('/weekend-getaways', getWeekendGetaways);

// Get places of interest for a specific weekend getaway destination
// GET /api/places/weekend-getaways/mussorie?radius=10&type=tourist_attraction
router.get('/weekend-getaways/:destination', getWeekendGetawayPlaces);

module.exports = router;
