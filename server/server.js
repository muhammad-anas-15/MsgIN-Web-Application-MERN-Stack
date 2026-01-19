import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

// Initialize Express App
const app = express();
// Create HTTP server (Needed for Socket.io)
const server = http.createServer(app);

// Initialize Socket.io
// Note: On Vercel, this will likely fallback to polling or fail for real-time updates
export const io = new Server(server, {
  cors: {
    // Allow both your Local Frontend AND Vercel Frontend
    origin: [
      "http://localhost:5173", 
      "https://msgin-client.vercel.app", // REPLACE THIS if your frontend link is different
      process.env.CLIENT_URL
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store online users
export const userSocketMap = {};

// Socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://msgin-client.vercel.app",
      process.env.CLIENT_URL
    ],
    credentials: true
  })
);

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("MsgIN Backend is Running! 🚀");
});
app.get("/api/status", (req, res) => res.send("Server is live"));

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);


const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on PORT: ${PORT}`);
  });
}

// Export the EXPRESS APP for Vercel Serverless
export default app;