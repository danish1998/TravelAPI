const mongoose = require('mongoose');
const Airport = require('./Models/Airport');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

const createIndexes = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not set');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    });
    console.log('✅ Connected to MongoDB');

    console.log('Creating indexes for better performance...');
    
    // Create indexes
    await Airport.collection.createIndex({ ident: 1 });
    await Airport.collection.createIndex({ icao_code: 1 }, { sparse: true });
    await Airport.collection.createIndex({ iata_code: 1 }, { sparse: true });
    await Airport.collection.createIndex({ name: "text", municipality: "text", iso_country: "text" });
    await Airport.collection.createIndex({ municipality: 1 });
    await Airport.collection.createIndex({ iso_country: 1 });
    await Airport.collection.createIndex({ iso_region: 1 });
    await Airport.collection.createIndex({ type: 1 });
    
    // Create compound indexes for better performance
    await Airport.collection.createIndex({ type: 1, iso_country: 1 });
    await Airport.collection.createIndex({ type: 1, municipality: 1 });
    await Airport.collection.createIndex({ iata_code: 1, type: 1 });
    await Airport.collection.createIndex({ icao_code: 1, type: 1 });

    console.log('✅ All indexes created successfully');
    
    // Get index information
    const indexes = await Airport.collection.getIndexes();
    console.log('📊 Total indexes:', indexes.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();
