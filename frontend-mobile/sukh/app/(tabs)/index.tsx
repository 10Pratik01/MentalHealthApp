
import React, { useState } from "react";
import BottomNavBar from '../../components/BottomNavBar';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";




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