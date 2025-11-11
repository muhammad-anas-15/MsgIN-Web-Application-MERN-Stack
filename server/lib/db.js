import mongoose from "mongoose";

// Use a global variable to cache the database connection status across function invocations
// In Vercel, this persists the connection in the warm function environment.
let isConnected = false;

// Function to connect to MongoDB
const connectDB = async () => {
    // Check if we already have a successful connection
    if (isConnected) {
        // console.log("✅ Using existing database connection.");
        return;
    }

    try {
        // If not connected, attempt to connect
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-ap`);

        // Check the connection state immediately after successful connect
        if (mongoose.connection.readyState === 1) {
            console.log("✅ Database Connected for Vercel.");
            isConnected = true; // Set flag on successful connection
        } else {
            throw new Error("Mongoose readyState not 1 after connect.");
        }
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB. Check MONGODB_URI secret:", error.message);

        // CRITICAL: Throwing the error prevents the Vercel function from completing,
        // which helps Vercel log the failure instead of silently crashing.
        throw new Error("Database connection failure. Check Vercel logs/secrets.");
    }
};

export default connectDB;
