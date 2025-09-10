import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const timeslots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "3:00 PM", "4:00 PM"];

  const { push } = require("expo-router").useRouter();
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Book Session</Text>

      {/* Calendar */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#00C897" },
        }}
        theme={{
          calendarBackground: "#0B1B13",
          dayTextColor: "#ffffff",
          monthTextColor: "#ffffff",
          arrowColor: "#00C897",
          todayTextColor: "#00C897",
        }}
        style={styles.calendar}
      />

      {/* Available Times */}
      <Text style={styles.subheading}>Available Times</Text>
      <ScrollView contentContainerStyle={styles.timeslotContainer}>
        {timeslots.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeslot,
              selectedTime === time && styles.timeslotSelected,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.timeslotText,
                selectedTime === time && styles.timeslotTextSelected,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Book Appointment Button */}
      <TouchableOpacity style={styles.bookButton} onPress={() => push("../session")}> 
        <Text style={styles.bookButtonText}>Book Appointment</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 12,
    marginBottom: 25,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  timeslotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeslot: {
    backgroundColor: "#132820",
    borderWidth: 1,
    borderColor: "#00C897",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: "30%",
    alignItems: "center",
  },
  timeslotSelected: {
    backgroundColor: "#00C897",
  },
  timeslotText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  timeslotTextSelected: {
    color: "#000000",
    fontWeight: "700",
  },
  bookButton: {
    backgroundColor: "#00C897",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  bookButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
