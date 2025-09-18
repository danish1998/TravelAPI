const mongoose = require('mongoose');

const connectDB = async () => {
  const allowStartWithoutDb = String(process.env.ALLOW_START_WITHOUT_DB || '').toLowerCase() === 'true';
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      if (allowStartWithoutDb) {
        console.warn('Warning: MONGODB_URI not set. Starting without DB because ALLOW_START_WITHOUT_DB=true');
        return;
      }
      throw new Error('Missing MongoDB URI. Set env var MONGODB_URI');
    }
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (allowStartWithoutDb) {
      console.warn('Continuing without DB because ALLOW_START_WITHOUT_DB=true');
      return;
    }
    process.exit(1);
  }
};

module.exports = { connectDB };