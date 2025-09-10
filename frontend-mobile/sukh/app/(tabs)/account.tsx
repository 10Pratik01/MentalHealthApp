import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import BottomNavBar from "../../components/BottomNavBar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [weeklyAverage, setWeeklyAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info and weekly average from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        // Get user info
        const userRes = await api.get(
          "/auth/getUser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserName(userRes.data.name);

        // Get weekly average
        const avgRes = await api.get("/community/analytics/weekly", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWeeklyAverage(avgRes.data.weeklyAverage); // assuming backend returns { weeklyAverage: number }
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    router.push("/updateaccountinfo");
  };

  const handleProgressReport = () => {
    router.push("/previos");
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/login");
        },
      },
    ]);
  };

  const renderMenuItem = (
    icon: string,
    title: string,
    description: string,
    onPress: () => void,
    isDestructive: boolean = false
  ) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-md"
    >
      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4">
        <Text className="text-gray-600 text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text
          className={`text-lg font-semibold ${
            isDestructive ? "text-red-500" : "text-gray-800"
          }`}
        >
          {title}
        </Text>
        <Text className="text-gray-500 text-sm mt-1">{description}</Text>
      </View>
      <Text className="text-gray-400 text-lg">›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#00C897" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f4f8" }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: "#1e293b",
            paddingVertical: 16,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
            Profile
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* User Profile Card */}
          <View className="bg-teal-500 mx-4 mt-4 rounded-xl p-6 flex-row items-center">
            <Image
              source={{ uri: "https://example.com/user-avatar.jpg" }}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">
                {userName || "User"}
              </Text>
              {weeklyAverage !== null && (
                <Text className="text-white text-lg opacity-90">
                  Weekly Mood Average: {weeklyAverage.toFixed(1)}/10
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleEditProfile}
              className="w-8 h-8 items-center justify-center"
            >
              <Text className="text-white text-xl">✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Menu */}
          <View className="mx-4 mt-6 mb-6">
            {renderMenuItem(
              "📈",
              "Progress Tracker",
              "Check your progress and improve",
              handleProgressReport
            )}

            {renderMenuItem(
              "🔔",
              "Help & Support",
              "Get help and contact support",
              () => {}
            )}

            {renderMenuItem(
              "🚪",
              "Log out",
              "Sign out of your account",
              handleLogout,
              true
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNavBar />
    </View>
  );
};

export default ProfilePage;
