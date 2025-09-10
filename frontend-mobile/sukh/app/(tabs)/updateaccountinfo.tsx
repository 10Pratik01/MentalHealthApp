import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await api.get("/auth/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.user;
        if (user.name) {
          const nameParts = user.name.split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");
        }
        setPhoneNumber(user.mobileNumber || "");
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await api.put(
        "/auth/updateprofile",
        {
          name: `${firstName.trim()} ${lastName.trim()}`,
          mobileNumber: phoneNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", res.data.message);
      router.back(); // Navigate back after update
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", err.response?.data?.message || "Update failed");
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#00C897" />
      </View>
    );
  }

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
        {/* Profile Picture */}
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center mb-3">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800">{`${firstName} ${lastName}`}</Text>
        </View>

        {/* Form Fields */}
        <View className="px-4 space-y-4">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <TextInput
              className="text-base text-gray-800"
              placeholder="What's your first name?"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <TextInput
              className="text-base text-gray-800"
              placeholder="And your last name?"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm flex-row items-center">
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder="Phone number"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Update Button */}
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
