import mongoose from 'mongoose';

// The MongoDB connection URI is retrieved from environment variables.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ev_chargers_mongo';

// Connects to the MongoDB database.
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Charger Service connected to MongoDB.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if the database connection fails.
  }
};

