import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface FeedbackData {
  name: string;
  email: string;
  feedback: string;
}

const FeedbackFormPage: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackData>({
    name: '',
    email: '',
    feedback: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FeedbackData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return false;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!formData.feedback.trim()) {
      Alert.alert('Validation Error', 'Please provide your feedback');
      return false;
    }
    
    if (formData.feedback.trim().length < 10) {
      Alert.alert('Validation Error', 'Please provide more detailed feedback (at least 10 characters)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Feedback submitted:', formData);
      
      Alert.alert(
        'Success!',
        'Thank you for your feedback. Your counsellor will review it and use it to improve future sessions.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                name: '',
                email: '',
                feedback: '',
              });
              // Navigate back or to another screen
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to submit feedback. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 py-8">
            <Text className="text-white text-3xl font-bold text-center mb-2">
              After Session Feedback Form
            </Text>
            <Text className="text-gray-400 text-lg text-center">
              (For Counsellor only)
            </Text>
          </View>

          {/* Form Section */}
          <View className="px-6 pb-8">
            {/* Name Input */}
            <View className="mb-6">
              <Text className="text-white text-lg font-semibold mb-3">
                Your Name
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                className="bg-black border border-gray-600 rounded-lg px-4 py-4 text-white text-base"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-white text-lg font-semibold mb-3">
                Email Address
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email address"
                placeholderTextColor="#9CA3AF"
                className="bg-black border border-gray-600 rounded-lg px-4 py-4 text-white text-base"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Feedback Input */}
            <View className="mb-8">
              <Text className="text-white text-lg font-semibold mb-3">
                Session Feedback
              </Text>
              <TextInput
                value={formData.feedback}
                onChangeText={(value) => handleInputChange('feedback', value)}
                placeholder="Please share your thoughts about the counselling session. How did you feel during the session? What was helpful? What could be improved?"
                placeholderTextColor="#9CA3AF"
                className="bg-black border border-gray-600 rounded-lg px-4 py-4 text-white text-base"
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                style={{ minHeight: 120 }}
              />
              <Text className="text-gray-400 text-sm mt-2">
                {formData.feedback.length}/500 characters
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`py-4 rounded-lg ${
                isSubmitting 
                  ? 'bg-gray-600' 
                  : 'bg-teal-500'
              }`}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Text>
            </TouchableOpacity>

            {/* Additional Info */}
            <View className="mt-6 p-4 bg-gray-800 rounded-lg">
              <Text className="text-gray-300 text-sm text-center leading-5">
                Your feedback is valuable and will help your counsellor provide better support. 
                All feedback is confidential and will only be shared with your counsellor.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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

export default FeedbackFormPage;