import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AdvicePost {
  id: string;
  title: string;
  advice: string;
  timestamp: Date;
}

const ParentsAdvicePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [advice, setAdvice] = useState('');
  const [advicePosts, setAdvicePosts] = useState<AdvicePost[]>([]);

  const handlePostAdvice = () => {
    if (!title.trim() || !advice.trim()) {
      Alert.alert('Error', 'Please fill in both title and advice');
      return;
    }

    const newPost: AdvicePost = {
      id: Date.now().toString(),
      title: title.trim(),
      advice: advice.trim(),
      timestamp: new Date(),
    };

    setAdvicePosts([newPost, ...advicePosts]);
    setTitle('');
    setAdvice('');
    Alert.alert('Success', 'Your advice has been posted!');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="py-6 items-center">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Parents Advice
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6">
              Share your wisdom and help children navigate through life's challenges
            </Text>
          </View>

          {/* Post Advice Form */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <Text className="text-xl font-semibold text-gray-800 mb-5">
              Share Your Advice
            </Text>
            
            {/* Title Input */}
            <View className="mb-5">
              <Text className="text-base font-medium text-gray-700 mb-2">
                Title
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 bg-gray-50"
                placeholder="Enter a brief title for your advice..."
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            {/* Advice Input */}
            <View className="mb-5">
              <Text className="text-base font-medium text-gray-700 mb-2">
                Mummy Ki Suno
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 bg-gray-50 min-h-[120px]"
                placeholder="Write your advice here... Share your wisdom and experience to help children..."
                placeholderTextColor="#9CA3AF"
                value={advice}
                onChangeText={setAdvice}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={1000}
              />
              <Text className="text-xs text-gray-400 text-right mt-1">
                {advice.length}/1000
              </Text>
            </View>

            {/* Post Button */}
            <TouchableOpacity 
              className="bg-blue-500 rounded-xl py-4 items-center shadow-lg"
              onPress={handlePostAdvice}
            >
              <Text className="text-white text-base font-semibold">
                Post Advice
              </Text>
            </TouchableOpacity>
          </View>

          {/* Advice Posts */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Recent Advice
            </Text>
            
            {advicePosts.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center shadow-lg">
                <Text className="text-base text-gray-600 text-center leading-6">
                  No advice posted yet. Be the first to share your wisdom!
                </Text>
              </View>
            ) : (
              advicePosts.map((post) => (
                <View key={post.id} className="bg-white rounded-2xl p-5 mb-4 shadow-lg">
                  <View className="flex-row justify-between items-start mb-3">
                    <Text className="text-lg font-semibold text-gray-800 flex-1 mr-3">
                      {post.title}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {formatDate(post.timestamp)}
                    </Text>
                  </View>
                  <View className="bg-gray-100 rounded-xl p-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Mummy Ki Suno:
                    </Text>
                    <Text className="text-base text-gray-800 leading-6">
                      {post.advice}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ParentsAdvicePage;