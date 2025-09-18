const fetch = require("node-fetch");

// Free APIs for continents and countries data
const FREE_APIS = {
    // REST Countries API (Free)
    COUNTRIES: "https://restcountries.com/v3.1",
    
    // OpenStreetMap Nominatim (Free geocoding)
    GEOCODING: "https://nominatim.openstreetmap.org/search",
    
    // Wikipedia API (Free)
    WIKIPEDIA: "https://en.wikipedia.org/api/rest_v1/page/summary",
    
    // Weather API (Free tier)
    WEATHER: "https://api.openweathermap.org/data/2.5/weather"
};

// Continent mappings with regions and countries
const CONTINENT_MAPPINGS = {
    "europe": {
        regions: ["Western Europe", "Eastern Europe", "Northern Europe", "Southern Europe"],
        countries: [
            "France", "Germany", "Italy", "Spain", "United Kingdom", "Netherlands", "Belgium", 
            "Switzerland", "Austria", "Sweden", "Norway", "Denmark", "Finland", "Poland", 
            "Czech Republic", "Hungary", "Romania", "Bulgaria", "Greece", "Portugal", "Ireland"
        ],
        majorCities: [
            "Paris", "London", "Rome", "Madrid", "Berlin", "Amsterdam", "Vienna", "Prague", 
            "Budapest", "Stockholm", "Copenhagen", "Helsinki", "Warsaw", "Athens", "Lisbon"
        ]
    },
    "asia": {
        regions: ["East Asia", "Southeast Asia", "South Asia", "Central Asia", "West Asia"],
        countries: [
            "China", "Japan", "South Korea", "India", "Thailand", "Vietnam", "Indonesia", 
            "Malaysia", "Singapore", "Philippines", "Bangladesh", "Pakistan", "Sri Lanka", 
            "Nepal", "Myanmar", "Cambodia", "Laos", "Mongolia", "Kazakhstan", "Uzbekistan"
        ],
        majorCities: [
            "Tokyo", "Beijing", "Shanghai", "Mumbai", "Delhi", "Bangkok", "Singapore", 
            "Jakarta", "Manila", "Seoul", "Hong Kong", "Dubai", "Istanbul", "Tehran", "Riyadh"
        ]
    },
    "middle east": {
        regions: ["Arabian Peninsula", "Levant", "Mesopotamia", "Anatolia"],
        countries: [
            "Saudi Arabia", "United Arab Emirates", "Israel", "Turkey", "Iran", "Iraq", 
            "Jordan", "Lebanon", "Syria", "Kuwait", "Qatar", "Bahrain", "Oman", "Yemen"
        ],
        majorCities: [
            "Dubai", "Abu Dhabi", "Riyadh", "Jerusalem", "Tel Aviv", "Istanbul", "Ankara", 
            "Tehran", "Baghdad", "Amman", "Beirut", "Kuwait City", "Doha", "Manama", "Muscat"
        ]
    },
    "africa": {
        regions: ["North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"],
        countries: [
            "Egypt", "South Africa", "Nigeria", "Kenya", "Morocco", "Tunisia", "Algeria", 
            "Ethiopia", "Ghana", "Tanzania", "Uganda", "Rwanda", "Botswana", "Namibia", 
            "Zimbabwe", "Zambia", "Senegal", "Ivory Coast", "Cameroon", "Angola"
        ],
        majorCities: [
            "Cairo", "Cape Town", "Johannesburg", "Lagos", "Nairobi", "Casablanca", "Tunis", 
            "Addis Ababa", "Accra", "Dar es Salaam", "Kampala", "Kigali", "Gaborone", "Windhoek"
        ]
    },
    "oceania": {
        regions: ["Australia", "New Zealand", "Melanesia", "Micronesia", "Polynesia"],
        countries: [
            "Australia", "New Zealand", "Fiji", "Papua New Guinea", "Solomon Islands", 
            "Vanuatu", "Samoa", "Tonga", "Kiribati", "Tuvalu", "Nauru", "Palau", "Marshall Islands"
        ],
        majorCities: [
            "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Auckland", "Wellington", 
            "Christchurch", "Suva", "Port Moresby", "Honiara", "Port Vila", "Apia", "Nuku'alofa"
        ]
    }
};

// Helper function to get country information from REST Countries API
const getCountryInfo = async (countryName) => {
    try {
        const response = await fetch(`${FREE_APIS.COUNTRIES}/name/${encodeURIComponent(countryName)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const country = data[0];
            return {
                name: country.name?.common || countryName,
                officialName: country.name?.official,
                capital: country.capital?.[0],
                region: country.region,
                subregion: country.subregion,
                population: country.population,
                area: country.area,
                currency: Object.values(country.currencies || {})[0]?.name,
                language: Object.values(country.languages || {})[0],
                flag: country.flags?.png,
                continent: country.continents?.[0]
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching country info for ${countryName}:`, error);
        return null;
    }
};

// Helper function to get city information from Nominatim API
const getCityInfo = async (cityName, countryName = "") => {
    try {
        const query = countryName ? `${cityName}, ${countryName}` : cityName;
        const response = await fetch(`${FREE_APIS.GEOCODING}?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const place = data[0];
            return {
                name: place.display_name.split(',')[0],
                fullName: place.display_name,
                latitude: parseFloat(place.lat),
                longitude: parseFloat(place.lon),
                country: place.address?.country,
                state: place.address?.state,
                type: place.type,
                importance: place.importance
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching city info for ${cityName}:`, error);
        return null;
    }
};

// Helper function to get Wikipedia description
const getWikipediaDescription = async (query) => {
    try {
        const response = await fetch(`${FREE_APIS.WIKIPEDIA}/${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data && data.extract) {
            return {
                description: data.extract,
                summary: data.description,
                url: data.content_urls?.desktop?.page
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching Wikipedia description for ${query}:`, error);
        return null;
    }
};

// Helper function to get weather for a location
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

// GET /api/v1/continents/search
// Query params: continent (required), limit (optional), includeWeather (optional)
const searchByContinent = async (req, res, next) => {
    try {
        const { continent, limit = 10, includeWeather = false } = req.query;

        if (!continent) {
            return res.status(400).json({ 
                message: 'Continent parameter is required',
                availableContinents: Object.keys(CONTINENT_MAPPINGS),
                example: '/api/v1/continents/search?continent=europe&limit=5'
            });
        }

        const normalizedContinent = continent.toLowerCase().replace(/\s+/g, ' ');
        
        if (!CONTINENT_MAPPINGS[normalizedContinent]) {
            return res.status(400).json({ 
                message: 'Invalid continent',
                availableContinents: Object.keys(CONTINENT_MAPPINGS),
                provided: continent
            });
        }

        const continentData = CONTINENT_MAPPINGS[normalizedContinent];
        const limitNum = parseInt(limit);
        const shouldIncludeWeather = includeWeather === 'true';

        // Get countries information
        const countriesPromises = continentData.countries.slice(0, limitNum).map(async (countryName) => {
            const countryInfo = await getCountryInfo(countryName);
            return countryInfo;
        });

        const countries = (await Promise.all(countriesPromises)).filter(Boolean);

        // Get cities information
        const citiesPromises = continentData.majorCities.slice(0, limitNum).map(async (cityName) => {
            const cityInfo = await getCityInfo(cityName);
            return cityInfo;
        });

        const cities = (await Promise.all(citiesPromises)).filter(Boolean);

        // Get weather for cities if requested
        let weatherData = {};
        if (shouldIncludeWeather && cities.length > 0) {
            const weatherPromises = cities.slice(0, 5).map(async (city) => {
                if (city.latitude && city.longitude) {
                    const weather = await getWeatherInfo(city.latitude, city.longitude);
                    return { city: city.name, weather };
                }
                return null;
            });
            const weatherResults = await Promise.all(weatherPromises);
            weatherData = weatherResults.filter(Boolean).reduce((acc, item) => {
                acc[item.city] = item.weather;
                return acc;
            }, {});
        }

        // Get Wikipedia description for the continent
        const wikipediaInfo = await getWikipediaDescription(normalizedContinent);

        // Format response
        const response = {
            searchParams: {
                continent: continent,
                limit: limitNum,
                includeWeather: shouldIncludeWeather
            },
            continentInfo: {
                name: normalizedContinent,
                regions: continentData.regions,
                wikipediaDescription: wikipediaInfo?.description || `Information about ${normalizedContinent}`,
                wikipediaUrl: wikipediaInfo?.url
            },
            results: {
                countries: {
                    count: countries.length,
                    data: countries.map(country => ({
                        name: country.name,
                        officialName: country.officialName,
                        capital: country.capital,
                        region: country.region,
                        subregion: country.subregion,
                        population: country.population,
                        area: country.area,
                        currency: country.currency,
                        language: country.language,
                        flag: country.flag
                    }))
                },
                cities: {
                    count: cities.length,
                    data: cities.map(city => ({
                        name: city.name,
                        fullName: city.fullName,
                        country: city.country,
                        state: city.state,
                        type: city.type,
                        coordinates: {
                            latitude: city.latitude,
                            longitude: city.longitude
                        },
                        ...(shouldIncludeWeather && weatherData[city.name] && {
                            weather: weatherData[city.name]
                        })
                    }))
                }
            }
        };

        return res.json(response);

    } catch (err) {
        console.error('Error in searchByContinent:', err);
        next(err);
    }
};

