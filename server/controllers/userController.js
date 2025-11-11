import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

/* ============================================================
   ✅ Get all users except the logged-in one
   ============================================================ */
const getUsersForSidebar = async (req, res) => {
  try {
    // The user ID is added to req.user by the protectRoute middleware
    const userId = req.user._id;

    // ✅ Get all other users (exclude current user)
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // ✅ Count unseen messages for each user
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
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error while fetching users.",
      });
  }
};

/* ============================================================
   ✅ Get all messages between logged-in user and selected user
   ============================================================ */
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

    // ✅ Mark unseen messages from selected user as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error while fetching messages.",
      });
  }
};

/* ============================================================
   ✅ Mark single message as seen
   ============================================================ */
const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.error("Error in markMessageAsSeen:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error while marking message as seen.",
      });
  }
};

/* ============================================================
   ✅ Send new message (with optional image via Cloudinary)
   ============================================================ */
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;

    // Upload image to Cloudinary if provided
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

    // ✅ Emit message to receiver via Socket.io if they’re online
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error while sending message.",
      });
  }
};

/* ============================================================
   ✅ Check authentication & return user for persistent login
   ============================================================ */
const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Authentication failed. User data missing.",
        });
    }

    res.json({
      success: true,
      message: "Session is active.",
      user: req.user,
    });
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error during session check.",
      });
  }
};

export {
  getUsersForSidebar,
  getMessages,
  markMessageAsSeen,
  sendMessage,
  checkAuth,
};
