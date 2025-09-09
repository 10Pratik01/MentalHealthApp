import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white flex-row justify-around items-center py-2 border-t border-gray-200">
      <TouchableOpacity className="items-center">
        <Ionicons name="home" size={24} color="black" />
        <Text className="text-xs">Home</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center">
        <Ionicons name="book" size={24} color="black" />
        <Text className="text-xs">Journal</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center">
        <Ionicons name="search" size={24} color="black" />
        <Text className="text-xs">Explore</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center">
        <Ionicons name="person" size={24} color="black" />
        <Text className="text-xs">Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
