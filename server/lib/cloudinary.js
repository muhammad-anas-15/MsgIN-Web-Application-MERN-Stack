import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load .env here — must happen before accessing process.env
dotenv.config({ path: './.env' }); // explicitly point to .env in server folder

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Cloudinary Error: Environment variables are not set during config execution.");
}

export default cloudinary;
