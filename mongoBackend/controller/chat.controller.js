// import { Chat } from "../models/chat.model.js";
// import { User } from "../models/user.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import axios from 'axios';

// // Flask API configuration
// const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';
// const FLASK_API_TIMEOUT = 10000; // 10 seconds timeout

// // Crisis keywords for immediate detection (backup safety check)
// const CRISIS_KEYWORDS = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'die', 'death'];

// // @desc    Create a new chat session
// // @route   POST /api/chat
// // @access  Private
// export const createChatSession = asyncHandler(async (req, res) => {
//   const { initialMessage } = req.body;

//   // Check if user already has an active chat session
//   let chat = await Chat.findOne({ userId: req.user.id });

//   if (!chat) {
//     // Create new chat session
//     chat = await Chat.create({
//       userId: req.user.id,
//       messages: [],
//       riskAssessment: {
//         riskLevel: "low"
//       }
//     });
//   }

//   // Add welcome message if no messages exist
//   if (chat.messages.length === 0) {
//     const welcomeMessage = {
//       sender: "bot",
//       message: "Hello! I'm your mental health support assistant. How are you feeling today? I'm here to listen and help.",
//       timestamp: new Date()
//     };
//     chat.messages.push(welcomeMessage);
//   }

//   // Add initial user message if provided
//   if (initialMessage) {
//     const userMessage = {
//       sender: "user",
//       message: initialMessage,
//       timestamp: new Date()
//     };
//     chat.messages.push(userMessage);

//     // Get response from Flask API
//     try {
//       const botResponse = await getBotResponseFromFlask(
//         initialMessage, 
//         chat.messages, 
//         chat.riskAssessment
//       );
      
//       chat.messages.push({
//         sender: "bot",
//         message: botResponse.message,
//         timestamp: new Date()
//       });

//       // Update risk assessment if provided by Flask API
//       if (botResponse.riskAssessment) {
//         chat.riskAssessment = { 
//           ...chat.riskAssessment, 
//           ...botResponse.riskAssessment 
//         };
//       }
//     } catch (error) {
//       console.error('Flask API Error:', error);
//       // Fallback response if Flask API fails
//       chat.messages.push({
//         sender: "bot",
//         message: "I'm here to help, but I'm experiencing some technical difficulties. Please try again in a moment, or if this is urgent, consider reaching out to a crisis helpline.",
//         timestamp: new Date()
//       });
//     }
//   }

//   await chat.save();
//   await chat.populate('userId', 'name email riskLevel');

//   res.status(201).json({
//     success: true,
//     message: "Chat session created successfully",
//     chat
//   });
// });

// // @desc    Send a message in chat
// // @route   POST /api/chat/:chatId/message
// // @access  Private
// export const sendMessage = asyncHandler(async (req, res) => {
//   const { message } = req.body;
//   const { chatId } = req.params;

//   if (!message || message.trim().length === 0) {
//     res.status(400);
//     throw new Error("Message content is required");
//   }

//   const chat = await Chat.findOne({ 
//     _id: chatId, 
//     userId: req.user.id 
//   });

//   if (!chat) {
//     res.status(404);
//     throw new Error("Chat session not found");
//   }

//   // Add user message
//   const userMessage = {
//     sender: "user",
//     message: message.trim(),
//     timestamp: new Date()
//   };
//   chat.messages.push(userMessage);

//   // Check for immediate crisis keywords (safety check)
//   const isCrisis = CRISIS_KEYWORDS.some(keyword => 
//     message.toLowerCase().includes(keyword)
//   );

//   if (isCrisis) {
//     // Immediate crisis response - don't wait for Flask API
//     const crisisResponse = {
//       sender: "bot",
//       message: "I'm really concerned about what you're sharing. Your safety is the most important thing right now. Please consider reaching out to a crisis helpline immediately: National Suicide Prevention Lifeline: 988. Would you like me to provide more emergency contact numbers?",
//       timestamp: new Date()
//     };
//     chat.messages.push(crisisResponse);
//     chat.riskAssessment.riskLevel = "high";
    
//     // Update user's risk level
//     await User.findByIdAndUpdate(req.user.id, { riskLevel: 'high' });
    
//     await chat.save();
    
//     return res.status(200).json({
//       success: true,
//       messages: [userMessage, crisisResponse],
//       riskAssessment: chat.riskAssessment,
//       crisis: true
//     });
//   }

//   // Get response from Flask API
//   try {
//     const botResponse = await getBotResponseFromFlask(
//       message, 
//       chat.messages, 
//       chat.riskAssessment
//     );
    
//     const botMessage = {
//       sender: "bot",
//       message: botResponse.message,
//       timestamp: new Date()
//     };
//     chat.messages.push(botMessage);

//     // Update risk assessment if provided by Flask API
//     if (botResponse.riskAssessment) {
//       chat.riskAssessment = { 
//         ...chat.riskAssessment, 
//         ...botResponse.riskAssessment 
//       };
      
//       // Update user's risk level if assessment indicates high risk
//       if (botResponse.riskAssessment.riskLevel === 'high') {
//         await User.findByIdAndUpdate(req.user.id, { riskLevel: 'high' });
//       }
//     }

