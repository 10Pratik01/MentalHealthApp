
import React, { useState } from "react";
import BottomNavBar from '../../components/BottomNavBar';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";

// Adjust this base URL depending on emulator/device
const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5432/api/auth" // Android Emulator
    : "http://localhost:5432/api/auth"; // iOS Simulator

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Store token locally (AsyncStorage or SecureStore)
      // import AsyncStorage from "@react-native-async-storage/async-storage";
      // await AsyncStorage.setItem("token", data.token);

      Alert.alert("Success", "Logged in successfully!");

      // Navigate to Dashboard or Home screen
      // navigation.navigate("Home");

      console.log("User data:", data);
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Welcome to Sukh</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#34d399"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#34d399"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupText}>Create an account</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6fff5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 32,
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#34d399",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20, 
    backgroundColor: "#fff",
    color: "#059669",
    fontSize: 16,
  },
  button: {
    width: "90%",
    height: 50,
    backgroundColor: "#059669",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    color: "#059669",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.title}>Welcome to Sukh</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#34d399"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#34d399"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../signup")}> 
            <Text style={styles.signupText}>Create an account</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
      <BottomNavBar />
    </View>
  );
}
