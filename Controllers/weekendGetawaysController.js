const fetch = require("node-fetch");

// Geoapify API for weekend getaways data
const APIS = {
    // Geoapify APIs
    GEOCODING: "https://api.geoapify.com/v1/geocode/search",
    PLACES: "https://api.geoapify.com/v2/places",
    WEATHER: "https://api.openweathermap.org/data/2.5/weather",
    WIKIPEDIA: "https://en.wikipedia.org/api/rest_v1/page/summary"
};

// Geoapify API Key
const GEOAPIFY_API_KEY = "0e3bca515bea4d978e253b28c7ce3ffc";

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

// Most visited Indian destinations data
const POPULAR_DESTINATIONS = [
    {
        id: "taj_mahal",
        name: "Taj Mahal",
        description: "Iconic white marble mausoleum and UNESCO World Heritage Site",
        category: "historical places",
        source: "sample",
        latitude: 27.1751,
        longitude: 78.0421,
        image: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg",
        region: "Uttar Pradesh",
        highlights: ["UNESCO World Heritage", "Mughal Architecture", "Symbol of Love", "Marble Inlay Work"],
        budget: "₹2000-5000 per day",
        idealFor: ["History Lovers", "Couples", "Families", "Photographers"],
        bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        thingsToDo: ["Taj Mahal Visit", "Agra Fort Tour", "Fatehpur Sikri", "Local Cuisine"],
        travelTime: "3-4 hours from Delhi",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Taj_Mahal",
        visitorsPerYear: "7-8 million"
    },
    {
        id: "goa_beaches",
        name: "Goa",
        description: "Famous beach destination with Portuguese heritage and vibrant nightlife",
        category: "beach destinations",
        source: "sample",
        latitude: 15.2993,
        longitude: 74.1240,
        image: "https://images.pexels.com/photos/5870526/pexels-photo-5870526.jpeg",
        region: "Goa",
        highlights: ["Beaches", "Portuguese Heritage", "Nightlife", "Water Sports"],
        budget: "₹4000-12000 per day",
        idealFor: ["Party Lovers", "Couples", "Friends", "Beach Lovers"],
        bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
        thingsToDo: ["Beach Hopping", "Water Sports", "Heritage Tours", "Nightlife"],
        travelTime: "2-3 hours from Mumbai",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Goa",
        visitorsPerYear: "6-7 million"
    },
    {
        id: "kerala_backwaters",
        name: "Kerala Backwaters",
        description: "Serene network of lagoons, lakes and canals with houseboat cruises",
        category: "beach destinations",
        source: "sample",
        latitude: 9.4981,
        longitude: 76.3388,
        image: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg",
        region: "Kerala",
        highlights: ["Houseboats", "Backwaters", "Ayurveda", "Spice Plantations"],
        budget: "₹3000-8000 per day",
        idealFor: ["Nature Lovers", "Couples", "Wellness Seekers", "Adventure Seekers"],
        bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        thingsToDo: ["Houseboat Cruise", "Ayurvedic Massage", "Spice Tour", "Beach Visit"],
        travelTime: "2-3 hours from Kochi",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Kerala_backwaters",
        visitorsPerYear: "5-6 million"
    },
    {
        id: "rajasthan_palaces",
        name: "Rajasthan",
        description: "Land of kings with magnificent palaces, forts and desert landscapes",
        category: "historical places",
        source: "sample",
        latitude: 26.9124,
        longitude: 75.7873,
        image: "https://images.pexels.com/photos/11750442/pexels-photo-11750442.jpeg",
        region: "Rajasthan",
        highlights: ["Palaces", "Forts", "Desert", "Royal Heritage"],
        budget: "₹2500-8000 per day",
        idealFor: ["History Lovers", "Culture Enthusiasts", "Families", "Photographers"],
        bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        thingsToDo: ["Palace Tours", "Desert Safari", "Cultural Shows", "Shopping"],
        travelTime: "5-6 hours from Delhi",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Rajasthan",
        visitorsPerYear: "4-5 million"
    },
    {
        id: "kashmir_valley",
        name: "Kashmir Valley",
        description: "Paradise on Earth with stunning mountain landscapes and lakes",
        category: "hill stations",
        source: "sample",
        latitude: 34.0837,
        longitude: 74.7973,
        image: "https://images.pexels.com/photos/19975733/pexels-photo-19975733.jpeg",
        region: "Jammu & Kashmir",
        highlights: ["Dal Lake", "Gulmarg", "Pahalgam", "Mountain Views"],
        budget: "₹3000-8000 per day",
        idealFor: ["Nature Lovers", "Adventure Seekers", "Couples", "Photographers"],
        bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
        thingsToDo: ["Shikara Ride", "Skiing", "Trekking", "Photography"],
        travelTime: "1-2 hours from Srinagar",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Kashmir_Valley",
        visitorsPerYear: "3-4 million"
    },
    {
        id: "varanasi_ghats",
        name: "Varanasi",
        description: "Spiritual capital of India with ancient ghats and temples",
        category: "religious places",
        source: "sample",
        latitude: 25.3176,
        longitude: 82.9739,
        image: "https://images.pexels.com/photos/21524764/pexels-photo-21524764.jpeg",
        region: "Uttar Pradesh",
        highlights: ["Ganga Aarti", "Ghats", "Temples", "Spiritual Experience"],
        budget: "₹1500-4000 per day",
        idealFor: ["Spiritual Seekers", "Pilgrims", "Culture Enthusiasts", "Photographers"],
        bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        thingsToDo: ["Ganga Aarti", "Temple Visits", "Boat Rides", "Meditation"],
        travelTime: "8-10 hours from Delhi",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Varanasi",
        visitorsPerYear: "3-4 million"
    }
];

