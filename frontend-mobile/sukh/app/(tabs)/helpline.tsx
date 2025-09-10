import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

export default function HelplineScreen() {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Ionicons name="call" size={96} color="#ffffffff" />
      </View>
      <Text style={styles.title}>Tele MANAS</Text>
      <Text style={styles.number}>14416</Text>
      <Text style={styles.subtitle}>Available 24/7 - Mental Health Support</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B00020", 
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  number: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});
