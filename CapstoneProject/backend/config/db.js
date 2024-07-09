import mongoose from "mongoose";
import dotenv from 'dotenv';

// Ensure the environment variables are loaded correctly
dotenv.config();
console.log(process.env.mongoURI);

export const connectDB = async () => {
  try {
    console.log("db connecting...");
    const res = await mongoose.connect(process.env.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongodb connected with server ${res.connection.host}`);
  } catch (error) {
    console.log("mongodb connection failed!");
    console.log(error);
  }
};