//     await chat.save();

//     res.status(200).json({
//       success: true,
//       messages: [userMessage, botMessage],
//       riskAssessment: chat.riskAssessment
//     });

//   } catch (error) {
//     console.error('Flask API Error:', error);
    
//     // Fallback response
//     const fallbackMessage = {
//       sender: "bot",
//       message: "I'm having trouble processing your message right now, but I want you to know that I'm here for you. If you're in crisis, please reach out to a mental health professional or emergency services immediately.",
//       timestamp: new Date()
//     };
//     chat.messages.push(fallbackMessage);
//     await chat.save();

//     res.status(500).json({
//       success: false,
//       message: "Error processing your message",
//       messages: [userMessage, fallbackMessage],
//       error: "Flask API unavailable"
//     });
//   }
// });

// // @desc    Get chat history
// // @route   GET /api/chat/:chatId
// // @access  Private
// export const getChatHistory = asyncHandler(async (req, res) => {
//   const { chatId } = req.params;
//   const { limit = 50, page = 1 } = req.query;

//   const chat = await Chat.findOne({ 
//     _id: chatId, 
//     userId: req.user.id 
//   }).populate('userId', 'name email riskLevel');

//   if (!chat) {
//     res.status(404);
//     throw new Error("Chat session not found");
//   }

//   // Paginate messages (get latest messages)
//   const totalMessages = chat.messages.length;
//   const startIndex = Math.max(0, totalMessages - (page * limit));
//   const endIndex = totalMessages - ((page - 1) * limit);
  
//   const paginatedMessages = chat.messages.slice(startIndex, endIndex);

//   res.status(200).json({
//     success: true,
//     chat: {
//       ...chat.toObject(),
//       messages: paginatedMessages
//     },
//     pagination: {
//       currentPage: parseInt(page),
//       totalMessages,
//       hasMoreMessages: startIndex > 0
//     }
//   });
// });

// // @desc    Get Flask API health status
// // @route   GET /api/chat/health
// // @access  Private
// export const getFlaskAPIHealth = asyncHandler(async (req, res) => {
//   try {
//     const response = await axios.get(`${FLASK_API_URL}/health`, {
//       timeout: 5000
//     });
    
//     res.status(200).json({
//       success: true,
//       flaskAPI: {
//         status: 'healthy',
//         response: response.data
//       }
//     });
//   } catch (error) {
//     res.status(200).json({
//       success: true,
//       flaskAPI: {
//         status: 'unhealthy',
//         error: error.message
//       }
//     });
//   }
// });

// // Helper function to get bot response from Flask API
// async function getBotResponseFromFlask(userMessage, chatHistory, currentRiskAssessment) {
//   try {
//     // Prepare data for Flask API
//     const payload = {
//       message: userMessage,
//       chat_history: chatHistory.slice(-10), // Send last 10 messages for context
//       current_risk: currentRiskAssessment,
//       timestamp: new Date().toISOString()
//     };

//     // Make request to Flask API
//     const response = await axios.post(`${FLASK_API_URL}/chat/respond`, payload, {
//       timeout: FLASK_API_TIMEOUT,
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     });

//     // Extract response from Flask API
//     const flaskResponse = response.data;
    
//     return {
//       message: flaskResponse.response || flaskResponse.message,
//       riskAssessment: flaskResponse.risk_assessment || null,
//       confidence: flaskResponse.confidence || null,
//       intent: flaskResponse.intent || null
//     };

//   } catch (error) {
//     console.error('Flask API Request Error:', {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data
//     });
    
//     throw new Error(`Flask API Error: ${error.message}`);
//   }
// }

// // Rest of your existing controller methods...
// export const getUserChats = asyncHandler(async (req, res) => {
//   const chats = await Chat.find({ userId: req.user.id })
//     .populate('userId', 'name email')
//     .sort({ updatedAt: -1 });

//   const chatSummaries = chats.map(chat => ({
//     _id: chat._id,
//     lastMessage: chat.messages[chat.messages.length - 1],
//     messageCount: chat.messages.length,
//     riskAssessment: chat.riskAssessment,
//     createdAt: chat.createdAt,
//     updatedAt: chat.updatedAt
//   }));

//   res.status(200).json({
//     success: true,
//     chats: chatSummaries
//   });
// });

// export const updateRiskAssessment = asyncHandler(async (req, res) => {
//   const { phq9Score, gad7Score, riskLevel } = req.body;
//   const { chatId } = req.params;

//   const chat = await Chat.findOne({ 
//     _id: chatId, 
//     userId: req.user.id 
//   });

//   if (!chat) {
//     res.status(404);
//     throw new Error("Chat session not found");
//   }

//   if (phq9Score !== undefined) chat.riskAssessment.phq9Score = phq9Score;
//   if (gad7Score !== undefined) chat.riskAssessment.gad7Score = gad7Score;
//   if (riskLevel) chat.riskAssessment.riskLevel = riskLevel;

//   await chat.save();

//   res.status(200).json({
//     success: true,
//     message: "Risk assessment updated successfully",
//     riskAssessment: chat.riskAssessment
//   });
// });
