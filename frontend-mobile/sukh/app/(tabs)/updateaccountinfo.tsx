import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';

const EditProfilePage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleUpdateProfile = () => {
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !gender || !dateOfBirth) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Handle profile update logic here
    console.log('Profile updated:', {
      firstName,
      lastName,
      phoneNumber,
      gender,
      dateOfBirth
    });
    
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleBack = () => {
    // Handle back navigation
    console.log('Navigate back');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Text className="text-2xl text-gray-600">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Bio-data</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center mb-3">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800">Haruuchan</Text>
          <Text className="text-sm text-gray-500">haruchan</Text>
        </View>

        {/* Form Fields */}
        <View className="px-4 space-y-4">
          {/* First Name */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <TextInput
              className="text-base text-gray-800"
              placeholder="What's your first name?"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <TextInput
              className="text-base text-gray-800"
              placeholder="And your last name?"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Phone Number */}
          <View className="bg-white rounded-xl p-4 shadow-sm flex-row items-center">
            <View className="w-6 h-4 mr-3 items-center justify-center">
              <Text className="text-sm">🇮��</Text>
            </View>
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder="Phone number"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Gender Dropdown */}
          <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm flex-row items-center justify-between">
            <Text className={`text-base ${gender ? 'text-gray-800' : 'text-gray-400'}`}>
              {gender || 'Select your gender'}
            </Text>
            <Text className="text-gray-400 text-lg">▼</Text>
          </TouchableOpacity>

          {/* Date of Birth */}
          <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm flex-row items-center justify-between">
            <Text className={`text-base ${dateOfBirth ? 'text-gray-800' : 'text-gray-400'}`}>
              {dateOfBirth || 'What is your date of birth?'}
            </Text>
            <Text className="text-gray-400 text-lg">📅</Text>
          </TouchableOpacity>
        </View>

        {/* Update Profile Button */}
        <View className="px-4 py-8">
          <TouchableOpacity
            className="bg-teal-500 rounded-xl py-4 items-center shadow-lg"
            onPress={handleUpdateProfile}
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold">Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfilePage;