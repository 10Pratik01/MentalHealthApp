import express from "express";
import {
  createChatSession,
  sendMessage,
  getChatHistory,
  getUserChats,
  updateRiskAssessment,
} from "../controller/chat.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createChatSession); // start a new chat
router.post("/:chatId/message", protect, sendMessage); // send message
router.get("/:chatId", protect, getChatHistory); // get chat history
router.get("/", protect, getUserChats); // list all chats
router.put("/:chatId/risk", protect, updateRiskAssessment); // update risk assessment

export default router;
