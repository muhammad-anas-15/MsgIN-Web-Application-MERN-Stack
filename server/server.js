import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

/* ---------------- DATABASE CONNECTION ---------------- */
// Vercel Optimization: Initiate connection immediately, don't wait for a function wrapper.
// Mongoose will "buffer" (queue) requests until the connection is ready.
connectDB().catch(err => console.error("Database Connection Error:", err));

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://msgin-client.vercel.app", // Ensure this matches your EXACT frontend URL
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

/* ---------------- LOCAL SERVER SETUP ---------------- */
// Only listen to port if running locally. Vercel handles this automatically in the cloud.
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on PORT: ${PORT}`);
  });
}

// Export the app for Vercel
export default app;