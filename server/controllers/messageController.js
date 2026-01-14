import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

// Get all users except the logged-in one
const getUsersForSidebar = async (req, res) => {
  try 
  {
     // The user ID is added to req.user by the protectRoute middleware
     const userId = req.user._id;

     //  Get all other users
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    // Count unseen messages
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    // Send proper 500 status on internal failure
    res.status(500).json({ success: false, message: "Internal server error while fetching users." });
  }
};

// Get all messages for selected user
const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false }, // Only mark unseen messages
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ success: false, message: "Internal server error while fetching messages." });
  }
};

//  Mark message as seen
const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log("Error in markMessageAsSeen:", error.message);
    res.status(500).json({ success: false, message: "Internal server error while marking message as seen." });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ success: false, message: "Internal server error while sending message." });
  }
};

export { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage };
