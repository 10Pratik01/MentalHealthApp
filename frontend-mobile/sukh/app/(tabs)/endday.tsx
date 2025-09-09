import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "react-native";

export default function EndDayScreen() {
  const [selectedMood, setSelectedMood] = useState("");
  const [reflection, setReflection] = useState("");
  const moodOptions = ["Bad", "Not Great", "Okay", "Good", "Great"];

  const { push } = require("expo-router").useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>End Day Routine</Text>

      {/* Day Review */}
      <View style={styles.section}>
        <Text style={styles.heading}>How was your day?</Text>
        <View style={styles.moodOptionsRow}> 
          {moodOptions.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[styles.moodButton, selectedMood === mood && styles.moodButtonSelected]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text style={[styles.moodButtonText, selectedMood === mood && styles.moodButtonTextSelected]}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Mood Comparison */}
      <View style={styles.section}>
        <Text style={styles.heading}>Mood Comparison</Text>
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonLabel}>Morning Mood</Text>
            <Text style={styles.comparisonValue}>Good</Text>
          </View>
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonLabel}>Current Mood</Text>
            <Text style={styles.comparisonValue}>{selectedMood || "-"}</Text>
          </View>
        </View>
      </View>

      {/* Reflection */}
      <View style={styles.section}>
        <Text style={styles.heading}>Reflection</Text>
        <TextInput
          style={styles.textarea}
          placeholder="What went right today?"
          placeholderTextColor="#aaa"
          value={reflection}
          onChangeText={setReflection}
          multiline
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={() => push("../home")}> 
        <Text style={styles.submitButtonText}>Submit Evening Check-In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  moodOptionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
    justifyContent: "center",
  },
  moodButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    margin: 4,
    backgroundColor: "#222",
  },
  moodButtonSelected: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  moodButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  moodButtonTextSelected: {
    color: "#000",
    fontWeight: "bold",
  },
  comparisonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  comparisonCard: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  comparisonLabel: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 6,
  },
  comparisonValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  textarea: {
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#22c55e",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#22c55e",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    marginBottom: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
