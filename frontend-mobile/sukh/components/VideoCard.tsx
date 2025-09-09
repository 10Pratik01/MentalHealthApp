import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

interface VideoCardProps {
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  onPress: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  title,
  description,
  thumbnail,
  duration,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-64 mr-4 bg-gray-800 rounded-xl overflow-hidden"
    >
      <View className="relative">
        <Image
          source={{ uri: thumbnail }}
          className="w-full h-40"
          resizeMode="cover"
        />
        <View className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded">
          <Text className="text-white text-xs font-medium">{duration}</Text>
        </View>
      </View>
      
      <View className="p-3">
        <Text className="text-white text-lg font-semibold mb-1" numberOfLines={2}>
          {title}
        </Text>
        <Text className="text-gray-400 text-sm" numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};