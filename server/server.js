import dotenv from "dotenv";
// Load environment variables FIRST
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";  

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());  

//  Updated CORS setup to allow both frontend ports safely
// const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// ✅ Add this Root Route for Health Checks
app.get("/", (req, res) => {
  res.send("MsgIN Backend is Running! 🚀");
});

// Routes
app.get("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB and start server
// await connectDB();

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on PORT: ${PORT}`);
// });

// // export server for vercel
// export default server;

// 🚀 START SERVER INSTANTLY (Don't wait for DB)
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on PORT: ${PORT}`);
  
  // Connect to DB in background
  connectDB()
    .then(() => console.log("✅ Database Connected"))
    .catch((err) => console.log("❌ DB Connection Error:", err));
});

// export server for vercel
export default server;




