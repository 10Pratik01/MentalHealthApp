import React, { useState, useRef, useEffect } from 'react';
import logo from '@/assets/icons/bot-icon.png';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Start the conversation with a welcome message
    if (messages.length === 0) {
      addBotMessage("Hi! How are you doing?");
    }
  }, []);

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    addUserMessage(inputText);
    const userMessage = inputText;
    setInputText('');

    // Simulate bot response
    simulateTyping(() => {
      const botResponse = generateBotResponse(userMessage);
      addBotMessage(botResponse);
    });
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('stressed') || message.includes('stress')) {
      return "I understand you're feeling stressed. Here are some practical steps to help you manage stress:\n\n1. Take deep breaths\n2. Go for a short walk\n3. Practice mindfulness\n4. Talk to someone you trust\n\nWould you like me to elaborate on any of these techniques?";
    } else if (message.includes('sad') || message.includes('depressed')) {
      return "I'm sorry to hear you're feeling this way. It's important to remember that these feelings are valid and temporary. Consider:\n\n• Reaching out to a mental health professional\n• Engaging in activities you enjoy\n• Maintaining a routine\n• Getting adequate sleep\n\nYou're not alone in this. Would you like to talk more about what's on your mind?";
    } else if (message.includes('anxious') || message.includes('anxiety')) {
      return "Anxiety can be overwhelming, but there are ways to manage it:\n\n• Practice grounding techniques (5-4-3-2-1 method)\n• Try progressive muscle relaxation\n• Limit caffeine intake\n• Focus on what you can control\n\nWould you like me to guide you through a breathing exercise?";
    } else if (message.includes('tired') || message.includes('exhausted')) {
      return "Fatigue can really impact your well-being. Here are some suggestions:\n\n• Ensure you're getting 7-9 hours of sleep\n• Stay hydrated\n• Eat nutritious meals\n• Take short breaks throughout the day\n• Consider if you need to reduce your workload\n\nHow has your sleep been lately?";
    } else if (message.includes('angry') || message.includes('frustrated')) {
      return "It's completely normal to feel angry or frustrated. Here are some healthy ways to process these emotions:\n\n• Take a timeout to cool down\n• Express your feelings in a journal\n• Engage in physical activity\n• Practice deep breathing\n• Identify what triggered the emotion\n\nWhat's been causing these feelings for you?";
    } else if (message.includes('lonely') || message.includes('alone')) {
      return "Feeling lonely can be really difficult. Here are some ways to connect:\n\n• Reach out to friends or family\n• Join a community group or club\n• Consider volunteering\n• Practice self-compassion\n• Engage in hobbies you enjoy\n\nRemember, it's okay to ask for support. Would you like to talk about what's making you feel this way?";
    } else if (message.includes('help') || message.includes('support')) {
      return "I'm here to help and support you. Here are some resources:\n\n• Crisis helplines are available 24/7\n• Consider speaking with a mental health professional\n• Practice self-care activities\n• Build a support network\n• Remember that seeking help is a sign of strength\n\nWhat specific support are you looking for right now?";
    } else if (message.includes('good') || message.includes('great') || message.includes('fine') || message.includes('okay')) {
      return "That's wonderful to hear! It's great that you're feeling positive. Remember to:\n\n• Celebrate these good moments\n• Practice gratitude\n• Continue with activities that make you feel good\n• Share your positive energy with others\n\nIs there anything specific that's contributing to your good mood today?";
    } else {
      return "Thank you for sharing that with me. I'm here to listen and support you. Could you tell me more about how you're feeling or what's on your mind? I want to make sure I can provide the most helpful response for you.";
    }
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      className={`flex-row mb-4 ${message.isBot ? 'justify-start' : 'justify-end'}`}
    >
      {message.isBot && (
        <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center mr-3">
          <Image
            source={logo}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </View>
      )}
      
      <View
        className={`max-w-xs px-4 py-3 rounded-2xl ${
          message.isBot
            ? 'bg-gray-200 rounded-bl-md'
            : 'bg-green-500 rounded-br-md'
        }`}
      >
        <Text
          className={`text-sm ${
            message.isBot ? 'text-gray-800' : 'text-white'
          }`}
        >
          {message.text}
        </Text>
      </View>
      
      {!message.isBot && (
        <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center ml-3">
          <Image
            source={{ uri: 'https://example.com/user-avatar.jpg' }}
            className="w-10 h-10 rounded-full"
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-700">
        <View className="flex-row items-center">
          <Image
            source={{ uri: 'https://example.com/user-avatar.jpg' }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="text-white text-lg font-semibold">Mental Health Bot</Text>
            <Text className="text-gray-400 text-sm">Online</Text>
          </View>
        </View>
        
        <TouchableOpacity className="relative">
          <View className="w-6 h-6">
            <Text className="text-white text-lg">🔔</Text>
          </View>
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}
        
        {isTyping && (
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center mr-3">
              <Image
                source={logo}
                className="w-8 h-8"
                resizeMode="contain"
              />
            </View>
            <View className="bg-gray-200 px-4 py-3 rounded-2xl rounded-bl-md">
              <Text className="text-gray-600">Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Message Input */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-700">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message"
          placeholderTextColor="#9CA3AF"
          className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-full mr-3"
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            inputText.trim() ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          <Text className="text-white text-lg">✈️</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View className="bg-white rounded-t-3xl px-6 py-4">
        <View className="flex-row justify-around items-center">
          <TouchableOpacity className="items-center">
            <Text className="text-gray-400 text-xl">🏠</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Text className="text-gray-400 text-xl">📹</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Text className="text-green-500 text-xl">💬</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Text className="text-gray-400 text-xl">👥</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatbotPage;