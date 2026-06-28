import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // FIX: Removed debug console.log that was printing your connection string to logs
    mongoose.connection.on('connected', () => {
      console.log('Database connected');
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/chatapp`);
  } catch (error) {
    console.log('DB Connection Error:', error.message);
    process.exit(1); // Exit so the error is visible immediately
  }
};