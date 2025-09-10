import BottomNavBar from '../../components/BottomNavBar';

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

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

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        mobileNumber: phone || null,
        dateOfBirth: dob || null, // must be YYYY-MM-DD
      });

      const data = response.data;
      setLoading(false);

      Alert.alert("Success", "Account created successfully!");
      router.push("../"); // go to login page
    } catch (error: any) {
      setLoading(false);
      let message = "Something went wrong.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      Alert.alert("Error", message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor="#34d399"
            value={name}
            onChangeText={setName}
          />
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
            placeholder="Phone"
            placeholderTextColor="#34d399"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (YYYY-MM-DD)"
            placeholderTextColor="#34d399"
            value={dob}
            onChangeText={setDob}
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
            onPress={handleSignup} 
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../")}> 
            <Text style={styles.signupText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
      <BottomNavBar />
    </View>
  );
}
