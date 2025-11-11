import mongoose from "mongoose";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("✅ Database Connected"));

    await mongoose.connect(`${process.env.MONGODB_URI}/chat-ap`)
  }
  catch(error){
     console.error("❌ Failed to connect to MongoDB:", error.message);
  }
};

export default connectDB;
