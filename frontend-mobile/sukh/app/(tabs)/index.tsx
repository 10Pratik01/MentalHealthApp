import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import BottomNavBar from "../../components/BottomNavBar";

const API_BASE_URL = "http://10.0.13.68:5432/api/auth"; // iOS simulator

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // TODO: Store token securely (AsyncStorage or SecureStore)
      // await AsyncStorage.setItem("token", data.token);

      Alert.alert("Success", "Logged in successfully!");

      // Navigate to dashboard or main app screen
      router.push("/home"); // Adjust path as needed

      console.log("User data:", data);
    } catch (error) {
      const message = error?.message || "An unknown error occurred";
      Alert.alert("Error", message);
      console.error("Login error:", message);
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.6 }]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.signupText}>Create an account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <BottomNavBar />
    </View>
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
