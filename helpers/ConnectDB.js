const mongoose = require('mongoose');

const connectDB = async () => {
  const allowStartWithoutDb = String(process.env.ALLOW_START_WITHOUT_DB || '').toLowerCase() === 'true';
  try {
    const uri = process.env.MONGODB_URI;
    console.log('MongoDB URI check:', uri ? 'SET' : 'NOT SET');
    console.log('URI length:', uri ? uri.length : 0);
    
    if (!uri) {
      if (allowStartWithoutDb) {
        console.warn('Warning: MONGODB_URI not set. Starting without DB because ALLOW_START_WITHOUT_DB=true');
        return;
      }
      throw new Error('Missing MongoDB URI. Set env var MONGODB_URI');
    }
    
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error details:', error);
    if (allowStartWithoutDb) {
      console.warn('Continuing without DB because ALLOW_START_WITHOUT_DB=true');
      return;
    }
    process.exit(1);
  }
};

module.exports = { connectDB };