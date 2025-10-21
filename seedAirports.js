const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Airport = require('./Models/Airport');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Missing MongoDB URI. Set env var MONGODB_URI');
    }
    
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const checkAirportData = async () => {
  try {
    console.log('🔍 Checking existing airport data in MongoDB...');
    
    const existingCount = await Airport.countDocuments();
    
    if (existingCount > 0) {
      console.log(`✅ Found ${existingCount} airports already in database!`);
      console.log('🎉 Your airport data is ready to use!');
      
      // Show some sample data
      const sampleAirports = await Airport.find().limit(3).select('name iata city country');
      console.log('\n📋 Sample airports in your database:');
      sampleAirports.forEach(airport => {
        console.log(`   - ${airport.name} (${airport.iata}) - ${airport.city}, ${airport.country}`);
      });
      
      return true;
    } else {
      console.log('❌ No airport data found in database.');
      console.log('💡 You need to add airport data to your MongoDB database first.');
      console.log('   You can either:');
      console.log('   1. Import your Airport.json file using: node seedAirports.js --import');
      console.log('   2. Add airport data manually to your MongoDB');
      console.log('   3. Use another data source to populate the airports collection');
      return false;
    }

  } catch (error) {
    console.error('❌ Error checking airport data:', error.message);
    throw error;
  }
};

const seedAirports = async () => {
  try {
    console.log('🚀 Starting airport data import from JSON file...');
    
    // Read the JSON file
    const airportDataPath = path.join(__dirname, 'helpers', 'Airport.json');
    
    if (!fs.existsSync(airportDataPath)) {
      throw new Error(`Airport data file not found at: ${airportDataPath}`);
    }

    console.log('📖 Reading airport data from JSON file...');
    const rawData = fs.readFileSync(airportDataPath, 'utf8');
    const airportData = JSON.parse(rawData);

    console.log(`📊 Found ${Object.keys(airportData).length} airports in JSON file`);

    // Transform data to match our schema
    const airports = Object.values(airportData).map(airport => ({
      icao: airport.icao,
      iata: airport.iata || '',
      name: airport.name,
      city: airport.city,
      state: airport.state || '',
      country: airport.country,
      elevation: airport.elevation || null,
      lat: airport.lat,
      lon: airport.lon,
      tz: airport.tz || ''
    }));

    console.log('🔄 Inserting airports into database...');
    
    // Insert in batches to avoid memory issues
    const batchSize = 1000;
    let insertedCount = 0;

    for (let i = 0; i < airports.length; i += batchSize) {
      const batch = airports.slice(i, i + batchSize);
      
      try {
        await Airport.insertMany(batch, { ordered: false });
        insertedCount += batch.length;
        console.log(`✅ Inserted ${insertedCount}/${airports.length} airports`);
      } catch (error) {
        // Handle duplicate key errors gracefully
        if (error.code === 11000) {
          console.log(`⚠️  Some duplicates found in batch, continuing...`);
          // Count successful inserts by checking the error details
          const successfulInserts = batch.length - (error.writeErrors ? error.writeErrors.length : 0);
          insertedCount += successfulInserts;
        } else {
          console.error('❌ Error inserting batch:', error.message);
        }
      }
    }

    console.log(`🎉 Successfully seeded ${insertedCount} airports!`);
    
    // Create indexes for better performance
    console.log('🔍 Creating indexes...');
    await Airport.collection.createIndex({ icao: 1 });
    await Airport.collection.createIndex({ iata: 1 });
    await Airport.collection.createIndex({ name: "text", city: "text", country: "text" });
    await Airport.collection.createIndex({ city: 1 });
    await Airport.collection.createIndex({ country: 1 });
    await Airport.collection.createIndex({ state: 1 });
    console.log('✅ Indexes created successfully');

  } catch (error) {
    console.error('❌ Error seeding airports:', error.message);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    
    // Check if user wants to import from JSON file
    const shouldImport = process.argv.includes('--import');
    
    if (shouldImport) {
      await seedAirports();
      console.log('🎉 Airport data import completed successfully!');
    } else {
      // Just check if data exists
      const hasData = await checkAirportData();
      if (hasData) {
        console.log('\n🚀 Your airport API is ready to use!');
        console.log('📡 API endpoint: GET /api/v1/airports/search?q={search_term}');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Operation failed:', error.message);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  main();
}

module.exports = { seedAirports, checkAirportData };
