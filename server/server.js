import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://msgin-client.vercel.app",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.send("MsgIN Backend is Running! 🚀");
});

app.get("/api/status", (req, res) => {
  res.json({ status: "Server is live" });
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

/* ---------------- DATABASE + SERVER ---------------- */
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB(); 
    console.log("MongoDB Connected");

    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on PORT: ${PORT}`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
}

startServer();

// for Vercel
export default app;
