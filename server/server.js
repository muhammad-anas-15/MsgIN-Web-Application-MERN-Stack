import dotenv from "dotenv";
// ✅ Load environment variables FIRST
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import connectDB from "./lib/db.js"; // We will call this on a request
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cloudinary from './lib/cloudinary.js';

// 🎯 CRITICAL FIX: Configure Cloudinary NOW that process.env is ready
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("✅ MONGODB_URI:", process.env.MONGODB_URI);

// Create Express app
const app = express();

// --- Socket.IO setup (for local dev / different host) ---
// Note: Vercel serverless functions do NOT support long-lived connections.
// Socket.IO will require a dedicated server (e.g., Redis / Fly.io) for production.

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

// ✅ Updated CORS setup to allow both frontend ports safely
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://msg-in-web-application-mern-stack-b.vercel.app" // Add your Vercel frontend domain here
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true, // Important for cookies / tokens
    })
);

// 🎯 CRITICAL FIX: Add a database connection middleware
// This ensures the database connects on the first request 
// and re-uses the connection pool for subsequent requests.
app.use(async (req, res, next) => {
    // Only connect if the connection is not already established
    if (connectDB && connectDB.readyState === 0) {
        await connectDB();
    }
    next();
});

// Routes
app.get("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ----------------------------------------------------
// CRITICAL: Remove server listening logic for Vercel
// ----------------------------------------------------
/*
await connectDB();
if(process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on PORT: ${PORT}`));
}
*/

// Export the Express application (app) for Vercel
export default app; // 🎯 CRITICAL: Changed from server to app
