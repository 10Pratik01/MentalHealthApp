import React, { useState, useEffect } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "./sessionStyles";

interface SessionType {
  _id: string;
  time: string;
  status: "upcoming" | "completed";
}

export default function Session() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");
  const [sessions, setSessions] = useState<SessionType[]>([]);

  // Fetch sessions from backend
  const fetchSessions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await axios.get("http://localhost:5432/api/v1/schedule/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSessions(res.data);
    } catch (err: any) {
      console.log("Error fetching sessions:", err.message);
      Alert.alert("Error", "Could not fetch sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Filter sessions based on tab
  const filteredSessions = sessions.filter((session) => session.status === tab);

  // Single session card component (inline)
  const SessionCard = ({ time }: { time: string }) => (
    <View style={cardStyles.card}>
      <Text style={cardStyles.time}>{time}</Text>
      <TouchableOpacity style={cardStyles.button}>
        <Text style={cardStyles.buttonText}>
          {tab === "upcoming" ? "Details" : "View Details"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1B13" }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Sessions</Text>
          <View style={styles.notificationWrapper}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {sessions.filter((s) => s.status === "upcoming").length}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            style={[styles.tab, tab === "upcoming" && styles.activeTab]}
            onPress={() => setTab("upcoming")}
          >
            <Text style={[styles.tabText, tab === "upcoming" && styles.activeTabText]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === "completed" && styles.activeTab]}
            onPress={() => setTab("completed")}
          >
            <Text style={[styles.tabText, tab === "completed" && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sessions List */}
        <ScrollView contentContainerStyle={styles.cardsWrapper}>
          {filteredSessions.length === 0 ? (
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
              No sessions found.
            </Text>
          ) : (
            filteredSessions.map((session) => (
              <SessionCard key={session._id} time={session.time} />
            ))
          )}
        </ScrollView>
      </View>
      <BottomNavBar />
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E2D",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  time: {
    color: "#00C897",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#00C897",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
