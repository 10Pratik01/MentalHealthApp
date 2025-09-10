import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

interface Message {
  _id?: string;
  sender: "user" | "bot";
  message: string;
  timestamp: string;
}

const API_URL = "http://10.0.13.68:5432/api/chat"; // your backend
const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Retrieve token from AsyncStorage
//   const getToken = async () => {
//     try {
//       return await AsyncStorage.getItem("token");
//     } catch (e) {
//       console.error("Error retrieving token:", e);
//       return null;
//     }
//   };

  // Initialize or retrieve chat session
  const initializeChat = async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzA0MWNiNjFkZmVkODhjZTU5NzcwNiIsImlhdCI6MTc1NzQ0MzIyNywiZXhwIjoxNzU4MDQ4MDI3fQ.9L_BDm20BjgHXG8yN2kj7ikH1sPZFi1q_zfe5ogLjwY';
    if (!token) {
      console.error("Token not found");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const chat = response.data.chat;
      setChatId(chat._id);
      setMessages(chat.messages || []);
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send message to backend
  const sendMessageToBackend = async (text: string) => {
    if (!chatId) return;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzA0MWNiNjFkZmVkODhjZTU5NzcwNiIsImlhdCI6MTc1NzQ0MzIyNywiZXhwIjoxNzU4MDQ4MDI3fQ.9L_BDm20BjgHXG8yN2kj7ikH1sPZFi1q_zfe5ogLjwY';
    if (!token) return;

    try {
      const response = await axios.post(
        `${API_URL}/${chatId}/message`,
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newMessages = response.data.messages;
      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Add user message locally before sending
  const addUserMessage = (text: string) => {
    const message: Message = {
      sender: "user",
      message: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const message = inputText.trim();
    addUserMessage(message);
    sendMessageToBackend(message);
    setInputText("");
  };

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#34D399" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-700">
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="text-white text-lg font-semibold">Mental Health Bot</Text>
            <Text className="text-gray-400 text-sm">Online</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text className="text-white text-xl">🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View
            key={msg._id || index}
            className={`flex-row mb-4 ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
          >
            {msg.sender === "bot" && <Text className="text-2xl mr-2">🤖</Text>}
            <View
              className={`max-w-xs px-4 py-3 rounded-2xl ${
                msg.sender === "bot" ? "bg-gray-200 rounded-bl-md" : "bg-green-500 rounded-br-md"
              }`}
            >
              <Text className={`text-sm ${msg.sender === "bot" ? "text-gray-800" : "text-white"}`}>
                {msg.message}
              </Text>
            </View>
            {msg.sender !== "bot" && <Text className="text-2xl ml-2">🙂</Text>}
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-700 bg-gray-800">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-full mr-3"
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            inputText.trim() ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          <Text className="text-white text-lg">✈</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatbotPage;
