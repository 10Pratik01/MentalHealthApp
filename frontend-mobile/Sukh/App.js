import './global.css';
import React from 'react';
import { Text, View, StatusBar } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-red-500 items-center justify-center">
      <StatusBar style="light" />
      
      {/* Test different types of styles */}
      <View className="bg-white p-8 rounded-xl shadow-lg">
        <Text className="text-blue-600 text-xl font-bold mb-4">
          🎉 Tailwind Test
        </Text>
        <Text className="text-gray-200 text-center">
          If you see colors and styling, it's working!
        </Text>
      </View>
      
      {/* Test spacing and colors */}
      <View className="mt-6 flex-row space-x-4">
        <View className="w-12 h-12 bg-green-400 rounded-full" />
        <View className="w-12 h-12 bg-blue-400 rounded-full" />
        <View className="w-12 h-12 bg-purple-400 rounded-full" />
      </View>
    </View>
  );
}
