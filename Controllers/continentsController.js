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

// Hardcoded country images mapping
const COUNTRY_IMAGES = {
    // Europe
    "France": "https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg",
    "Germany": "https://images.pexels.com/photos/161849/cologne-dom-night-architecture-161849.jpeg",
    "Italy": "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg",
    "Spain": "https://images.pexels.com/photos/3757144/pexels-photo-3757144.jpeg",
    "United Kingdom": "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg",
    "Netherlands": "https://images.pexels.com/photos/2031706/pexels-photo-2031706.jpeg",
    "Belgium": "https://images.pexels.com/photos/208246/pexels-photo-208246.jpeg",
    "Switzerland": "https://images.pexels.com/photos/773471/pexels-photo-773471.jpeg",
    "Austria": "https://images.pexels.com/photos/1687122/pexels-photo-1687122.jpeg",
    "Sweden": "https://images.pexels.com/photos/2377441/pexels-photo-2377441.jpeg",
    "Norway": "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg",
    "Denmark": "https://images.pexels.com/photos/415722/pexels-photo-415722.jpeg",
    "Finland": "https://images.pexels.com/photos/2311602/pexels-photo-2311602.jpeg",
    "Poland": "https://images.pexels.com/photos/46273/pexels-photo-46273.jpeg",
    "Czech Republic": "https://images.pexels.com/photos/1269788/pexels-photo-1269788.jpeg",
    "Hungary": "https://images.pexels.com/photos/53377/hungarian-parliament-night-budapest-hungary-53377.jpeg",
    "Romania": "https://images.pexels.com/photos/775482/pexels-photo-775482.jpeg",
    "Bulgaria": "https://cdn.pixabay.com/photo/2018/09/06/18/30/sofia-3658934_1280.jpg",
    "Greece": "https://cdn.pixabay.com/photo/2022/10/05/05/40/sunset-7499759_1280.jpg",
    "Portugal": "https://cdn.pixabay.com/photo/2023/09/22/11/10/lisbon-8268841_1280.jpg",
    "Ireland": "https://cdn.pixabay.com/photo/2017/07/26/18/50/lighthouse-2542726_1280.jpg",
    
    // Asia
    "China": "https://images.pexels.com/photos/745243/pexels-photo-745243.jpeg",
    "Japan": "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg",
    "South Korea": "https://images.pexels.com/photos/373290/pexels-photo-373290.jpeg",
    "India": "https://images.pexels.com/photos/62348/pexels-photo-62348.jpeg",
    "Thailand": "https://images.pexels.com/photos/208444/pexels-photo-208444.jpeg",
    "Vietnam": "https://images.pexels.com/photos/2181111/pexels-photo-2181111.jpeg",
    "Indonesia": "https://images.pexels.com/photos/2116719/pexels-photo-2116719.jpeg",
    "Malaysia": "https://images.pexels.com/photos/22804/pexels-photo.jpg",
    "Singapore": "https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg",
    "Philippines": "https://images.pexels.com/photos/9394657/pexels-photo-9394657.jpeg",
    "Bangladesh": "https://images.pexels.com/photos/33434111/pexels-photo-33434111.jpeg",
    "Pakistan": "https://cdn.pixabay.com/photo/2022/04/18/19/53/travel-7141487_1280.jpg",
    "Sri Lanka": "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg",
    "Nepal": "https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg",
    "Myanmar": "https://images.pexels.com/photos/2643896/pexels-photo-2643896.jpeg",
    "Cambodia": "https://images.pexels.com/photos/3217663/pexels-photo-3217663.jpeg",
    "Laos": "https://images.pexels.com/photos/924631/pexels-photo-924631.jpeg",
    "Mongolia": "https://images.pexels.com/photos/5275365/pexels-photo-5275365.jpeg",
    "Kazakhstan": "https://images.pexels.com/photos/2475746/pexels-photo-2475746.jpeg",
    "Uzbekistan": "https://images.pexels.com/photos/19439197/pexels-photo-19439197.jpeg",
    
    // Middle East
    "Saudi Arabia": "https://images.pexels.com/photos/17049069/pexels-photo-17049069.jpeg",
    "United Arab Emirates": "https://images.pexels.com/photos/823696/pexels-photo-823696.jpeg",
    "Israel": "https://images.pexels.com/photos/2087387/pexels-photo-2087387.jpeg",
    "Turkey": "https://images.pexels.com/photos/2048865/pexels-photo-2048865.jpeg",
    "Iran": "https://images.pexels.com/photos/3799176/pexels-photo-3799176.jpeg",
    "Iraq": "https://images.pexels.com/photos/17340981/pexels-photo-17340981.jpeg",
    "Jordan": "https://images.pexels.com/photos/5484805/pexels-photo-5484805.jpeg",
    "Lebanon": "https://images.pexels.com/photos/3610377/pexels-photo-3610377.jpeg",
    "Syria": "https://images.pexels.com/photos/29768588/pexels-photo-29768588.jpeg",
    "Kuwait": "https://images.pexels.com/photos/1718259/pexels-photo-1718259.jpeg",
    "Qatar": "https://images.pexels.com/photos/3069345/pexels-photo-3069345.jpeg",
    "Bahrain": "https://images.pexels.com/photos/1438830/pexels-photo-1438830.jpeg",
    "Oman": "https://images.pexels.com/photos/5035569/pexels-photo-5035569.jpeg",
    "Yemen": "https://images.pexels.com/photos/29401958/pexels-photo-29401958.jpeg",
    
    // Africa
    "Egypt": "https://images.pexels.com/photos/1369212/pexels-photo-1369212.jpeg",
    "South Africa": "https://images.pexels.com/photos/51809/pexels-photo-51809.jpeg",
    "Nigeria": "https://images.pexels.com/photos/3172830/pexels-photo-3172830.jpeg",
    "Kenya": "https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg",
    "Morocco": "https://images.pexels.com/photos/3581916/pexels-photo-3581916.jpeg",
    "Tunisia": "https://images.pexels.com/photos/891125/pexels-photo-891125.jpeg",
    "Algeria": "https://images.pexels.com/photos/719771/pexels-photo-719771.jpeg",
    "Ethiopia": "https://images.pexels.com/photos/33337903/pexels-photo-33337903.jpeg",
    "Ghana": "https://images.pexels.com/photos/2787815/pexels-photo-2787815.jpeg",
    "Tanzania": "https://images.pexels.com/photos/2862070/pexels-photo-2862070.jpeg",
    "Uganda": "https://images.pexels.com/photos/2640454/pexels-photo-2640454.jpeg",
    "Rwanda": "https://images.pexels.com/photos/19827348/pexels-photo-19827348.jpeg",
    "Botswana": "https://images.pexels.com/photos/4003466/pexels-photo-4003466.jpeg",
    "Namibia": "https://images.pexels.com/photos/80454/tree-desert-namibia-dead-vlei-80454.jpeg",
    "Zimbabwe": "https://images.pexels.com/photos/23232512/pexels-photo-23232512.jpeg",
    "Zambia": "https://images.pexels.com/photos/1109905/pexels-photo-1109905.jpeg",
    "Senegal": "https://images.pexels.com/photos/16562982/pexels-photo-16562982.jpeg",
    "Ivory Coast": "https://images.pexels.com/photos/7381784/pexels-photo-7381784.jpeg",
    "Cameroon": "https://images.pexels.com/photos/17290990/pexels-photo-17290990.jpeg",
    "Angola": "https://images.pexels.com/photos/2767923/pexels-photo-2767923.jpeg",
    
    // Oceania
    "Australia": "https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg",
    "New Zealand": "https://images.pexels.com/photos/1260512/pexels-photo-1260512.jpeg",
    "Fiji": "https://images.pexels.com/photos/25068627/pexels-photo-25068627.jpeg",
    "Papua New Guinea": "https://images.pexels.com/photos/31235875/pexels-photo-31235875.jpeg",
    "Solomon Islands": "https://images.pexels.com/photos/29643273/pexels-photo-29643273.jpeg",
    "Vanuatu": "https://images.pexels.com/photos/9482126/pexels-photo-9482126.jpeg",
    "Samoa": "https://images.pexels.com/photos/19844887/pexels-photo-19844887.jpeg",
    "Tonga": "https://images.pexels.com/photos/4666750/pexels-photo-4666750.jpeg",
    "Kiribati": "https://images.pexels.com/photos/8828452/pexels-photo-8828452.jpeg",
    "Tuvalu": "https://cdn.pixabay.com/photo/2014/07/04/17/26/sea-384055_1280.jpg",
    "Nauru": "https://cdn.pixabay.com/photo/2013/07/13/14/16/nauru-162369_1280.png",
    "Palau": "https://cdn.pixabay.com/photo/2013/08/23/22/52/canal-175133_1280.jpg",
    "Marshall Islands": "https://cdn.pixabay.com/photo/2015/11/27/03/26/marshall-islands-1064876_1280.jpg"
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
        const { continent, limit = 12, includeWeather = false } = req.query;

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

        // Get countries information
        const countriesPromises = continentData.countries.slice(0, limitNum).map(async (countryName) => {
            const countryInfo = await getCountryInfo(countryName);
            
            // Add hardcoded image
            return {
                ...countryInfo,
                image: COUNTRY_IMAGES[countryName] || countryInfo?.flag || 'https://via.placeholder.com/800x600/CCCCCC/ffffff?text=No+Image'
            };
        });

        const countries = (await Promise.all(countriesPromises)).filter(Boolean);

        // Get Wikipedia description for the continent
        const wikipediaInfo = await getWikipediaDescription(normalizedContinent);

        // Format response
        const response = {
            searchParams: {
                continent: continent,
                limit: limitNum,
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
                        image: country.image, // Hardcoded image
                        flag: country.flag    // API flag
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
            
            // Add hardcoded image
            return {
                ...countryInfo,
                image: COUNTRY_IMAGES[countryName] || countryInfo?.flag || 'https://via.placeholder.com/800x600/CCCCCC/ffffff?text=No+Image'
            };
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
                image: country.image, // Hardcoded image
                flag: country.flag,   // API flag
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