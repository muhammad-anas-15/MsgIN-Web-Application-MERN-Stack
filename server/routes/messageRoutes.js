import express from "express";
import {protectRoute} from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router(); 

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);

// now router of function mark mesage as seen.
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// now router of function send mesage.
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter;