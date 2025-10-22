// Test amenities processing with the data structure you provided
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

// Test with your sample data structure
const sampleHotelData = {
    "12345": {
        "property_id": "12345",
        "name": "Sample Hotel",
        "amenities": {
            "2070": {
                "id": "2070",
                "name": "Dry cleaning/laundry service",
                "categories": [
                    "drycleaning_and_laundry_services"
                ]
            },
            "2071": {
                "id": "2071",
                "name": "Free WiFi",
                "categories": [
                    "internet"
                ]
            },
            "2072": {
                "id": "2072",
                "name": "Swimming pool",
                "categories": [
                    "recreation"
                ]
            }
        }
    }
};

// Test the processing
console.log('🧪 Testing Amenities Processing');
console.log('================================');

const hotelId = "12345";
const hotel = sampleHotelData[hotelId];

if (hotel) {
    console.log(`\n🏨 Hotel: ${hotel.name}`);
    console.log(`Property ID: ${hotel.property_id}`);
    
    const processedAmenities = processAmenities(hotel.amenities);
    
    console.log('\n📋 Processed Amenities:');
    console.log('List:', processedAmenities.list);
    console.log('\nDetails:', JSON.stringify(processedAmenities.details, null, 2));
    
    // Test filtering functionality
    console.log('\n🔍 Testing Amenities Filtering:');
    const searchAmenities = ['wifi', 'pool'];
    const hasAllAmenities = searchAmenities.every(searchAmenity => 
        processedAmenities.list.some(amenity => 
            amenity.toLowerCase().includes(searchAmenity.toLowerCase())
        )
    );
    
    console.log(`Searching for: ${searchAmenities.join(', ')}`);
    console.log(`Hotel has all amenities: ${hasAllAmenities}`);
    
    // Test category filtering
    console.log('\n🏷️ Testing Category Filtering:');
    const internetAmenities = Object.values(processedAmenities.details)
        .filter(amenity => amenity.categories.includes('internet'));
    console.log('Internet amenities:', internetAmenities);
    
} else {
    console.log('❌ Hotel not found');
}

// Test with different data structures
console.log('\n🔄 Testing Different Data Structures:');
console.log('=====================================');

// Test 1: Object structure (your format)
const objectAmenities = {
    "2070": {
        "id": "2070",
        "name": "Dry cleaning/laundry service",
        "categories": ["drycleaning_and_laundry_services"]
    }
};

const result1 = processAmenities(objectAmenities);
console.log('\n1. Object structure result:');
console.log('List:', result1.list);
console.log('Details:', result1.details);

// Test 2: Array structure
const arrayAmenities = ["WiFi", "Pool", "Gym"];
const result2 = processAmenities(arrayAmenities);
console.log('\n2. Array structure result:');
console.log('List:', result2.list);
console.log('Details:', result2.details);

// Test 3: Empty/null data
const result3 = processAmenities(null);
console.log('\n3. Null data result:');
console.log('List:', result3.list);
console.log('Details:', result3.details);

console.log('\n✅ Amenities processing test completed!');