// GET /api/v1/continents/continents
// Returns all available continents
const getAllContinents = async (req, res, next) => {
    try {
        const continents = Object.keys(CONTINENT_MAPPINGS).map(continent => ({
            name: continent,
            displayName: continent.charAt(0).toUpperCase() + continent.slice(1),
            regions: CONTINENT_MAPPINGS[continent].regions,
            countryCount: CONTINENT_MAPPINGS[continent].countries.length,
            cityCount: CONTINENT_MAPPINGS[continent].majorCities.length,
            description: getContinentDescription(continent)
        }));

        return res.json({
            count: continents.length,
            continents: continents
        });

    } catch (err) {
        next(err);
    }
};

// GET /api/v1/continents/countries/:continent
// Returns countries for a specific continent
const getCountriesByContinent = async (req, res, next) => {
    try {
        const { continent } = req.params;
        const { limit = 20 } = req.query;

        const normalizedContinent = continent.toLowerCase().replace(/\s+/g, ' ');
        
        if (!CONTINENT_MAPPINGS[normalizedContinent]) {
            return res.status(400).json({ 
                message: 'Invalid continent',
                availableContinents: Object.keys(CONTINENT_MAPPINGS),
                provided: continent
            });
        }

        const continentData = CONTINENT_MAPPINGS[normalizedContinent];
        const limitNum = parseInt(limit);

        // Get detailed country information
        const countriesPromises = continentData.countries.slice(0, limitNum).map(async (countryName) => {
            const countryInfo = await getCountryInfo(countryName);
            return countryInfo;
        });

        const countries = (await Promise.all(countriesPromises)).filter(Boolean);

        return res.json({
            continent: continent,
            count: countries.length,
            countries: countries.map(country => ({
                name: country.name,
                officialName: country.officialName,
                capital: country.capital,
                region: country.region,
                subregion: country.subregion,
                population: country.population,
                area: country.area,
                currency: country.currency,
                language: country.language,
                flag: country.flag,
                continent: country.continent
            }))
        });

    } catch (err) {
        next(err);
    }
};

// GET /api/v1/continents/cities/:continent
// Returns cities for a specific continent
const getCitiesByContinent = async (req, res, next) => {
    try {
        const { continent } = req.params;
        const { limit = 15, includeWeather = false } = req.query;

        const normalizedContinent = continent.toLowerCase().replace(/\s+/g, ' ');
        
        if (!CONTINENT_MAPPINGS[normalizedContinent]) {
            return res.status(400).json({ 
                message: 'Invalid continent',
                availableContinents: Object.keys(CONTINENT_MAPPINGS),
                provided: continent
            });
        }

        const continentData = CONTINENT_MAPPINGS[normalizedContinent];
        const limitNum = parseInt(limit);
        const shouldIncludeWeather = includeWeather === 'true';

        // Get detailed city information
        const citiesPromises = continentData.majorCities.slice(0, limitNum).map(async (cityName) => {
            const cityInfo = await getCityInfo(cityName);
            return cityInfo;
        });

        const cities = (await Promise.all(citiesPromises)).filter(Boolean);

        // Get weather for cities if requested
        let weatherData = {};
        if (shouldIncludeWeather && cities.length > 0) {
            const weatherPromises = cities.slice(0, 10).map(async (city) => {
                if (city.latitude && city.longitude) {
                    const weather = await getWeatherInfo(city.latitude, city.longitude);
                    return { city: city.name, weather };
                }
                return null;
            });
            const weatherResults = await Promise.all(weatherPromises);
            weatherData = weatherResults.filter(Boolean).reduce((acc, item) => {
                acc[item.city] = item.weather;
                return acc;
            }, {});
        }

        return res.json({
            continent: continent,
            count: cities.length,
            cities: cities.map(city => ({
                name: city.name,
                fullName: city.fullName,
                country: city.country,
                state: city.state,
                type: city.type,
                coordinates: {
                    latitude: city.latitude,
                    longitude: city.longitude
                },
                ...(shouldIncludeWeather && weatherData[city.name] && {
                    weather: weatherData[city.name]
                })
            }))
        });

    } catch (err) {
        next(err);
    }
};

// Helper function to get continent descriptions
const getContinentDescription = (continent) => {
    const descriptions = {
        "europe": "The continent of Europe with rich history, diverse cultures, and beautiful landscapes",
        "asia": "The largest continent with ancient civilizations, modern cities, and diverse cultures",
        "middle east": "The crossroads of Asia, Africa, and Europe with rich history and cultural heritage",
        "africa": "The cradle of humanity with diverse landscapes, wildlife, and vibrant cultures",
        "oceania": "The island continent with unique ecosystems, indigenous cultures, and stunning natural beauty"
    };
    return descriptions[continent] || "Travel destinations across the continent";
};

module.exports = { 
    searchByContinent, 
    getAllContinents, 
    getCountriesByContinent,
    getCitiesByContinent
};