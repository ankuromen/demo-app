import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getMessages, sendMessage, getConversations, searchMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);
router.get("/search/:conversationId", protectRoute, searchMessages);

export default router;
