import mongoose from 'mongoose';

const connectToDatabase = async () => {
  // Ensure MONGODB_URI is defined
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // If already connected, return early
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    // Connect to MongoDB without 'useNewUrlParser' and 'useUnifiedTopology' options
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('MongoDB connection failed');
  }
};

export default connectToDatabase;