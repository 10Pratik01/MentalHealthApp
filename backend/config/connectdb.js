import mongoose from "mongoose"; 

const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;

export const connectDB = async () => {
    await mongoose.connect(MONGODB_CONNECTION_URL)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
}