// Legacy sample data for backward compatibility
const SAMPLE_DESTINATIONS = {
    "hill stations": [
        {
            id: "nainital",
            name: "Nainital",
            description: "Lake surrounded by hills",
            weekendType: "hill stations",
            source: "sample",
            latitude: 29.3919,
            longitude: 79.4542,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Uttarakhand",
            highlights: ["Naini Lake", "Naina Devi Temple", "Snow View Point", "Tiffin Top"],
            budget: "₹3000-8000 per day",
            idealFor: ["Couples", "Families", "Nature Lovers"],
            bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
            thingsToDo: ["Naini Lake Boating", "Naina Devi Temple", "Cable Car Ride", "Shopping"],
            travelTime: "7-8 hours from Delhi",
            distanceFromCity: 320,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Nainital"
        },
        {
            id: "manali",
            name: "Manali",
            description: "Adventure capital of Himachal Pradesh",
            weekendType: "hill stations",
            source: "sample",
            latitude: 32.2396,
            longitude: 77.1887,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
            region: "Himachal Pradesh",
            highlights: ["Rohtang Pass", "Solang Valley", "Hadimba Temple", "Old Manali"],
            budget: "₹2500-7000 per day",
            idealFor: ["Adventure Seekers", "Couples", "Friends"],
            bestMonths: ["Mar", "Apr", "May", "Jun", "Sep", "Oct"],
            thingsToDo: ["Paragliding", "River Rafting", "Skiing", "Trekking"],
            travelTime: "12-14 hours from Delhi",
            distanceFromCity: 520,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Manali,_Himachal_Pradesh"
        },
        {
            id: "shimla",
            name: "Shimla",
            description: "Queen of Hills",
            weekendType: "hill stations",
            source: "sample",
            latitude: 31.1048,
            longitude: 77.1734,
            image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400",
            region: "Himachal Pradesh",
            highlights: ["The Ridge", "Mall Road", "Kufri", "Jakhu Temple"],
            budget: "₹2000-6000 per day",
            idealFor: ["Families", "Couples", "History Buffs"],
            bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
            thingsToDo: ["Toy Train Ride", "Shopping", "Temple Visit", "Scenic Walks"],
            travelTime: "8-10 hours from Delhi",
            distanceFromCity: 350,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Shimla"
        },
        {
            id: "mussourie",
            name: "Mussoorie",
            description: "Queen of the Hills with panoramic views",
            weekendType: "hill stations",
            source: "sample",
            latitude: 30.4598,
            longitude: 78.0644,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Uttarakhand",
            highlights: ["Gun Hill", "Kempty Falls", "Camel's Back Road", "Lal Tibba"],
            budget: "₹2500-6000 per day",
            idealFor: ["Families", "Couples", "Nature Lovers"],
            bestMonths: ["Mar", "Apr", "May", "Jun", "Sep", "Oct"],
            thingsToDo: ["Cable Car Ride", "Waterfall Visit", "Shopping", "Scenic Walks"],
            travelTime: "6-7 hours from Delhi",
            distanceFromCity: 280,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Mussoorie"
        },
        {
            id: "ooty",
            name: "Ooty",
            description: "Nilgiri Hills beauty with tea gardens",
            weekendType: "hill stations",
            source: "sample",
            latitude: 11.4102,
            longitude: 76.6950,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Tamil Nadu",
            highlights: ["Ooty Lake", "Botanical Gardens", "Tea Gardens", "Doddabetta Peak"],
            budget: "₹3000-7000 per day",
            idealFor: ["Families", "Nature Lovers", "Tea Enthusiasts"],
            bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
            thingsToDo: ["Boat Ride", "Tea Tasting", "Garden Tour", "Toy Train"],
            travelTime: "8-10 hours from Bangalore",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Ooty"
        },
        {
            id: "lonavala",
            name: "Lonavala",
            description: "Hill station near Mumbai with waterfalls",
            weekendType: "hill stations",
            source: "sample",
            latitude: 18.7500,
            longitude: 73.4000,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Maharashtra",
            highlights: ["Tiger's Leap", "Bushy Dam", "Karla Caves", "Bhushi Dam"],
            budget: "₹2000-5000 per day",
            idealFor: ["Families", "Couples", "Nature Lovers"],
            bestMonths: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
            thingsToDo: ["Waterfall Visit", "Cave Exploration", "Dam Visit", "Scenic Walks"],
            travelTime: "2-3 hours from Mumbai",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Lonavala"
        },
        {
            id: "mahabaleshwar",
            name: "Mahabaleshwar",
            description: "Strawberry capital and hill station",
            weekendType: "hill stations",
            source: "sample",
            latitude: 17.9167,
            longitude: 73.6667,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Maharashtra",
            highlights: ["Strawberry Farms", "Pratapgad Fort", "Venna Lake", "Wilson Point"],
            budget: "₹2500-6000 per day",
            idealFor: ["Families", "Couples", "Nature Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Strawberry Picking", "Lake Boating", "Fort Visit", "Scenic Walks"],
            travelTime: "4-5 hours from Mumbai",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Mahabaleshwar"
        },
        {
            id: "kodaikanal",
            name: "Kodaikanal",
            description: "Princess of Hill Stations with beautiful lakes",
            weekendType: "hill stations",
            source: "sample",
            latitude: 10.2381,
            longitude: 77.4892,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Tamil Nadu",
            highlights: ["Kodaikanal Lake", "Coaker's Walk", "Pillar Rocks", "Silver Cascade"],
            budget: "₹3000-7000 per day",
            idealFor: ["Families", "Couples", "Nature Lovers"],
            bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
            thingsToDo: ["Lake Boating", "Nature Walks", "Waterfall Visit", "Shopping"],
            travelTime: "6-7 hours from Chennai",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Kodaikanal"
        },
        {
            id: "darjeeling",
            name: "Darjeeling",
            description: "Tea gardens and Himalayan views",
            weekendType: "hill stations",
            source: "sample",
            latitude: 27.0360,
            longitude: 88.2627,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "West Bengal",
            highlights: ["Tiger Hill", "Tea Gardens", "Darjeeling Himalayan Railway", "Peace Pagoda"],
            budget: "₹2500-6000 per day",
            idealFor: ["Families", "Tea Lovers", "Nature Enthusiasts"],
            bestMonths: ["Mar", "Apr", "May", "Sep", "Oct", "Nov"],
            thingsToDo: ["Tea Tasting", "Toy Train Ride", "Sunrise View", "Garden Tour"],
            travelTime: "3-4 hours from Siliguri",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Darjeeling"
        },
        {
            id: "gangtok",
            name: "Gangtok",
            description: "Capital of Sikkim with mountain views",
            weekendType: "hill stations",
            source: "sample",
            latitude: 27.3314,
            longitude: 88.6138,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Sikkim",
            highlights: ["MG Marg", "Rumtek Monastery", "Tsomgo Lake", "Nathula Pass"],
            budget: "₹3000-8000 per day",
            idealFor: ["Adventure Seekers", "Nature Lovers", "Spiritual Seekers"],
            bestMonths: ["Mar", "Apr", "May", "Sep", "Oct", "Nov"],
            thingsToDo: ["Monastery Visit", "Lake Tour", "Shopping", "Mountain Views"],
            travelTime: "4-5 hours from Bagdogra",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Gangtok"
        },
        {
            id: "kasauli",
            name: "Kasauli",
            description: "Quaint hill station with colonial charm",
            weekendType: "hill stations",
            source: "sample",
            latitude: 30.9000,
            longitude: 76.9667,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Himachal Pradesh",
            highlights: ["Monkey Point", "Sunset Point", "Christ Church", "Gilbert Trail"],
            budget: "₹2000-5000 per day",
            idealFor: ["Couples", "Families", "Peace Seekers"],
            bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
            thingsToDo: ["Nature Walks", "Sunset Viewing", "Church Visit", "Shopping"],
            travelTime: "5-6 hours from Delhi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Kasauli"
        },
        {
            id: "mcleodganj",
            name: "McLeod Ganj",
            description: "Little Lhasa with Tibetan culture",
            weekendType: "hill stations",
            source: "sample",
            latitude: 32.2396,
            longitude: 76.3234,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Himachal Pradesh",
            highlights: ["Tsuglagkhang Temple", "Tibet Museum", "Triund Trek", "Bhagsu Falls"],
            budget: "₹2000-5000 per day",
            idealFor: ["Spiritual Seekers", "Adventure Enthusiasts", "Culture Lovers"],
            bestMonths: ["Mar", "Apr", "May", "Sep", "Oct", "Nov"],
            thingsToDo: ["Temple Visit", "Trekking", "Waterfall Visit", "Tibetan Food"],
            travelTime: "12-14 hours from Delhi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/McLeod_Ganj"
        },
        {
            id: "khandala",
            name: "Khandala",
            description: "Scenic hill station near Mumbai",
            weekendType: "hill stations",
            source: "sample",
            latitude: 18.7500,
            longitude: 73.3833,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Maharashtra",
            highlights: ["Tiger's Leap", "Karla Caves", "Bushy Dam", "Rajmachi Fort"],
            budget: "₹1500-4000 per day",
            idealFor: ["Families", "Couples", "Nature Lovers"],
            bestMonths: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
            thingsToDo: ["Waterfall Visit", "Cave Exploration", "Dam Visit", "Fort Tour"],
            travelTime: "2-3 hours from Mumbai",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Khandala"
        },
        {
            id: "matheran",
            name: "Matheran",
            description: "Vehicle-free hill station with toy train",
            weekendType: "hill stations",
            source: "sample",
            latitude: 18.9833,
            longitude: 73.2667,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Maharashtra",
            highlights: ["Toy Train", "Charlotte Lake", "Echo Point", "Panorama Point"],
            budget: "₹2000-5000 per day",
            idealFor: ["Families", "Couples", "Nature Lovers"],
            bestMonths: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
            thingsToDo: ["Toy Train Ride", "Lake Visit", "Nature Walks", "Echo Point"],
            travelTime: "2-3 hours from Mumbai",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Matheran"
        },
        {
            id: "coonoor",
            name: "Coonoor",
            description: "Tea gardens and Nilgiri beauty",
            weekendType: "hill stations",
            source: "sample",
            latitude: 11.3500,
            longitude: 76.8000,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Tamil Nadu",
            highlights: ["Sim's Park", "Dolphin's Nose", "Lamb's Rock", "Tea Gardens"],
            budget: "₹2500-6000 per day",
            idealFor: ["Families", "Nature Lovers", "Tea Enthusiasts"],
            bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
            thingsToDo: ["Tea Tasting", "Garden Tour", "Nature Walks", "Scenic Views"],
            travelTime: "7-8 hours from Bangalore",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Coonoor"
        }
    ],
    "beach destinations": [
        {
            id: "goa",
            name: "Goa",
            description: "Beach paradise with vibrant nightlife",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 15.2993,
            longitude: 74.1240,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "Goa",
            highlights: ["Baga Beach", "Anjuna Beach", "Old Goa", "Dudhsagar Falls"],
            budget: "₹4000-12000 per day",
            idealFor: ["Party Lovers", "Couples", "Friends"],
            bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Beach Hopping", "Water Sports", "Nightlife", "Heritage Tours"],
            travelTime: "2-3 hours from Mumbai",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Goa"
        },
        {
            id: "pondicherry",
            name: "Pondicherry",
            description: "French colonial charm by the sea",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 11.9139,
            longitude: 79.8145,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            region: "Puducherry",
            highlights: ["Promenade Beach", "Auroville", "French Quarter", "Sri Aurobindo Ashram"],
            budget: "₹2500-6000 per day",
            idealFor: ["Couples", "Solo Travelers", "Spiritual Seekers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Beach Walks", "Cycling", "Meditation", "Heritage Tours"],
            travelTime: "3-4 hours from Chennai",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Puducherry"
        },
        {
            id: "alleppey",
            name: "Alleppey",
            description: "Backwaters and houseboat paradise",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 9.4981,
            longitude: 76.3388,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "Kerala",
            highlights: ["Backwaters", "Houseboats", "Beaches", "Spice Plantations"],
            budget: "₹3000-8000 per day",
            idealFor: ["Couples", "Nature Lovers", "Adventure Seekers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Houseboat Cruise", "Backwater Tour", "Beach Visit", "Spice Tour"],
            travelTime: "2-3 hours from Kochi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Alappuzha"
        },
        {
            id: "puribeach",
            name: "Puri Beach",
            description: "Spiritual beach destination with golden sands",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 19.8069,
            longitude: 85.8318,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "Odisha",
            highlights: ["Puri Beach", "Jagannath Temple", "Konark Sun Temple", "Chilika Lake"],
            budget: "₹2000-5000 per day",
            idealFor: ["Spiritual Seekers", "Families", "Pilgrims"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Temple Visit", "Beach Walk", "Sun Temple Tour", "Lake Cruise"],
            travelTime: "1-2 hours from Bhubaneswar",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Puri"
        },
        {
            id: "kovalam",
            name: "Kovalam",
            description: "Famous beach destination in Kerala",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 8.4000,
            longitude: 76.9833,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "Kerala",
            highlights: ["Lighthouse Beach", "Hawa Beach", "Samudra Beach", "Ayurveda"],
            budget: "₹3000-8000 per day",
            idealFor: ["Families", "Couples", "Wellness Seekers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Beach Relaxation", "Ayurvedic Massage", "Lighthouse Visit", "Water Sports"],
            travelTime: "1-2 hours from Trivandrum",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Kovalam"
        },
        {
            id: "marinabeach",
            name: "Marina Beach",
            description: "Longest urban beach in India",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 13.0400,
            longitude: 80.2800,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "Tamil Nadu",
            highlights: ["Beach Walk", "Fort St. George", "Kapaleeshwarar Temple", "Shopping"],
            budget: "₹1500-4000 per day",
            idealFor: ["Families", "Couples", "City Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Beach Walk", "Temple Visit", "Shopping", "Fort Tour"],
            travelTime: "In Chennai city",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Marina_Beach"
        },
        {
            id: "gokarna",
            name: "Gokarna",
            description: "Spiritual beach town with pristine beaches",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 14.5500,
            longitude: 74.3167,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "Karnataka",
            highlights: ["Om Beach", "Kudle Beach", "Mahabaleshwar Temple", "Half Moon Beach"],
            budget: "₹2000-5000 per day",
            idealFor: ["Spiritual Seekers", "Backpackers", "Nature Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Temple Visit", "Beach Hopping", "Trekking", "Meditation"],
            travelTime: "6-7 hours from Bangalore",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Gokarna,_Karnataka"
        },
        {
            id: "digha",
            name: "Digha",
            description: "Popular beach destination near Kolkata",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 21.6167,
            longitude: 87.5167,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "West Bengal",
            highlights: ["Digha Beach", "New Digha", "Shankarpur Beach", "Tajpur Beach"],
            budget: "₹1500-4000 per day",
            idealFor: ["Families", "Couples", "Budget Travelers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Beach Relaxation", "Beach Hopping", "Local Food", "Shopping"],
            travelTime: "3-4 hours from Kolkata",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Digha"
        },
        {
            id: "juhubeach",
            name: "Juhu Beach",
            description: "Famous beach in Mumbai with street food",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 19.1000,
            longitude: 72.8167,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "Maharashtra",
            highlights: ["Beach Walk", "Street Food", "Sunset Views", "Entertainment"],
            budget: "₹1000-3000 per day",
            idealFor: ["Families", "Food Lovers", "City Dwellers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Street Food", "Beach Walk", "Sunset View", "Shopping"],
            travelTime: "In Mumbai city",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Juhu_Beach"
        },
        {
            id: "rameshwaram",
            name: "Rameshwaram",
            description: "Sacred beach destination with temples",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 9.2833,
            longitude: 79.3000,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "Tamil Nadu",
            highlights: ["Ramanathaswamy Temple", "Dhanushkodi Beach", "Adam's Bridge", "Pamban Bridge"],
            budget: "₹2000-5000 per day",
            idealFor: ["Spiritual Seekers", "Pilgrims", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Temple Visit", "Beach Visit", "Bridge Tour", "Pilgrimage"],
            travelTime: "6-7 hours from Chennai",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Rameswaram"
        },
        {
            id: "kanyakumari",
            name: "Kanyakumari",
            description: "Southernmost tip of India with sunrise/sunset views",
            weekendType: "beach destinations",
            source: "sample",
            latitude: 8.0833,
            longitude: 77.5500,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
            region: "Tamil Nadu",
            highlights: ["Sunrise/Sunset", "Vivekananda Rock", "Thiruvalluvar Statue", "Kanyakumari Temple"],
            budget: "₹2000-5000 per day",
            idealFor: ["Spiritual Seekers", "Nature Lovers", "Photographers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Sunrise View", "Temple Visit", "Rock Memorial", "Photography"],
            travelTime: "8-9 hours from Chennai",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Kanyakumari"
        }
    ],
    "historical places": [
        {
            id: "agra",
            name: "Agra",
            description: "Home to the magnificent Taj Mahal",
            weekendType: "historical places",
            source: "sample",
            latitude: 27.1767,
            longitude: 78.0081,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Uttar Pradesh",
            highlights: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Itmad-ud-Daulah"],
            budget: "₹2000-5000 per day",
            idealFor: ["History Lovers", "Couples", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Taj Mahal Visit", "Fort Tour", "Shopping", "Local Cuisine"],
            travelTime: "3-4 hours from Delhi",
            distanceFromCity: 200,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Agra"
        },
        {
            id: "jaipur",
            name: "Jaipur",
            description: "The Pink City with royal heritage",
            weekendType: "historical places",
            source: "sample",
            latitude: 26.9124,
            longitude: 75.7873,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Rajasthan",
            highlights: ["Amber Fort", "City Palace", "Hawa Mahal", "Jantar Mantar"],
            budget: "₹2500-6000 per day",
            idealFor: ["History Lovers", "Families", "Culture Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Fort Visits", "Palace Tours", "Shopping", "Cultural Shows"],
            travelTime: "5-6 hours from Delhi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Jaipur"
        },
        {
            id: "delhi",
            name: "Delhi",
            description: "Capital city with rich historical heritage",
            weekendType: "historical places",
            source: "sample",
            latitude: 28.6139,
            longitude: 77.2090,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Delhi",
            highlights: ["Red Fort", "Qutub Minar", "India Gate", "Lotus Temple"],
            budget: "₹2000-6000 per day",
            idealFor: ["History Lovers", "Families", "Culture Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Monument Tours", "Museum Visits", "Shopping", "Food Tours"],
            travelTime: "In Delhi city",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Delhi"
        },
        {
            id: "mumbai",
            name: "Mumbai",
            description: "Financial capital with colonial heritage",
            weekendType: "historical places",
            source: "sample",
            latitude: 19.0760,
            longitude: 72.8777,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Maharashtra",
            highlights: ["Gateway of India", "Elephanta Caves", "Chhatrapati Shivaji Terminus", "Marine Drive"],
            budget: "₹3000-8000 per day",
            idealFor: ["History Lovers", "City Explorers", "Culture Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Heritage Walks", "Cave Tours", "Shopping", "Food Tours"],
            travelTime: "In Mumbai city",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Mumbai"
        },
        {
            id: "kolkata",
            name: "Kolkata",
            description: "Cultural capital with colonial architecture",
            weekendType: "historical places",
            source: "sample",
            latitude: 22.5726,
            longitude: 88.3639,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "West Bengal",
            highlights: ["Victoria Memorial", "Howrah Bridge", "Indian Museum", "Dakshineswar Temple"],
            budget: "₹2000-5000 per day",
            idealFor: ["History Lovers", "Culture Enthusiasts", "Food Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Heritage Tours", "Museum Visits", "Food Tours", "Shopping"],
            travelTime: "In Kolkata city",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Kolkata"
        },
        {
            id: "chennai",
            name: "Chennai",
            description: "Gateway to South India with rich heritage",
            weekendType: "historical places",
            source: "sample",
            latitude: 13.0827,
            longitude: 80.2707,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Tamil Nadu",
            highlights: ["Fort St. George", "Kapaleeshwarar Temple", "Government Museum", "Marina Beach"],
            budget: "₹2000-5000 per day",
            idealFor: ["History Lovers", "Culture Enthusiasts", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Temple Visits", "Museum Tours", "Beach Walks", "Shopping"],
            travelTime: "In Chennai city",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Chennai"
        },
        {
            id: "bangalore",
            name: "Bangalore",
            description: "Garden City with historical monuments",
            weekendType: "historical places",
            source: "sample",
            latitude: 12.9716,
            longitude: 77.5946,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Karnataka",
            highlights: ["Bangalore Palace", "Tipu Sultan's Summer Palace", "Lalbagh Garden", "Cubbon Park"],
            budget: "₹2500-6000 per day",
            idealFor: ["History Lovers", "Nature Lovers", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Palace Tours", "Garden Visits", "Park Walks", "Shopping"],
            travelTime: "In Bangalore city",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Bangalore"
        },
        {
            id: "hyderabad",
            name: "Hyderabad",
            description: "City of Pearls with royal heritage",
            weekendType: "historical places",
            source: "sample",
            latitude: 17.3850,
            longitude: 78.4867,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Telangana",
            highlights: ["Charminar", "Golconda Fort", "Qutub Shahi Tombs", "Chowmahalla Palace"],
            budget: "₹2000-5000 per day",
            idealFor: ["History Lovers", "Culture Enthusiasts", "Food Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Fort Tours", "Palace Visits", "Food Tours", "Shopping"],
            travelTime: "In Hyderabad city",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Hyderabad"
        },
        {
            id: "mysore",
            name: "Mysore",
            description: "City of Palaces with royal grandeur",
            weekendType: "historical places",
            source: "sample",
            latitude: 12.2958,
            longitude: 76.6394,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Karnataka",
            highlights: ["Mysore Palace", "Chamundi Hills", "St. Philomena's Cathedral", "Mysore Zoo"],
            budget: "₹2000-5000 per day",
            idealFor: ["History Lovers", "Families", "Culture Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Palace Tours", "Temple Visits", "Zoo Visit", "Shopping"],
            travelTime: "3-4 hours from Bangalore",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Mysore"
        },
        {
            id: "hampi",
            name: "Hampi",
            description: "UNESCO World Heritage site with ancient ruins",
            weekendType: "historical places",
            source: "sample",
            latitude: 15.3350,
            longitude: 76.4600,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Karnataka",
            highlights: ["Virupaksha Temple", "Hampi Bazaar", "Vittala Temple", "Lotus Mahal"],
            budget: "₹1500-4000 per day",
            idealFor: ["History Lovers", "Archaeology Enthusiasts", "Photographers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Temple Tours", "Ruins Exploration", "Photography", "Cycling"],
            travelTime: "6-7 hours from Bangalore",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Hampi"
        },
        {
            id: "khajuraho",
            name: "Khajuraho",
            description: "UNESCO site with ancient temples and sculptures",
            weekendType: "historical places",
            source: "sample",
            latitude: 24.8500,
            longitude: 79.9333,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Madhya Pradesh",
            highlights: ["Kandariya Mahadev Temple", "Lakshmana Temple", "Chitragupta Temple", "Sound and Light Show"],
            budget: "₹2000-5000 per day",
            idealFor: ["History Lovers", "Art Enthusiasts", "Culture Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Temple Tours", "Sculpture Viewing", "Light Show", "Museum Visit"],
            travelTime: "6-7 hours from Delhi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Khajuraho"
        },
        {
            id: "fatehpur",
            name: "Fatehpur Sikri",
            description: "Mughal capital with red sandstone architecture",
            weekendType: "historical places",
            source: "sample",
            latitude: 27.0937,
            longitude: 77.6600,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Uttar Pradesh",
            highlights: ["Buland Darwaza", "Jama Masjid", "Panch Mahal", "Diwan-i-Khas"],
            budget: "₹1500-4000 per day",
            idealFor: ["History Lovers", "Architecture Enthusiasts", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Monument Tours", "Architecture Viewing", "Photography", "Guided Tours"],
            travelTime: "4-5 hours from Delhi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Fatehpur_Sikri"
        }
    ],
    "adventure spots": [
        {
            id: "rishikesh",
            name: "Rishikesh",
            description: "Yoga capital and adventure hub",
            weekendType: "adventure spots",
            source: "sample",
            latitude: 30.0869,
            longitude: 78.2676,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
            region: "Uttarakhand",
            highlights: ["River Rafting", "Bungee Jumping", "Yoga Ashrams", "Laxman Jhula"],
            budget: "₹2000-5000 per day",
            idealFor: ["Adventure Seekers", "Yoga Enthusiasts", "Spiritual Seekers"],
            bestMonths: ["Mar", "Apr", "May", "Sep", "Oct", "Nov"],
            thingsToDo: ["River Rafting", "Bungee Jumping", "Yoga Classes", "Temple Visits"],
            travelTime: "6-7 hours from Delhi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Rishikesh"
        },
        {
            id: "coorg",
            name: "Coorg",
            description: "Coffee plantations and adventure activities",
            weekendType: "adventure spots",
            source: "sample",
            latitude: 12.3375,
            longitude: 75.8069,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
            region: "Karnataka",
            highlights: ["Coffee Plantations", "Trekking", "Waterfalls", "Wildlife"],
            budget: "₹3000-7000 per day",
            idealFor: ["Adventure Seekers", "Nature Lovers", "Coffee Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Coffee Tour", "Trekking", "Waterfall Visit", "Wildlife Safari"],
            travelTime: "5-6 hours from Bangalore",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Kodagu"
        },
        {
            id: "munnar",
            name: "Munnar",
            description: "Tea gardens and hill station adventure",
            weekendType: "adventure spots",
            source: "sample",
            latitude: 10.0889,
            longitude: 77.0595,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
            region: "Kerala",
            highlights: ["Tea Gardens", "Eravikulam National Park", "Waterfalls", "Trekking"],
            budget: "₹2500-6000 per day",
            idealFor: ["Nature Lovers", "Adventure Seekers", "Tea Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Tea Plantation Tour", "Trekking", "Wildlife Safari", "Waterfall Visit"],
            travelTime: "4-5 hours from Kochi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Munnar"
        }
    ],
    "religious places": [
        {
            id: "varanasi",
            name: "Varanasi",
            description: "Spiritual capital of India",
            weekendType: "religious places",
            source: "sample",
            latitude: 25.3176,
            longitude: 82.9739,
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            region: "Uttar Pradesh",
            highlights: ["Ganga Aarti", "Kashi Vishwanath Temple", "Sarnath", "Ghats"],
            budget: "₹1500-4000 per day",
            idealFor: ["Spiritual Seekers", "Pilgrims", "Culture Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Ganga Aarti", "Temple Visits", "Boat Rides", "Meditation"],
            travelTime: "8-10 hours from Delhi",
            distanceFromCity: 800,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Varanasi"
        }
    ],
    "wildlife sanctuaries": [
        {
            id: "corbett",
            name: "Jim Corbett National Park",
            description: "Tiger reserve and wildlife sanctuary",
            weekendType: "wildlife sanctuaries",
            source: "sample",
            latitude: 29.5328,
            longitude: 78.9667,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
            region: "Uttarakhand",
            highlights: ["Tiger Spotting", "Safari Rides", "Bird Watching", "Nature Trails"],
            budget: "₹3000-8000 per day",
            idealFor: ["Wildlife Enthusiasts", "Nature Lovers", "Photographers"],
            bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
            thingsToDo: ["Safari Rides", "Bird Watching", "Nature Photography", "Trekking"],
            travelTime: "6-7 hours from Delhi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Jim_Corbett_National_Park"
        },
        {
            id: "bandipur",
            name: "Bandipur National Park",
            description: "Tiger and elephant reserve in Karnataka",
            weekendType: "wildlife sanctuaries",
            source: "sample",
            latitude: 11.6667,
            longitude: 76.6167,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
            region: "Karnataka",
            highlights: ["Tiger Spotting", "Elephant Safari", "Bird Watching", "Nature Trails"],
            budget: "₹2500-6000 per day",
            idealFor: ["Wildlife Enthusiasts", "Nature Lovers", "Photographers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Safari Rides", "Bird Watching", "Nature Photography", "Trekking"],
            travelTime: "3-4 hours from Bangalore",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Bandipur_National_Park"
        },
        {
            id: "periyar",
            name: "Periyar National Park",
            description: "Elephant and tiger reserve in Kerala",
            weekendType: "wildlife sanctuaries",
            source: "sample",
            latitude: 9.4667,
            longitude: 77.1333,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
            region: "Kerala",
            highlights: ["Elephant Spotting", "Boat Safari", "Bird Watching", "Spice Plantations"],
            budget: "₹2000-5000 per day",
            idealFor: ["Wildlife Enthusiasts", "Nature Lovers", "Adventure Seekers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Boat Safari", "Elephant Spotting", "Spice Tour", "Trekking"],
            travelTime: "4-5 hours from Kochi",
            wikipediaUrl: "https://en.wikipedia.org/wiki/Periyar_National_Park"
        }
    ]
};

// Helper function to get city coordinates using Geoapify API
const getCityCoordinates = async (cityName) => {
    try {
        const response = await fetch(`${APIS.GEOCODING}?text=${encodeURIComponent(cityName)}&apiKey=${GEOAPIFY_API_KEY}&limit=1&filter=countrycode:in`);
        const data = await response.json();
        
        if (data && data.features && data.features.length > 0) {
            const feature = data.features[0];
            return {
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0],
                displayName: feature.properties.formatted,
                country: feature.properties.country || "India"
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching city coordinates from Geoapify:', error);
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

// Fetch places from Geoapify API
const fetchPlacesFromGeoapify = async (lat, lon, weekendType, radius = 50000) => {
    try {
        const typeMapping = WEEKEND_TYPES[weekendType];
        if (!typeMapping) return [];

        const places = [];
        const radiusInKm = Math.round(radius / 1000);
        
        // Geoapify categories mapping
        const geoapifyCategories = {
            "hill stations": ["tourism.hill_station", "natural.mountain", "tourism.attraction", "leisure.park"],
            "beach destinations": ["beach", "tourism.attraction", "leisure.park"],
            "historical places": ["tourism.attraction", "historic", "tourism.museum"],
            "adventure spots": ["leisure.park", "tourism.attraction", "sport"],
            "religious places": ["religion", "tourism.attraction"],
            "wildlife sanctuaries": ["tourism.zoo", "leisure.park", "natural"]
        };

        const searchCategories = geoapifyCategories[weekendType] || ["tourism.attraction"];
        
        for (const category of searchCategories) {
            try {
                const url = `${APIS.PLACES}?categories=${category}&filter=circle:${lon},${lat},${radiusInKm}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
                console.log(`Geoapify URL: ${url}`);
                
                const response = await fetch(url);
                const data = await response.json();
                
                console.log(`\n=== GEOAPIFY RAW DATA for ${category} ===`);
                console.log('Response status:', response.status);
                console.log('Full response data:', JSON.stringify(data, null, 2));
                
                if (data && data.features) {
                    places.push(...data.features.slice(0, 5));
                    console.log(`Found ${data.features.length} places of category ${category}`);
                    
                    // Log each place details
                    data.features.slice(0, 5).forEach((place, index) => {
                        console.log(`\n--- Place ${index + 1} ---`);
                        console.log('Properties:', JSON.stringify(place.properties, null, 2));
                        console.log('Geometry:', JSON.stringify(place.geometry, null, 2));
                    });
                } else {
                    console.log(`No places found for category ${category}`);
                }
            } catch (error) {
                console.error(`Error fetching ${category} places from Geoapify:`, error.message);
            }
        }
        
        // If we didn't find enough places, try a broader search
        if (places.length < 5) {
            console.log(`Found only ${places.length} places, trying broader search...`);
            try {
                const broaderUrl = `${APIS.PLACES}?categories=tourism.attraction&filter=circle:${lon},${lat},${radiusInKm * 2}&limit=30&apiKey=${GEOAPIFY_API_KEY}`;
                console.log(`Broader Geoapify URL: ${broaderUrl}`);
                
                const response = await fetch(broaderUrl);
                const data = await response.json();
                
                console.log(`\n=== GEOAPIFY BROADER SEARCH DATA ===`);
                console.log('Response status:', response.status);
                console.log('Full broader search data:', JSON.stringify(data, null, 2));
                
                if (data && data.features) {
                    places.push(...data.features.slice(0, 10));
                    console.log(`Found ${data.features.length} additional places with broader search`);
                    
                    // Log broader search places
                    data.features.slice(0, 10).forEach((place, index) => {
                        console.log(`\n--- Broader Search Place ${index + 1} ---`);
                        console.log('Properties:', JSON.stringify(place.properties, null, 2));
                    });
                }
            } catch (error) {
                console.error(`Error in broader search:`, error.message);
            }
        }
        
        return places;
    } catch (error) {
        console.error('Error fetching places from Geoapify:', error);
        return [];
    }
};

// Get Wikipedia description for a place
const getWikipediaDescription = async (placeName) => {
    try {
        const response = await fetch(`${APIS.WIKIPEDIA}/${encodeURIComponent(placeName)}`);
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

// Get weather information for a location (simplified)
const getWeatherInfo = async (lat, lon) => {
    try {
        // For now, return null as weather is not essential
        // Can be integrated with a free weather API later if needed
        return null;
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
};

// Note: Removed Google Places API to use only free alternatives

// Format place data from different sources
const formatPlaceData = async (place, source, weekendType) => {
    // For sample data, return as-is since it's already properly formatted
    if (source === 'sample') {
        return place;
    }
    
    // For Geoapify data
    if (source === 'geoapify') {
        const name = place.properties.name || 
                    place.properties.housenumber + ' ' + place.properties.street || 
                    place.properties.suburb || 
                    place.properties.city || 
                    place.properties.county || 
                    "Unknown Place";
        
        const description = place.properties.description || 
                           place.properties.name || 
                           place.properties.suburb || 
                           "Weekend getaway destination";
        
        const region = place.properties.state || 
                      place.properties.county || 
                      place.properties.city || 
                      "India";
        
        // Convert categories to readable highlights
        const highlights = place.properties.categories ? 
            place.properties.categories
                .filter(cat => !cat.includes('tourism.attraction.artwork'))
                .map(cat => cat.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
                .slice(0, 3) : 
            ["Attraction", "Tourism", "Weekend Destination"];
        
        const baseData = {
            id: place.properties.place_id || Math.random().toString(36).substr(2, 9),
            name: name,
            weekendType: weekendType,
            source: source,
            latitude: place.geometry.coordinates[1],
            longitude: place.geometry.coordinates[0],
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            description: description,
            highlights: highlights,
            region: region,
            budget: "₹2000-8000 per day",
            idealFor: ["Weekend Travelers", "Tourists", "Explorers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: highlights.slice(0, 4),
            travelTime: "4-8 hours from major cities",
            wikipediaUrl: null
        };

        // Get Wikipedia description
        const wikiInfo = await getWikipediaDescription(baseData.name);
        if (wikiInfo) {
            baseData.description = wikiInfo.description || baseData.description;
            baseData.wikipediaUrl = wikiInfo.url;
        }

        return baseData;
    }
    
    // For any other source, return basic formatted data
    return {
        id: place.id || Math.random().toString(36).substr(2, 9),
        name: place.name || "Unknown Place",
        weekendType: weekendType,
        source: source,
        latitude: place.latitude || 0,
        longitude: place.longitude || 0,
        image: place.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        description: place.description || "Weekend getaway destination",
        highlights: place.highlights || ["Attraction", "Tourism", "Weekend Destination"],
        region: place.region || "India",
        budget: place.budget || "₹2000-8000 per day",
        idealFor: place.idealFor || ["Weekend Travelers", "Tourists", "Explorers"],
        bestMonths: place.bestMonths || ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        thingsToDo: place.thingsToDo || ["Sightseeing", "Photography", "Relaxation"],
        travelTime: place.travelTime || "4-8 hours from major cities",
        wikipediaUrl: place.wikipediaUrl || null
    };
};

// GET /api/v1/weekend-getaways/search
// Query params: city (optional), limit (optional), category (optional)
const searchWeekendGetaways = async (req, res, next) => {
    try {
        const { city, limit, category } = req.query;

        // If no specific parameters, return most popular destinations
        if (!city && !category) {
            console.log('Returning most popular Indian destinations');
            
            let destinations = POPULAR_DESTINATIONS;
            
            // Filter by category if specified
            if (category) {
                destinations = POPULAR_DESTINATIONS.filter(place => 
                    place.category === category.toLowerCase()
                );
            }
            
            // Apply limit if specified
            if (limit) {
                const limitNum = parseInt(limit);
                if (!isNaN(limitNum) && limitNum > 0) {
                    destinations = destinations.slice(0, limitNum);
                }
            }
            
            // Format response
            const response = {
                searchParams: {
                    type: "most_visited_places",
                    category: category || "all",
                    limit: limit ? parseInt(limit) : 12
                },
                weather: null,
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
                        bestMonths: dest.bestMonths,
                        thingsToDo: dest.thingsToDo,
                        travelTime: dest.travelTime,
                        image: dest.image,
                        visitorsPerYear: dest.visitorsPerYear,
                        wikipediaUrl: dest.wikipediaUrl,
                        coordinates: {
                            latitude: dest.latitude,
                            longitude: dest.longitude
                        }
                    }))
                }
            };
            
            return res.json(response);
        }

        // Get city coordinates using free geocoding
        const cityCoords = await getCityCoordinates(city);
        if (!cityCoords) {
            return res.status(400).json({ 
                message: 'Could not find coordinates for the specified city',
                city: city,
                availableCategories: ["historical places", "beach destinations", "hill stations", "religious places", "adventure spots"],
                example: '/api/v1/weekend-getaways/search?city=Delhi&radius=300&weekendType=hill stations'
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

        // Use Geoapify API + sample data as fallback
        console.log(`\n=== Using Geoapify API for ${normalizedWeekendType} near ${city} ===`);
        console.log(`City coordinates: lat=${cityCoords.latitude}, lon=${cityCoords.longitude}`);
        console.log(`Search radius: ${maxRadius}km`);
        
        // Fetch places from Geoapify
        const geoapifyPlaces = await fetchPlacesFromGeoapify(
            cityCoords.latitude, 
            cityCoords.longitude, 
            normalizedWeekendType, 
            maxRadius * 1000
        );
        
        console.log(`Found ${geoapifyPlaces.length} places from Geoapify`);
        
        // Format Geoapify places and calculate distances
        let allPlaces = await Promise.all(
            geoapifyPlaces.map(async (place) => {
                console.log(`\n=== PROCESSING GEOAPIFY PLACE ===`);
                console.log('Raw place data:', JSON.stringify(place, null, 2));
                
                const formattedPlace = await formatPlaceData(place, 'geoapify', normalizedWeekendType);
                console.log('Formatted place:', JSON.stringify(formattedPlace, null, 2));
                
                const distance = calculateDistance(
                    cityCoords.latitude,
                    cityCoords.longitude,
                    formattedPlace.latitude,
                    formattedPlace.longitude
                );
                
                const finalPlace = {
                    ...formattedPlace,
                    distanceFromCity: Math.round(distance)
                };
                
                console.log('Final place with distance:', JSON.stringify(finalPlace, null, 2));
                
                return finalPlace;
            })
        );
        
        // Filter out poor quality Geoapify results (places with "Unknown Place" name)
        const qualityPlaces = allPlaces.filter(place => 
            place.name !== "Unknown Place" && 
            place.name && 
            place.name.length > 2
        );
        
        console.log(`Quality Geoapify places: ${qualityPlaces.length} out of ${allPlaces.length}`);
        
        // Add sample data as fallback if we don't have enough quality places
        if (qualityPlaces.length < 8) {
            console.log(`Adding sample data as fallback (have ${qualityPlaces.length} quality places, need at least 8)`);
            const sampleDestinations = SAMPLE_DESTINATIONS[normalizedWeekendType] || [];
            
            const samplePlaces = sampleDestinations.map(place => {
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
            });
            
            allPlaces = [...qualityPlaces, ...samplePlaces];
        } else {
            allPlaces = qualityPlaces;
        }
        
        console.log(`Total places before filtering: ${allPlaces.length}`);
        
        // Smart filtering: prioritize nearby places but ensure we have enough results
        const placesWithinRadius = allPlaces.filter(place => place.distanceFromCity <= maxRadius);
        
        if (placesWithinRadius.length >= 12) {
            // If we have enough nearby places, use them
            allPlaces = placesWithinRadius;
            console.log(`Using ${allPlaces.length} places within ${maxRadius}km radius`);
        } else if (placesWithinRadius.length > 0) {
            // If we have some nearby places, add more from extended radius
            const extendedRadius = Math.max(maxRadius * 2, 500); // At least 500km
            const additionalPlaces = allPlaces.filter(place => 
                place.distanceFromCity > maxRadius && place.distanceFromCity <= extendedRadius
            );
            allPlaces = [...placesWithinRadius, ...additionalPlaces.slice(0, 12 - placesWithinRadius.length)];
            console.log(`Using ${placesWithinRadius.length} nearby + ${additionalPlaces.length} extended radius places`);
        } else {
            // If no nearby places, show popular destinations within 1000km
            allPlaces = allPlaces.filter(place => place.distanceFromCity <= 1000);
            console.log(`No nearby places, showing ${allPlaces.length} popular destinations within 1000km`);
        }
        
        // Ensure we have at least 12 destinations (or all available if less than 12)
        allPlaces = allPlaces.slice(0, 12);
        console.log(`Final destinations: ${allPlaces.length}`);

        // Remove duplicates based on coordinates
        const uniquePlaces = allPlaces.filter((place, index, self) => 
            index === self.findIndex(p => 
                Math.abs(p.latitude - place.latitude) < 0.001 && 
                Math.abs(p.longitude - place.longitude) < 0.001
            )
        );

        console.log(`Unique places after deduplication: ${uniquePlaces.length}`);

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
            .filter(place => {
                const withinRadius = place.distanceFromCity <= maxRadius;
                if (!withinRadius) {
                    console.log(`Filtered out ${place.name} - distance: ${place.distanceFromCity}km (max: ${maxRadius}km)`);
                }
                return withinRadius;
            })
            .sort((a, b) => a.distanceFromCity - b.distanceFromCity);

        console.log(`Final destinations within ${maxRadius}km: ${destinations.length}`);

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
                    rating: dest.rating || null,
                    priceLevel: dest.priceLevel || null,
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

        // Map weekend types to categories
        const typeMapping = {
            'hill stations': 'hill stations',
            'beach destinations': 'beach destinations',
            'historical places': 'historical places',
            'adventure spots': 'adventure spots',
            'religious places': 'religious places',
            'wildlife sanctuaries': 'adventure spots' // Map wildlife to adventure
        };

        const normalizedWeekendType = weekendType.toLowerCase().replace(/\s+/g, ' ');
        const category = typeMapping[normalizedWeekendType];

        if (!category) {
            return res.status(400).json({
                message: 'Invalid weekend type',
                availableTypes: Object.keys(typeMapping),
                provided: weekendType
            });
        }

        // Filter popular destinations by category
        let destinations = POPULAR_DESTINATIONS.filter(place => 
            place.category === category
        );

        // If no specific category matches, return all destinations
        if (destinations.length === 0) {
            destinations = POPULAR_DESTINATIONS;
        }

        // Apply limit
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum) && limitNum > 0) {
            destinations = destinations.slice(0, limitNum);
        }

        return res.json({
            weekendType: weekendType,
            category: category,
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
                bestMonths: dest.bestMonths,
                thingsToDo: dest.thingsToDo,
                travelTime: dest.travelTime,
                image: dest.image,
                visitorsPerYear: dest.visitorsPerYear,
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