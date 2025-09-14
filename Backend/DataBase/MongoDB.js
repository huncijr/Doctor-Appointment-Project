import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("MongoDB Loaded ");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
