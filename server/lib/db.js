import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // THIS IS THE CRUCIAL TEST
    console.log("My URI is exactly:", process.env.MONGODB_URI); 
    
    mongoose.connection.on('connected', () => {
      console.log('Database connected');
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/chatapp`);
  } catch (error) {
    console.log("Connection Error: ", error.message);
  }
};