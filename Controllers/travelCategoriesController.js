const fetch = require("node-fetch");

// Sample travel category destinations data
const TRAVEL_CATEGORY_DESTINATIONS = {
    "beach escape": [
        {
            id: "goa_beaches",
            name: "Goa",
            description: "Famous beach destination with Portuguese heritage and vibrant nightlife",
            category: "beach escape",
            source: "sample",
            latitude: 15.2993,
            longitude: 74.1240,
            image: "https://images.pexels.com/photos/88212/pexels-photo-88212.jpeg",
            region: "Goa",
            highlights: ["Beaches", "Portuguese Heritage", "Nightlife", "Water Sports"],
            budget: "₹4000-12000 per day",
            idealFor: ["Party Lovers", "Couples", "Friends", "Beach Lovers"],
            bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Beach Hopping", "Water Sports", "Heritage Tours", "Nightlife"],
            travelTime: "2-3 hours from Mumbai",
            visitorsPerYear: "6-7 million"
        },
        {
            id: "andaman_islands",
            name: "Andaman Islands",
            description: "Tropical paradise with pristine beaches and marine life",
            category: "beach escape",
            source: "sample",
            latitude: 11.7401,
            longitude: 92.6586,
            image: "https://images.pexels.com/photos/3732494/pexels-photo-3732494.jpeg",
            region: "Andaman & Nicobar",
            highlights: ["Pristine Beaches", "Marine Life", "Water Sports", "Tropical Climate"],
            budget: "₹4000-10000 per day",
            idealFor: ["Beach Lovers", "Adventure Seekers", "Nature Lovers", "Couples"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Scuba Diving", "Beach Relaxation", "Island Hopping", "Water Sports"],
            travelTime: "2-3 hours from Port Blair",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "kovalam_beach",
            name: "Kovalam",
            description: "Famous beach destination with lighthouse and Ayurvedic treatments",
            category: "beach escape",
            source: "sample",
            latitude: 8.4004,
            longitude: 76.9781,
            image: "https://images.pexels.com/photos/10229156/pexels-photo-10229156.jpeg",
            region: "Kerala",
            highlights: ["Lighthouse Beach", "Ayurveda", "Water Sports", "Backwaters"],
            budget: "₹2500-7000 per day",
            idealFor: ["Beach Lovers", "Wellness Seekers", "Families", "Adventure Seekers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Beach Relaxation", "Ayurvedic Massage", "Water Sports", "Lighthouse Visit"],
            travelTime: "1-2 hours from Trivandrum",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "pondicherry_beaches",
            name: "Pondicherry",
            description: "French colonial town with beautiful beaches and unique culture",
            category: "beach escape",
            source: "sample",
            latitude: 11.9139,
            longitude: 79.8145,
            image: "https://images.pexels.com/photos/8003086/pexels-photo-8003086.jpeg",
            region: "Puducherry",
            highlights: ["French Heritage", "Beaches", "Spiritual Centers", "Colonial Architecture"],
            budget: "₹2000-6000 per day",
            idealFor: ["Culture Lovers", "Beach Lovers", "Spiritual Seekers", "History Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Beach Walks", "French Quarter Tour", "Auroville Visit", "Water Sports"],
            travelTime: "3-4 hours from Chennai",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "puri_beach",
            name: "Puri Beach",
            description: "Sacred beach destination with Jagannath Temple and golden sands",
            category: "beach escape",
            source: "sample",
            latitude: 19.8134,
            longitude: 85.8312,
            image: "https://images.pexels.com/photos/29547316/pexels-photo-29547316.jpeg",
            region: "Odisha",
            highlights: ["Jagannath Temple", "Golden Sands", "Spiritual Experience", "Sunrise Views"],
            budget: "₹1500-4000 per day",
            idealFor: ["Pilgrims", "Beach Lovers", "Spiritual Seekers", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Temple Visit", "Beach Walks", "Sunrise Viewing", "Local Cuisine"],
            travelTime: "2-3 hours from Bhubaneswar",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "gokarna_beaches",
            name: "Gokarna",
            description: "Peaceful beach destination with temples and pristine shores",
            category: "beach escape",
            source: "sample",
            latitude: 14.5500,
            longitude: 74.3167,
            image: "https://images.pexels.com/photos/29356885/pexels-photo-29356885.jpeg",
            region: "Karnataka",
            highlights: ["Temple Town", "Pristine Beaches", "Peaceful Atmosphere", "Trekking"],
            budget: "₹2000-5000 per day",
            idealFor: ["Spiritual Seekers", "Beach Lovers", "Backpackers", "Nature Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Temple Visits", "Beach Trekking", "Sunset Views", "Meditation"],
            travelTime: "6-7 hours from Bangalore",
            visitorsPerYear: "500K-1M"
        },
        {
            id: "digha_beach",
            name: "Digha",
            description: "Popular beach destination in West Bengal with long coastline",
            category: "beach escape",
            source: "sample",
            latitude: 21.6280,
            longitude: 87.5170,
            image: "https://images.pexels.com/photos/134927/pexels-photo-134927.jpeg",
            region: "West Bengal",
            highlights: ["Long Coastline", "Beach Activities", "Local Culture", "Seafood"],
            budget: "₹1500-4000 per day",
            idealFor: ["Beach Lovers", "Families", "Budget Travelers", "Local Tourists"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Beach Walks", "Water Sports", "Seafood Tasting", "Local Shopping"],
            travelTime: "3-4 hours from Kolkata",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "lakshadweep_islands",
            name: "Lakshadweep Islands",
            description: "Coral paradise with crystal clear waters and pristine beaches",
            category: "beach escape",
            source: "sample",
            latitude: 10.5667,
            longitude: 72.6417,
            image: "https://images.pexels.com/photos/21617942/pexels-photo-21617942.jpeg",
            region: "Lakshadweep",
            highlights: ["Coral Reefs", "Crystal Clear Waters", "Water Sports", "Island Hopping"],
            budget: "₹5000-12000 per day",
            idealFor: ["Beach Lovers", "Divers", "Nature Lovers", "Adventure Seekers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Snorkeling", "Diving", "Island Tours", "Beach Relaxation"],
            travelTime: "1-2 hours from Kochi",
            visitorsPerYear: "500K-1M"
        }
    ],
    "city breaks": [
        {
            id: "mumbai_city",
            name: "Mumbai",
            description: "Financial capital of India with Bollywood, beaches, and vibrant city life",
            category: "city breaks",
            source: "sample",
            latitude: 19.0760,
            longitude: 72.8777,
            image: "https://images.pexels.com/photos/33498767/pexels-photo-33498767.jpeg",
            region: "Maharashtra",
            highlights: ["Bollywood", "Gateway of India", "Marine Drive", "Street Food"],
            budget: "₹3000-10000 per day",
            idealFor: ["City Lovers", "Food Enthusiasts", "Entertainment Seekers", "Business Travelers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Bollywood Tours", "Street Food", "Shopping", "Nightlife"],
            travelTime: "City center accessible",
            visitorsPerYear: "5-6 million"
        },
        {
            id: "delhi_city",
            name: "Delhi",
            description: "Capital city with rich history, monuments, and diverse culture",
            category: "city breaks",
            source: "sample",
            latitude: 28.6139,
            longitude: 77.2090,
            image: "https://images.pexels.com/photos/14520365/pexels-photo-14520365.jpeg?w=400",
            region: "Delhi",
            highlights: ["Red Fort", "Qutub Minar", "India Gate", "Street Food"],
            budget: "₹2000-8000 per day",
            idealFor: ["History Lovers", "Food Enthusiasts", "Culture Seekers", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Monument Tours", "Street Food", "Shopping", "Cultural Shows"],
            travelTime: "City center accessible",
            visitorsPerYear: "4-5 million"
        },
        {
            id: "bangalore_city",
            name: "Bangalore",
            description: "Garden city and IT hub with pleasant weather and vibrant nightlife",
            category: "city breaks",
            source: "sample",
            latitude: 12.9716,
            longitude: 77.5946,
            image: "https://images.pexels.com/photos/739987/pexels-photo-739987.jpeg?w=400",
            region: "Karnataka",
            highlights: ["IT Hub", "Garden City", "Pleasant Weather", "Pub Culture"],
            budget: "₹2500-8000 per day",
            idealFor: ["Tech Enthusiasts", "Young Professionals", "Food Lovers", "Nature Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Tech Parks", "Garden Visits", "Pub Hopping", "Food Tours"],
            travelTime: "City center accessible",
            visitorsPerYear: "3-4 million"
        },
        {
            id: "kolkata_city",
            name: "Kolkata",
            description: "Cultural capital with rich heritage, literature, and Bengali culture",
            category: "city breaks",
            source: "sample",
            latitude: 22.5726,
            longitude: 88.3639,
            image: "https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?w=400",
            region: "West Bengal",
            highlights: ["Cultural Heritage", "Literature", "Bengali Cuisine", "Trams"],
            budget: "₹2000-6000 per day",
            idealFor: ["Culture Enthusiasts", "Literature Lovers", "Food Lovers", "History Buffs"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Cultural Tours", "Literature Walks", "Food Tours", "Tram Rides"],
            travelTime: "City center accessible",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "chennai_city",
            name: "Chennai",
            description: "Gateway to South India with temples, beaches, and Tamil culture",
            category: "city breaks",
            source: "sample",
            latitude: 13.0827,
            longitude: 80.2707,
            image: "https://images.pexels.com/photos/27128244/pexels-photo-27128244.jpeg?w=400",
            region: "Tamil Nadu",
            highlights: ["Temples", "Beaches", "Tamil Culture", "Classical Music"],
            budget: "₹2000-6000 per day",
            idealFor: ["Culture Enthusiasts", "Temple Lovers", "Beach Lovers", "Music Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Temple Tours", "Beach Visits", "Cultural Shows", "Music Concerts"],
            travelTime: "City center accessible",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "hyderabad_city",
            name: "Hyderabad",
            description: "City of pearls with rich history, biryani, and modern IT sector",
            category: "city breaks",
            source: "sample",
            latitude: 17.3850,
            longitude: 78.4867,
            image: "https://images.pexels.com/photos/9373357/pexels-photo-9373357.jpeg?w=400",
            region: "Telangana",
            highlights: ["Charminar", "Biryani", "Pearls", "IT Hub"],
            budget: "₹2000-7000 per day",
            idealFor: ["Food Lovers", "History Enthusiasts", "Tech Professionals", "Shoppers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Biryani Tasting", "Pearl Shopping", "Historical Tours", "Tech Parks"],
            travelTime: "City center accessible",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "pune_city",
            name: "Pune",
            description: "Oxford of the East with educational institutions and pleasant weather",
            category: "city breaks",
            source: "sample",
            latitude: 18.5204,
            longitude: 73.8567,
            image: "https://images.pexels.com/photos/3119952/pexels-photo-3119952.jpeg",
            region: "Maharashtra",
            highlights: ["Educational Hub", "Pleasant Weather", "IT Sector", "Cultural Heritage"],
            budget: "₹2000-6000 per day",
            idealFor: ["Students", "Young Professionals", "Nature Lovers", "Culture Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Educational Tours", "Nature Walks", "Cultural Events", "Food Tours"],
            travelTime: "City center accessible",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "ahmedabad_city",
            name: "Ahmedabad",
            description: "Textile city with rich heritage, Gandhi's legacy, and Gujarati culture",
            category: "city breaks",
            source: "sample",
            latitude: 23.0225,
            longitude: 72.5714,
            image: "https://images.pexels.com/photos/32774947/pexels-photo-32774947.jpeg?w=400",
            region: "Gujarat",
            highlights: ["Gandhi Heritage", "Textile Industry", "Gujarati Culture", "Sabarmati Ashram"],
            budget: "₹1500-5000 per day",
            idealFor: ["History Enthusiasts", "Culture Lovers", "Business Travelers", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Heritage Tours", "Textile Shopping", "Cultural Shows", "Gandhi Ashram"],
            travelTime: "City center accessible",
            visitorsPerYear: "1-2 million"
        }
    ],
    "mountain treks": [
        {
            id: "kashmir_treks",
            name: "Kashmir Valley",
            description: "Paradise on Earth with stunning mountain landscapes and trekking trails",
            category: "mountain treks",
            source: "sample",
            latitude: 34.0837,
            longitude: 74.7973,
            image: "https://images.pexels.com/photos/33395687/pexels-photo-33395687.jpeg?w=400",
            region: "Jammu & Kashmir",
            highlights: ["Dal Lake", "Gulmarg", "Pahalgam", "Mountain Views"],
            budget: "₹3000-8000 per day",
            idealFor: ["Nature Lovers", "Adventure Seekers", "Couples", "Photographers"],
            bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
            thingsToDo: ["Trekking", "Shikara Ride", "Skiing", "Photography"],
            travelTime: "1-2 hours from Srinagar",
            visitorsPerYear: "3-4 million"
        },
        {
            id: "manali_treks",
            name: "Manali",
            description: "Adventure capital with snow-capped mountains and trekking opportunities",
            category: "mountain treks",
            source: "sample",
            latitude: 32.2432,
            longitude: 77.1892,
            image: "https://images.pexels.com/photos/6147968/pexels-photo-6147968.jpeg?w=400",
            region: "Himachal Pradesh",
            highlights: ["Snow Mountains", "Adventure Sports", "Hot Springs", "Temples"],
            budget: "₹2500-7000 per day",
            idealFor: ["Adventure Seekers", "Couples", "Families", "Nature Lovers"],
            bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
            thingsToDo: ["Trekking", "Skiing", "Hot Springs", "Temple Visits"],
            travelTime: "8-10 hours from Delhi",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "ladakh_treks",
            name: "Ladakh",
            description: "High-altitude desert with Buddhist monasteries and trekking trails",
            category: "mountain treks",
            source: "sample",
            latitude: 34.1526,
            longitude: 77.5771,
            image: "https://images.pexels.com/photos/5204921/pexels-photo-5204921.jpeg?w=400",
            region: "Ladakh",
            highlights: ["Buddhist Monasteries", "High Altitude", "Desert Landscapes", "Adventure Sports"],
            budget: "₹3000-8000 per day",
            idealFor: ["Adventure Seekers", "Spiritual Seekers", "Nature Lovers", "Photographers"],
            bestMonths: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
            thingsToDo: ["Trekking", "Monastery Visits", "River Rafting", "Photography"],
            travelTime: "1-2 hours from Leh",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "darjeeling_treks",
            name: "Darjeeling",
            description: "Famous hill station with tea gardens and Himalayan trekking trails",
            category: "mountain treks",
            source: "sample",
            latitude: 27.0360,
            longitude: 88.2627,
            image: "https://images.pexels.com/photos/103875/pexels-photo-103875.jpeg?w=400",
            region: "West Bengal",
            highlights: ["Tea Gardens", "Himalayan Views", "Toy Train", "Mountain Views"],
            budget: "₹2500-6000 per day",
            idealFor: ["Nature Lovers", "Tea Enthusiasts", "Families", "Photographers"],
            bestMonths: ["Mar", "Apr", "May", "Sep", "Oct", "Nov"],
            thingsToDo: ["Trekking", "Tea Tasting", "Toy Train Ride", "Sunrise View"],
            travelTime: "3-4 hours from Siliguri",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "munnar_treks",
            name: "Munnar",
            description: "Tea gardens and hill station with trekking trails in the Western Ghats",
            category: "mountain treks",
            source: "sample",
            latitude: 10.0889,
            longitude: 77.0595,
            image: "https://images.pexels.com/photos/32262515/pexels-photo-32262515.jpeg?w=400",
            region: "Kerala",
            highlights: ["Tea Gardens", "Eravikulam National Park", "Waterfalls", "Mountain Views"],
            budget: "₹2500-6000 per day",
            idealFor: ["Nature Lovers", "Tea Enthusiasts", "Families", "Adventure Seekers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Trekking", "Tea Plantation Tour", "Wildlife Safari", "Waterfall Visit"],
            travelTime: "4-5 hours from Kochi",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "coorg_treks",
            name: "Coorg",
            description: "Scotland of India with coffee plantations and trekking trails",
            category: "mountain treks",
            source: "sample",
            latitude: 12.3375,
            longitude: 75.8069,
            image: "https://images.pexels.com/photos/33046721/pexels-photo-33046721.png",
            region: "Karnataka",
            highlights: ["Coffee Plantations", "Misty Hills", "Waterfalls", "Adventure Sports"],
            budget: "₹2500-6000 per day",
            idealFor: ["Nature Lovers", "Adventure Seekers", "Families", "Coffee Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Trekking", "Coffee Plantation Tour", "Waterfall Visits", "Adventure Sports"],
            travelTime: "5-6 hours from Bangalore",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "ooty_treks",
            name: "Ooty",
            description: "Queen of Nilgiris with tea gardens and trekking trails",
            category: "mountain treks",
            source: "sample",
            latitude: 11.4102,
            longitude: 76.6950,
            image: "https://images.pexels.com/photos/32366710/pexels-photo-32366710.jpeg?w=400",
            region: "Tamil Nadu",
            highlights: ["Tea Gardens", "Botanical Gardens", "Toy Train", "Lakes"],
            budget: "₹2000-6000 per day",
            idealFor: ["Families", "Nature Lovers", "Tea Enthusiasts", "Photographers"],
            bestMonths: ["Mar", "Apr", "May", "Sep", "Oct", "Nov"],
            thingsToDo: ["Trekking", "Tea Garden Tour", "Botanical Garden", "Toy Train"],
            travelTime: "6-7 hours from Bangalore",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "shimla_treks",
            name: "Shimla",
            description: "Queen of Hills with colonial architecture and trekking trails",
            category: "mountain treks",
            source: "sample",
            latitude: 31.1048,
            longitude: 77.1734,
            image: "https://images.pexels.com/photos/30550231/pexels-photo-30550231.jpeg?w=400",
            region: "Himachal Pradesh",
            highlights: ["Colonial Architecture", "Mall Road", "Toy Train", "Scenic Views"],
            budget: "₹3000-8000 per day",
            idealFor: ["Families", "Couples", "History Lovers", "Nature Enthusiasts"],
            bestMonths: ["Mar", "Apr", "May", "Sep", "Oct", "Nov"],
            thingsToDo: ["Trekking", "Mall Road Walk", "Toy Train Ride", "Temple Visits"],
            travelTime: "6-8 hours from Delhi",
            visitorsPerYear: "2-3 million"
        }
    ],
    "food and culture": [
        {
            id: "delhi_food_culture",
            name: "Delhi",
            description: "Capital city with diverse cuisine, street food, and rich cultural heritage",
            category: "food and culture",
            source: "sample",
            latitude: 28.6139,
            longitude: 77.2090,
            image: "https://images.unsplash.com/photo-1729891960622-6418a0c293ec?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Delhi",
            highlights: ["Street Food", "Mughlai Cuisine", "Cultural Heritage", "Monuments"],
            budget: "₹2000-8000 per day",
            idealFor: ["Food Lovers", "Culture Enthusiasts", "History Buffs", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Food Tours", "Cultural Shows", "Monument Visits", "Shopping"],
            travelTime: "City center accessible",
            visitorsPerYear: "4-5 million"
        },
        {
            id: "mumbai_food_culture",
            name: "Mumbai",
            description: "Financial capital with diverse street food, Bollywood, and cultural experiences",
            category: "food and culture",
            source: "sample",
            latitude: 19.0760,
            longitude: 72.8777,
            image: "https://images.unsplash.com/photo-1665206221363-568ea2f7b195?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Maharashtra",
            highlights: ["Street Food", "Bollywood", "Marathi Culture", "Gateway of India"],
            budget: "₹3000-10000 per day",
            idealFor: ["Food Enthusiasts", "Entertainment Seekers", "Culture Lovers", "Young Professionals"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Food Tours", "Bollywood Tours", "Cultural Shows", "Shopping"],
            travelTime: "City center accessible",
            visitorsPerYear: "5-6 million"
        },
        {
            id: "kolkata_food_culture",
            name: "Kolkata",
            description: "Cultural capital with Bengali cuisine, literature, and rich heritage",
            category: "food and culture",
            source: "sample",
            latitude: 22.5726,
            longitude: 88.3639,
            image: "https://plus.unsplash.com/premium_photo-1731606078756-d9102149265c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "West Bengal",
            highlights: ["Bengali Cuisine", "Literature", "Cultural Heritage", "Trams"],
            budget: "₹2000-6000 per day",
            idealFor: ["Food Lovers", "Literature Enthusiasts", "Culture Seekers", "History Buffs"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Food Tours", "Literature Walks", "Cultural Shows", "Tram Rides"],
            travelTime: "City center accessible",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "hyderabad_food_culture",
            name: "Hyderabad",
            description: "City of pearls with biryani, pearls, and rich Nizami culture",
            category: "food and culture",
            source: "sample",
            latitude: 17.3850,
            longitude: 78.4867,
            image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1850&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Telangana",
            highlights: ["Biryani", "Pearls", "Nizami Culture", "Charminar"],
            budget: "₹2000-7000 per day",
            idealFor: ["Food Lovers", "History Enthusiasts", "Culture Seekers", "Shoppers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Biryani Tasting", "Pearl Shopping", "Cultural Tours", "Historical Visits"],
            travelTime: "City center accessible",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "chennai_food_culture",
            name: "Chennai",
            description: "Gateway to South India with Tamil cuisine, temples, and classical music",
            category: "food and culture",
            source: "sample",
            latitude: 13.0827,
            longitude: 80.2707,
            image: "https://images.unsplash.com/photo-1555281863-ff294ae28fbc?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Tamil Nadu",
            highlights: ["Tamil Cuisine", "Temples", "Classical Music", "Cultural Heritage"],
            budget: "₹2000-6000 per day",
            idealFor: ["Food Lovers", "Culture Enthusiasts", "Music Lovers", "Temple Visitors"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Food Tours", "Temple Visits", "Music Concerts", "Cultural Shows"],
            travelTime: "City center accessible",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "bangalore_food_culture",
            name: "Bangalore",
            description: "Garden city with diverse cuisine, pub culture, and tech heritage",
            category: "food and culture",
            source: "sample",
            latitude: 12.9716,
            longitude: 77.5946,
            image: "https://images.unsplash.com/photo-1464500422302-6188776dcbf3?q=80&w=1853&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Karnataka",
            highlights: ["Diverse Cuisine", "Pub Culture", "Tech Heritage", "Garden City"],
            budget: "₹2500-8000 per day",
            idealFor: ["Food Enthusiasts", "Young Professionals", "Tech Lovers", "Nature Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Food Tours", "Pub Hopping", "Tech Park Visits", "Garden Tours"],
            travelTime: "City center accessible",
            visitorsPerYear: "3-4 million"
        },
        {
            id: "goa_food_culture",
            name: "Goa",
            description: "Beach destination with Portuguese-influenced cuisine and vibrant culture",
            category: "food and culture",
            source: "sample",
            latitude: 15.2993,
            longitude: 74.1240,
            image: "https://images.unsplash.com/photo-1741217259892-f72a5d61650e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Goa",
            highlights: ["Portuguese Cuisine", "Beach Culture", "Nightlife", "Heritage"],
            budget: "₹4000-12000 per day",
            idealFor: ["Food Lovers", "Culture Enthusiasts", "Party Lovers", "Beach Lovers"],
            bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Food Tours", "Heritage Walks", "Beach Activities", "Nightlife"],
            travelTime: "2-3 hours from Mumbai",
            visitorsPerYear: "6-7 million"
        },
        {
            id: "rajasthan_food_culture",
            name: "Rajasthan",
            description: "Land of kings with royal cuisine, palaces, and rich cultural heritage",
            category: "food and culture",
            source: "sample",
            latitude: 26.9124,
            longitude: 75.7873,
            image: "https://images.unsplash.com/photo-1591465619339-60fce055bc82?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Rajasthan",
            highlights: ["Royal Cuisine", "Palaces", "Cultural Heritage", "Desert Culture"],
            budget: "₹2500-8000 per day",
            idealFor: ["Food Lovers", "History Enthusiasts", "Culture Seekers", "Families"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Food Tours", "Palace Visits", "Cultural Shows", "Desert Safari"],
            travelTime: "5-6 hours from Delhi",
            visitorsPerYear: "4-5 million"
        }
    ],
    "adventure trips": [
        {
            id: "ladakh_adventure",
            name: "Ladakh",
            description: "High-altitude desert with trekking, river rafting, and adventure sports",
            category: "adventure trips",
            source: "sample",
            latitude: 34.1526,
            longitude: 77.5771,
            image: "https://images.unsplash.com/photo-1536295243470-d7cba4efab7b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFkYWtoJTIwbW90b3JjeWNsZXxlbnwwfDB8MHx8fDI%3D",
            region: "Ladakh",
            highlights: ["High Altitude", "Trekking", "River Rafting", "Adventure Sports"],
            budget: "₹3000-8000 per day",
            idealFor: ["Adventure Seekers", "Nature Lovers", "Photographers", "Spiritual Seekers"],
            bestMonths: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
            thingsToDo: ["Trekking", "River Rafting", "Photography", "Monastery Visits"],
            travelTime: "1-2 hours from Leh",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "manali_adventure",
            name: "Manali",
            description: "Adventure capital with skiing, trekking, and outdoor activities",
            category: "adventure trips",
            source: "sample",
            latitude: 32.2432,
            longitude: 77.1892,
            image: "https://images.unsplash.com/photo-1713063968789-adf139c4a1eb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFuYWxpJTIwcGFyYWdsaWRpbmd8ZW58MHwwfDB8fHwy",
            region: "Himachal Pradesh",
            highlights: ["Skiing", "Trekking", "Adventure Sports", "Mountain Activities"],
            budget: "₹2500-7000 per day",
            idealFor: ["Adventure Seekers", "Ski Enthusiasts", "Nature Lovers", "Outdoor Enthusiasts"],
            bestMonths: ["Apr", "May", "Jun", "Sep", "Oct", "Nov"],
            thingsToDo: ["Skiing", "Trekking", "Adventure Sports", "Mountain Activities"],
            travelTime: "8-10 hours from Delhi",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "rishikesh_adventure",
            name: "Rishikesh",
            description: "Adventure capital with river rafting, yoga, and spiritual experiences",
            category: "adventure trips",
            source: "sample",
            latitude: 30.0869,
            longitude: 78.2676,
            image: "https://images.unsplash.com/photo-1627241129356-137242cf14f0?q=80&w=1834&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Uttarakhand",
            highlights: ["River Rafting", "Yoga", "Spiritual Experience", "Adventure Sports"],
            budget: "₹2000-6000 per day",
            idealFor: ["Adventure Seekers", "Spiritual Seekers", "Yoga Enthusiasts", "Nature Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["River Rafting", "Yoga Classes", "Temple Visits", "Adventure Sports"],
            travelTime: "6-7 hours from Delhi",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "goa_adventure",
            name: "Goa",
            description: "Beach destination with water sports and adventure activities",
            category: "adventure trips",
            source: "sample",
            latitude: 15.2993,
            longitude: 74.1240,
            image: "https://images.unsplash.com/photo-1540351071155-e5d9e8c7cc75?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z29hJTIwc2N1YmElMjBkaXZpbmd8ZW58MHwwfDB8fHwy",
            region: "Goa",
            highlights: ["Water Sports", "Beach Activities", "Adventure Sports", "Nightlife"],
            budget: "₹3000-8000 per day",
            idealFor: ["Adventure Seekers", "Beach Lovers", "Water Sports Enthusiasts", "Party Lovers"],
            bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Water Sports", "Beach Activities", "Adventure Sports", "Nightlife"],
            travelTime: "2-3 hours from Mumbai",
            visitorsPerYear: "2-3 million"
        },
        {
            id: "spiti_valley_adventure",
            name: "Spiti Valley",
            description: "High-altitude desert valley with trekking and adventure activities",
            category: "adventure trips",
            source: "sample",
            latitude: 32.2432,
            longitude: 78.1892,
            image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFkdmVudHVyZXxlbnwwfDB8MHx8fDI%3D",
            region: "Himachal Pradesh",
            highlights: ["High Altitude", "Trekking", "Monasteries", "Adventure Sports"],
            budget: "₹2500-6000 per day",
            idealFor: ["Adventure Seekers", "Nature Lovers", "Photographers", "Spiritual Seekers"],
            bestMonths: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
            thingsToDo: ["Trekking", "Monastery Visits", "Photography", "Adventure Sports"],
            travelTime: "8-10 hours from Manali",
            visitorsPerYear: "500K-1M"
        },
        {
            id: "coorg_adventure",
            name: "Coorg",
            description: "Coffee country with trekking, adventure sports, and outdoor activities",
            category: "adventure trips",
            source: "sample",
            latitude: 12.3375,
            longitude: 75.8069,
            image: "https://images.unsplash.com/photo-1459231978203-b7d0c47a2cb7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFkdmVudHVyZXxlbnwwfDB8MHx8fDI%3D",
            region: "Karnataka",
            highlights: ["Trekking", "Adventure Sports", "Coffee Plantations", "Outdoor Activities"],
            budget: "₹2500-6000 per day",
            idealFor: ["Adventure Seekers", "Nature Lovers", "Coffee Lovers", "Outdoor Enthusiasts"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Trekking", "Adventure Sports", "Coffee Plantation Tour", "Outdoor Activities"],
            travelTime: "5-6 hours from Bangalore",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "munnar_adventure",
            name: "Munnar",
            description: "Tea country with trekking, adventure sports, and outdoor activities",
            category: "adventure trips",
            source: "sample",
            latitude: 10.0889,
            longitude: 77.0595,
            image: "https://images.unsplash.com/photo-1514507058299-c327ecadcf26?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGN5Y2xpbmd8ZW58MHwwfDB8fHwy",
            region: "Kerala",
            highlights: ["Trekking", "Adventure Sports", "Tea Plantations", "Wildlife"],
            budget: "₹2500-6000 per day",
            idealFor: ["Adventure Seekers", "Nature Lovers", "Tea Enthusiasts", "Wildlife Lovers"],
            bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            thingsToDo: ["Trekking", "Adventure Sports", "Tea Plantation Tour", "Wildlife Safari"],
            travelTime: "4-5 hours from Kochi",
            visitorsPerYear: "1-2 million"
        },
        {
            id: "kodaikanal_adventure",
            name: "Kodaikanal",
            description: "Hill station with trekking, cycling, and adventure activities",
            category: "adventure trips",
            source: "sample",
            latitude: 10.2381,
            longitude: 77.4892,
            image: "https://images.unsplash.com/photo-1484264883846-eb04404af310?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJla2tpbmd8ZW58MHwwfDB8fHwy",
            region: "Tamil Nadu",
            highlights: ["Trekking", "Cycling", "Water Sports", "Adventure Activities"],
            budget: "₹2000-5000 per day",
            idealFor: ["Adventure Seekers", "Nature Lovers", "Families", "Outdoor Enthusiasts"],
            bestMonths: ["Mar", "Apr", "May", "Sep", "Oct", "Nov"],
            thingsToDo: ["Trekking", "Cycling", "Water Sports", "Adventure Activities"],
            travelTime: "6-7 hours from Madurai",
            visitorsPerYear: "1-2 million"
        }
    ]
};

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
// Returns sample destinations for a specific category
const getDestinationsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const { limit = 10 } = req.query;

        const normalizedCategory = category.toLowerCase().replace(/\s+/g, ' ');
        
        if (!TRAVEL_CATEGORY_DESTINATIONS[normalizedCategory]) {
            return res.status(400).json({ 
                message: 'Invalid category',
                availableCategories: Object.keys(TRAVEL_CATEGORY_DESTINATIONS),
                provided: category
            });
        }

        // Get destinations from sample data
        let destinations = TRAVEL_CATEGORY_DESTINATIONS[normalizedCategory];

        // Apply limit if specified
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum) && limitNum > 0) {
            destinations = destinations.slice(0, limitNum);
        }

        return res.json({
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
                visitorsPerYear: dest.visitorsPerYear,
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


module.exports = { 
    searchByCategory, 
    getAllCategories, 
    getDestinationsByCategory 
};