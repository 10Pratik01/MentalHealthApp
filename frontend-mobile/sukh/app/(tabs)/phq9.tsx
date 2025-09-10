import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FLASK_API_URL = "http://10.0.54.238:8000/api/predict"; // Flask API endpoint
const EXPRESS_API_URL = "http://10.0.13.68:5432/api/auth"; // Express backend (adjust port)

const PHQ9_QUESTIONS = [ "Little interest or pleasure in doing things? Please answer roughly: rare / a few days / most days / nearly every day (or reply in your own words).",

  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
  "Trouble concentrating on things, such as reading the newspaper or watching television?",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless?",
  "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way?",

];

const App = () => {
  const [answers, setAnswers] = useState<string[]>(Array(PHQ9_QUESTIONS.length).fill(""));
  const [loading, setLoading] = useState(false);
  const [resultLabel, setResultLabel] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch userId & token from AsyncStorage on mount
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedToken = await AsyncStorage.getItem("token");

        console.log("📦 Loaded from AsyncStorage → userId:", storedUserId, " token:", storedToken);

        if (storedUserId) setUserId(storedUserId);
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.error("❌ Error loading auth data:", error);
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    const checkStorage = async () => {
      const t = await AsyncStorage.getItem("token");
      const u = await AsyncStorage.getItem("userId");
      console.log("🔍 Storage check → token:", t);
      console.log("🔍 Storage check → userId:", u);
    };
    checkStorage();
  }, []);

  const handleAnswerChange = (text: string, index: number) => {
    const updated = [...answers];
    updated[index] = text;
    console.log(`✏️ Answer updated Q${index + 1}:`, text);
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    console.log("🚀 Submitting PHQ-9 answers...");
    console.log("📝 Current answers:", answers);
    console.log("👤 User ID:", userId);
    console.log("🔑 Token:", token);

    if (!userId || !token) {
      Alert.alert("Error", "User not authenticated. Please log in again.");
      return;
    }

    setLoading(true);
    setResultLabel(null);

    try {
      // Step 1: Send answers to Flask ML API
      console.log("📡 Sending request to Flask:", FLASK_API_URL);
      const response = await axios.post(FLASK_API_URL, { answers });

      console.log("✅ Flask API response:", response.data);

      if (response.data.success) {
        const label = response.data.result.label;
        console.log("🏷️ Predicted label from Flask:", label);
        setResultLabel(label);

        // Step 2: Send predicted label to Express backend
        console.log("📡 Sending request to Express:", `${EXPRESS_API_URL}/user/${userId}/risk-level`);
        console.log("📦 Body:", { label });

        const expressResponse = await axios.put(
          `${EXPRESS_API_URL}/user/${userId}/risk-level`,
          { label },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ Express API response:", expressResponse.data);

        Alert.alert("Success", "Risk level updated in your profile.");
      } else {
        console.warn("⚠️ Flask returned error:", response.data.error);
        Alert.alert("Error", response.data.error || "Unknown error occurred.");
      }
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message || error);
      Alert.alert("Error", error.message || "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      <View className="px-4 py-3 border-b border-gray-800 bg-gray-900">
        <Text className="text-2xl text-green-500 font-bold">PHQ-9 Assessment</Text>
        <Text className="text-gray-400">Answer the questions below</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {PHQ9_QUESTIONS.map((question, index) => (
          <View key={index} className="mb-6">
            <Text className="text-white text-lg mb-2">{question}</Text>
            <TextInput
              value={answers[index]}
              onChangeText={(text) => handleAnswerChange(text, index)}
              placeholder="Type your answer..."
              placeholderTextColor="#9CA3AF"
              className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-green-500"
            />
          </View>
        ))}

        {resultLabel && (
          <View className="bg-gray-800 p-4 rounded-xl border border-green-500 mt-4">
            <Text className="text-white text-lg font-semibold mb-2">
              Predicted Depression Level:
            </Text>
            <Text className="text-green-400 text-xl">{resultLabel}</Text>
          </View>
        )}
      </ScrollView>

      <View className="px-4 py-3 border-t border-gray-800 bg-gray-900">
        <TouchableOpacity
          onPress={handleSubmit}
          className={`py-3 rounded-xl items-center ${loading ? "bg-gray-600" : "bg-green-500"}`}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white font-semibold text-lg">Submit Answers</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;
