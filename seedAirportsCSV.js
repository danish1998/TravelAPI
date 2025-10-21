const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
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
      const sampleAirports = await Airport.find().limit(3).select('name iata_code municipality iso_country');
      console.log('\n📋 Sample airports in your database:');
      sampleAirports.forEach(airport => {
        console.log(`   - ${airport.name} (${airport.iata_code}) - ${airport.municipality}, ${airport.iso_country}`);
      });
      
      return true;
    } else {
      console.log('❌ No airport data found in database.');
      console.log('💡 You need to add airport data to your MongoDB database first.');
      console.log('   Run: node seedAirportsCSV.js --import');
      return false;
    }

  } catch (error) {
    console.error('❌ Error checking airport data:', error.message);
    throw error;
  }
};

const seedAirportsFromCSV = async () => {
  try {
    console.log('🚀 Starting airport data import from CSV file...');
    
    // Read the CSV file
    const csvDataPath = path.join(__dirname, 'helpers', 'airports.csv');
    
    if (!fs.existsSync(csvDataPath)) {
      throw new Error(`Airport CSV data file not found at: ${csvDataPath}`);
    }

    console.log('📖 Reading airport data from CSV file...');
    
    // Clear existing data first
    console.log('🗑️  Clearing existing airport data...');
    await Airport.deleteMany({});
    console.log('✅ Existing data cleared');

    const airports = [];
    let processedCount = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvDataPath)
        .pipe(csv())
        .on('data', (row) => {
          // Transform CSV data to match our schema
          const airport = {
            id: parseInt(row.id) || null,
            ident: row.ident || '',
            type: row.type || '',
            name: row.name || '',
            latitude_deg: parseFloat(row.latitude_deg) || 0,
            longitude_deg: parseFloat(row.longitude_deg) || 0,
            elevation_ft: row.elevation_ft ? parseInt(row.elevation_ft) : null,
            continent: row.continent || '',
            iso_country: row.iso_country || '',
            iso_region: row.iso_region || '',
            municipality: row.municipality || '',
            scheduled_service: row.scheduled_service || '',
            icao_code: row.icao_code || '',
            iata_code: row.iata_code || '',
            gps_code: row.gps_code || '',
            local_code: row.local_code || '',
            home_link: row.home_link || '',
            wikipedia_link: row.wikipedia_link || '',
            keywords: row.keywords || ''
          };

          // Only add airports that have valid coordinates and name
          if (airport.name && airport.latitude_deg !== 0 && airport.longitude_deg !== 0) {
            airports.push(airport);
          }

          processedCount++;
          if (processedCount % 10000 === 0) {
            console.log(`📊 Processed ${processedCount} rows...`);
          }
        })
        .on('end', async () => {
          console.log(`📊 Total valid airports found: ${airports.length}`);
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

          console.log(`🎉 Successfully seeded ${insertedCount} airports from CSV!`);
          
          // Create indexes for better performance
          console.log('🔍 Creating indexes...');
          try {
            await Airport.collection.createIndex({ ident: 1 });
            await Airport.collection.createIndex({ icao_code: 1 });
            await Airport.collection.createIndex({ iata_code: 1 });
            await Airport.collection.createIndex({ name: "text", municipality: "text", iso_country: "text" });
            await Airport.collection.createIndex({ municipality: 1 });
            await Airport.collection.createIndex({ iso_country: 1 });
            await Airport.collection.createIndex({ iso_region: 1 });
            await Airport.collection.createIndex({ type: 1 });
            console.log('✅ Indexes created successfully');
          } catch (indexError) {
            console.log('⚠️  Some indexes already exist, continuing...');
          }

          resolve();
        })
        .on('error', (error) => {
          console.error('❌ Error reading CSV file:', error.message);
          reject(error);
        });
    });

  } catch (error) {
    console.error('❌ Error seeding airports from CSV:', error.message);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    
    // Check if user wants to import from CSV file
    const shouldImport = process.argv.includes('--import');
    
    if (shouldImport) {
      await seedAirportsFromCSV();
      console.log('🎉 Airport data import from CSV completed successfully!');
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

module.exports = { seedAirportsFromCSV, checkAirportData };
