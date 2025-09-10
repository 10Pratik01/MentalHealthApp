import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const router = useRouter();

  const timeslots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "3:00 PM", "4:00 PM"];

  const api = axios.create({
    baseURL: "http://localhost:5432/api/v1", // <-- set your backend base URL here
  });

  // Fetch booked appointments for the selected date
  const fetchBookedTimes = async (date: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/schedule/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const booked = res.data
        .filter((appt: any) => appt.date === date)
        .map((appt: any) => appt.time);

      setBookedTimes(booked);
      setSelectedTime(""); // Reset selected time when changing date
    } catch (err: any) {
      console.log("Error fetching appointments:", err.message);
    }
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    fetchBookedTimes(day.dateString);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select a date and time");
      return;
    }

    if (bookedTimes.includes(selectedTime)) {
      Alert.alert("Error", "This time slot is already booked");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      await api.post(
        "/schedule/create",
        { date: selectedDate, time: selectedTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Appointment booked successfully!");
      router.push("../session");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Book Session</Text>

      {/* Calendar */}
      <Calendar
        onDayPress={handleDayPress}
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

      <Text style={styles.subheading}>Available Times</Text>
      <View style={styles.timeslotContainer}>
        {timeslots.map((time) => {
          const isBooked = bookedTimes.includes(time);
          const isSelected = selectedTime === time;

          return (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeslot,
                isSelected && styles.timeslotSelected,
                isBooked && styles.timeslotBooked,
              ]}
              onPress={() => !isBooked && setSelectedTime(time)}
              disabled={isBooked}
            >
              <Text
                style={[
                  styles.timeslotText,
                  isSelected && styles.timeslotTextSelected,
                  isBooked && styles.timeslotTextBooked,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1B13",
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
  timeslotBooked: {
    backgroundColor: "#555",
    borderColor: "#555",
  },
  timeslotText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  timeslotTextSelected: {
    color: "#000000",
    fontWeight: "700",
  },
  timeslotTextBooked: {
    color: "#ccc",
    fontWeight: "600",
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
