import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

interface MusicCardProps {
  title: string;
  description: string;
  thumbnail: string;
  onPress: () => void;
}

export const MusicCard: React.FC<MusicCardProps> = ({
  title,
  description,
  thumbnail,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-32 mr-4 bg-gray-800 rounded-xl overflow-hidden"
    >
      <Image
        source={{ uri: thumbnail }}
        className="w-full h-32"
        resizeMode="cover"
      />
      
      <View className="p-3">
        <Text className="text-white text-base font-semibold mb-1" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-gray-400 text-xs" numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};