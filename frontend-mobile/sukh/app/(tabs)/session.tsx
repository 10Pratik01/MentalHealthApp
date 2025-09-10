import React, { useState, useEffect } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "./sessionStyles";
import SessionCard from "../../components/SessionCard";

interface SessionType {
  _id: string;
  name: string;
  title: string;
  date: string;
  time: string;
  status: "upcoming" | "completed";
}

export default function Session() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");
  const [sessions, setSessions] = useState<any[]>([]); // default empty array

  // Fetch sessions from backend
  const fetchSessions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await axios.get("http://localhost:8081/api/v1/schedule/", {
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

  return (
    <View style={{ flex: 1 }}>
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
            <Text
              style={[
                styles.tabText,
                tab === "upcoming" && styles.activeTabText,
              ]}
            >
              Upcoming Sessions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === "completed" && styles.activeTab]}
            onPress={() => setTab("completed")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "completed" && styles.activeTabText,
              ]}
            >
              Completed Sessions
            </Text>
          </TouchableOpacity>
        </View>

        {/* All Sessions Header */}
        <View style={styles.allSessionsHeader}>
          <Text style={styles.allSessionsText}>All Sessions</Text>
          <Ionicons name="chevron-down" size={18} color="#fff" />
        </View>

        {/* Session Cards */}
        <ScrollView contentContainerStyle={styles.cardsWrapper}>
          {filteredSessions.length === 0 ? (
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
              No sessions found.
            </Text>
          ) : (
            filteredSessions.map((session) => (
              <SessionCard
                key={session._id}
                name={session.name}
                title={session.title}
                date={session.date}
                time={session.time}
                primaryAction={tab === "upcoming" ? "Reschedule" : "Re-book"}
                secondaryAction={
                  tab === "upcoming" ? "Join Now" : "View Profile"
                }
                highlighted={tab === "completed"}
              />
            ))
          )}
        </ScrollView>
      </View>
      <BottomNavBar />
    </View>
  );
}
