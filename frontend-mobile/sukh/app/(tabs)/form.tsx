import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import styles from "./formStyles";
import { Ionicons } from "@expo/vector-icons";

export default function FormScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>How are you feeling?</Text>
      <Text style={styles.subheading}>
        We care and want you to be honest about yourself
      </Text>

      {/* Component Section */}
      <Text style={styles.sectionTitle}>💠 Component</Text>
      <View style={styles.sliderRow}>
        <Ionicons name="sad-outline" size={24} color="white" />
        <View style={styles.sliderBar} />
        <Ionicons name="happy-outline" size={24} color="white" />
      </View>

      {/* Contact Us Section */}
      <Text style={styles.sectionTitle}>💠 Contact Us</Text>
      <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" />
      <TextInput
        style={[styles.input, styles.memo]}
        placeholder="Memo"
        placeholderTextColor="#aaa"
        multiline
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
