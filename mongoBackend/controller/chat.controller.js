import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Choose model
const MODEL_NAME = "gemini-2.5-flash";

// Crisis keywords for immediate detection (backup safety check)
const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end it all",
  "hurt myself",
  "die",
  "death",
];

// @desc    Create a new chat session
// @route   POST /api/chat
// @access  Private
export const createChatSession = asyncHandler(async (req, res) => {
  const { initialMessage } = req.body;

  // Check if user already has an active chat session
  let chat = await Chat.findOne({ userId: req.user.id });

  if (!chat) {
    chat = await Chat.create({
      userId: req.user.id,
      messages: [],
      riskAssessment: {
        riskLevel: "low",
      },
    });
  }

  // Add welcome message if no messages exist
  if (chat.messages.length === 0) {
    const welcomeMessage = {
      sender: "bot",
      message:
        "Hello! I'm your mental health support assistant. How are you feeling today? I'm here to listen and help.",
      timestamp: new Date(),
    };
    chat.messages.push(welcomeMessage);
  }

  // Add initial user message if provided
  if (initialMessage) {
    const userMessage = {
      sender: "user",
      message: initialMessage,
      timestamp: new Date(),
    };
    chat.messages.push(userMessage);

    try {
      const botResponse = await getBotResponseFromGemini(
        initialMessage,
        chat.messages,
        chat.riskAssessment
      );

      chat.messages.push({
        sender: "bot",
        message: botResponse.message,
        timestamp: new Date(),
      });

      if (botResponse.riskAssessment) {
        chat.riskAssessment = {
          ...chat.riskAssessment,
          ...botResponse.riskAssessment,
        };
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      chat.messages.push({
        sender: "bot",
        message:
          "I'm here to help, but I'm experiencing some technical difficulties. Please try again in a moment, or if this is urgent, consider reaching out to a crisis helpline.",
        timestamp: new Date(),
      });
    }
  }

  await chat.save();
  await chat.populate("userId", "name email riskLevel");

  res.status(201).json({
    success: true,
    message: "Chat session created successfully",
    chat,
  });
});

// @desc    Send a message in chat
// @route   POST /api/chat/:chatId/message
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const { chatId } = req.params;

  if (!message || message.trim().length === 0) {
    res.status(400);
    throw new Error("Message content is required");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    userId: req.user.id,
  });

  if (!chat) {
    res.status(404);
    throw new Error("Chat session not found");
  }

  // Add user message
  const userMessage = {
    sender: "user",
    message: message.trim(),
    timestamp: new Date(),
  };
  chat.messages.push(userMessage);

  // Immediate crisis keyword check
  const isCrisis = CRISIS_KEYWORDS.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );

  if (isCrisis) {
    const crisisResponse = {
      sender: "bot",
      message:
        "I'm really concerned about what you're sharing. Your safety is the most important thing right now. Please consider reaching out to a crisis helpline immediately: National Suicide Prevention Lifeline: 988. Would you like me to provide more emergency contact numbers?",
      timestamp: new Date(),
    };
    chat.messages.push(crisisResponse);
    chat.riskAssessment.riskLevel = "high";

    await User.findByIdAndUpdate(req.user.id, { riskLevel: "high" });
    await chat.save();

    return res.status(200).json({
      success: true,
      messages: [userMessage, crisisResponse],
      riskAssessment: chat.riskAssessment,
      crisis: true,
    });
  }

  // Get response from Gemini
  try {
    const botResponse = await getBotResponseFromGemini(
      message,
      chat.messages,
      chat.riskAssessment
    );

    const botMessage = {
      sender: "bot",
      message: botResponse.message,
      timestamp: new Date(),
    };
    chat.messages.push(botMessage);

    if (botResponse.riskAssessment) {
      chat.riskAssessment = {
        ...chat.riskAssessment,
        ...botResponse.riskAssessment,
      };

      if (botResponse.riskAssessment.riskLevel === "high") {
        await User.findByIdAndUpdate(req.user.id, { riskLevel: "high" });
      }
    }

    await chat.save();

    res.status(200).json({
      success: true,
      messages: [userMessage, botMessage],
      riskAssessment: chat.riskAssessment,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    const fallbackMessage = {
      sender: "bot",
      message:
        "I'm having trouble processing your message right now, but I want you to know that I'm here for you. If you're in crisis, please reach out to a mental health professional or emergency services immediately.",
      timestamp: new Date(),
    };
    chat.messages.push(fallbackMessage);
    await chat.save();

    res.status(500).json({
      success: false,
      message: "Error processing your message",
      messages: [userMessage, fallbackMessage],
      error: "Gemini API unavailable",
    });
  }
});

// @desc    Get chat history
// @route   GET /api/chat/:chatId
// @access  Private
export const getChatHistory = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { limit = 50, page = 1 } = req.query;

  const chat = await Chat.findOne({
    _id: chatId,
    userId: req.user.id,
  }).populate("userId", "name email riskLevel");

  if (!chat) {
    res.status(404);
    throw new Error("Chat session not found");
  }

  const totalMessages = chat.messages.length;
  const startIndex = Math.max(0, totalMessages - page * limit);
  const endIndex = totalMessages - (page - 1) * limit;

  const paginatedMessages = chat.messages.slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    chat: {
      ...chat.toObject(),
      messages: paginatedMessages,
    },
    pagination: {
      currentPage: parseInt(page),
      totalMessages,
      hasMoreMessages: startIndex > 0,
    },
  });
});

// Helper function for Gemini
async function getBotResponseFromGemini(userMessage, chatHistory, currentRiskAssessment) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const formattedHistory = chatHistory.slice(-10).map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.message }],
    }));

    formattedHistory.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const result = await model.generateContent({
      contents: formattedHistory,
    });

    const responseText = result.response.text();

    return {
      message: responseText,
      riskAssessment: null,
      confidence: null,
      intent: null,
    };
  } catch (error) {
    console.error("Gemini API Request Error:", error);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

// @desc    Get all chats for a user
// @route   GET /api/chat
// @access  Private
export const getUserChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ userId: req.user.id })
    .populate("userId", "name email")
    .sort({ updatedAt: -1 });

  const chatSummaries = chats.map((chat) => ({
    _id: chat._id,
    lastMessage: chat.messages[chat.messages.length - 1],
    messageCount: chat.messages.length,
    riskAssessment: chat.riskAssessment,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  }));

  res.status(200).json({
    success: true,
    chats: chatSummaries,
  });
});

// @desc    Update risk assessment
// @route   PUT /api/chat/:chatId/risk
// @access  Private
export const updateRiskAssessment = asyncHandler(async (req, res) => {
  const { phq9Score, gad7Score, riskLevel } = req.body;
  const { chatId } = req.params;

  const chat = await Chat.findOne({
    _id: chatId,
    userId: req.user.id,
  });

  if (!chat) {
    res.status(404);
    throw new Error("Chat session not found");
  }

  if (phq9Score !== undefined) chat.riskAssessment.phq9Score = phq9Score;
  if (gad7Score !== undefined) chat.riskAssessment.gad7Score = gad7Score;
  if (riskLevel) chat.riskAssessment.riskLevel = riskLevel;

  await chat.save();

  res.status(200).json({
    success: true,
    message: "Risk assessment updated successfully",
    riskAssessment: chat.riskAssessment,
  });
});
