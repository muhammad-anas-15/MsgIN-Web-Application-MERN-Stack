// server/lib/cloudinary.js

// The whole content is now imported to server.js 

// import { v2 as cloudinary } from "cloudinary";

// // Check if keys are loaded before configuring
// if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET,
//     });
// } else {
//     // This is the true state when the error occurs
//     console.error("Cloudinary Error: Environment variables are not set during config execution.");
// }

export default cloudinary;