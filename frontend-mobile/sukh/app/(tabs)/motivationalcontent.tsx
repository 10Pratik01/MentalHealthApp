import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { VideoCard } from '../../components/VideoCard';
import { MusicCard } from '../../components/MusicCard';

interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: 'all' | 'hope' | 'strength';
  link: string;
}

interface MusicData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  link: string;
}

const MotivationalContentPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hope' | 'strength'>('all');

  // Sample data - replace with your backend data
  const videoData: VideoData[] = [
    {
      id: '1',
      title: 'Find Your Inner Peace',
      description: 'A guided meditation to help you relax.',
      thumbnail: 'https://example.com/meditation.jpg',
      duration: '10:32',
      category: 'all',
      link: 'https://example.com/video1',
    },
    {
      id: '2',
      title: 'Embrace the Challenge',
      description: 'A motivational speech about overcoming challenges.',
      thumbnail: 'https://example.com/challenge.jpg',
      duration: '8:45',
      category: 'strength',
      link: 'https://example.com/video2',
    },
    // Add more video data
  ];

  const musicData: MusicData[] = [
    {
      id: '1',
      title: 'Calm',
      description: 'Soothing melodies',
      thumbnail: 'https://example.com/calm.jpg',
      link: 'https://example.com/playlist1',
    },
    {
      id: '2',
      title: 'Sleep',
      description: 'Gentle sounds',
      thumbnail: 'https://example.com/sleep.jpg',
      link: 'https://example.com/playlist2',
    },
    {
      id: '3',
      title: 'Focus',
      description: 'Ambient music for concentration',
      thumbnail: 'https://example.com/focus.jpg',
      link: 'https://example.com/playlist3',
    },
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videoData 
    : videoData.filter(video => video.category === selectedCategory);

  const categories = [
    { key: 'all' as const, label: 'All' },
    { key: 'hope' as const, label: 'Hope' },
    { key: 'strength' as const, label: 'Strength' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center">
          <Image
            source={{ uri: 'https://example.com/profile.jpg' }}
            className="w-10 h-10 rounded-full"
          />
        </TouchableOpacity>
        
        <TouchableOpacity className="relative">
          <View className="w-6 h-6">
            {/* Bell icon - you can replace with your icon component */}
            <Text className="text-white text-lg">🔔</Text>
          </View>
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Motivational Videos Section */}
        <View className="px-4 mb-6">
          <Text className="text-white text-2xl font-bold mb-4 text-center">
            Motivational Videos
          </Text>
          
          {/* Category Buttons */}
          <View className="flex-row justify-center mb-4">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                onPress={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full mx-1 ${
                  selectedCategory === category.key
                    ? 'bg-teal-500'
                    : 'bg-gray-700'
                }`}
              >
                <Text className="text-white font-medium">{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Video Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  description={video.description}
                  thumbnail={video.thumbnail}
                  duration={video.duration}
                  onPress={() => {
                    // Handle video press - navigate to video link
                    console.log('Navigate to:', video.link);
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Music Playlists Section */}
        <View className="px-4 mb-6">
          <Text className="text-white text-2xl font-bold mb-4 text-center">
            Music Playlists
          </Text>
          
          {/* Music Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {musicData.map((music) => (
                <MusicCard
                  key={music.id}
                  title={music.title}
                  description={music.description}
                  thumbnail={music.thumbnail}
                  onPress={() => {
                    // Handle music press - navigate to playlist link
                    console.log('Navigate to:', music.link);
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white rounded-t-3xl px-6 py-4">
        <View className="flex-row justify-around items-center">
          <TouchableOpacity className="items-center">
            <Text className="text-purple-500 text-xl">🏠</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Text className="text-green-500 text-xl">📹</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Text className="text-gray-400 text-xl">💬</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Text className="text-gray-400 text-xl">👥</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MotivationalContentPage;