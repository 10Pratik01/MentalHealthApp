import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SliderComp from "@react-native-community/slider";
import { useRouter } from "expo-router";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RoutineScreen() {
  const [mood, setMood] = useState(5);
  const [feeling, setFeeling] = useState("");
  const router = useRouter();

  const handleCheckIn = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await api.post(
        "/daily-reports",
        {
          type: "start",
          name: "Morning Report",
          mood,
          notes: feeling,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Morning report saved!");
      router.push("../endday");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Day Routine</Text>
      <Text style={styles.greeting}>Good morning USER</Text>
      <Text style={styles.subtext}>How are you feeling today?</Text>

      <View style={styles.sliderRow}>
        <Ionicons name="sad-outline" size={28} color="#fff" />
        <SliderComp
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={mood}
          onValueChange={(val: number) => setMood(val)}
          minimumTrackTintColor="#00C897"
          maximumTrackTintColor="#444"
          thumbTintColor="#00C897"
        />
        <Ionicons name="happy-outline" size={28} color="#fff" />
      </View>
      <Text style={styles.moodValue}>Mood: {mood}/10</Text>

      <TextInput
        style={styles.input}
        placeholder="I am feeling..."
        placeholderTextColor="#aaa"
        value={feeling}
        onChangeText={setFeeling}
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await handleCheckIn(); // call the existing API submission
          // Navigate to endday.tsx
          router.push("/endday");
        }}
      >
        <Text style={styles.buttonText}>Check in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1B13", // dark green background
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 12,
  },
  moodValue: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1E1E2D",
    borderWidth: 1,
    borderColor: "#00C897",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#fff",
    height: 100,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#00C897",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
