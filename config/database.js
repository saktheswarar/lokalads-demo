import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (mongoose.connection.readyState >= 1) {
    console.log('✅ MongoDB already connected.');
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI not found in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI); // no deprecated options

    console.log('✅ MongoDB connected successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw new Error('MongoDB connection failed');
  }
};

export default connectDB;
