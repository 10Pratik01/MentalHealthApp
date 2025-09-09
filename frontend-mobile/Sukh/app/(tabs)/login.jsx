import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-[#0B0C1E] justify-center items-center px-6">
      {/* Logo */}
      <Image
        source={require("../../assets/logo.png")} 
        className="w-16 h-16 mb-6"
        resizeMode="contain"
      />

      {/* Title */}
      <Text className="text-white text-2xl font-bold text-center mb-2">
        Sign in to your{"\n"}Account
      </Text>

      {/* Sign Up link */}
      <View className="flex-row mb-6">
        <Text className="text-gray-400">Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-teal-400 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Email Input */}
      <View className="w-full bg-white flex-row items-center rounded-xl px-3 py-2 mb-3">
        <Text className="text-gray-500 mr-2">📧</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="flex-1 text-black"
        />
      </View>

      {/* Password Input */}
      <View className="w-full bg-white flex-row items-center rounded-xl px-3 py-2 mb-4">
        <Text className="text-gray-500 mr-2">🔒</Text>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="flex-1 text-black"
        />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity
        onPress={() => router.push("/forgot-password")}
        className="mb-6"
      >
        <Text className="text-gray-300 underline">Forgot Your Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        onPress={() => router.push("/home")}
        className="w-full bg-teal-400 py-3 rounded-xl shadow-lg"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Log In
        </Text>
      </TouchableOpacity>
    </View>
  );
}
