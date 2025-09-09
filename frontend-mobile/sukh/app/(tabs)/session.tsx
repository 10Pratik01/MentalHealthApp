import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./sessionStyles";
import SessionCard from "../../components/SessionCard";

export default function Session() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  {/* Removed profile image for now */}
        <Text style={styles.headerTitle}>My Sessions</Text>
        <View style={styles.notificationWrapper}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
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

      {/* All Sessions */}
      <View style={styles.allSessionsHeader}>
        <Text style={styles.allSessionsText}>All Sessions</Text>
        <Ionicons name="chevron-down" size={18} color="#fff" />
      </View>

      {/* Cards */}
      <ScrollView contentContainerStyle={styles.cardsWrapper}>
        <SessionCard
          name="Neekunj"
          title="Msc in Clinical Psychology"
          date="31st March '22"
          time="7:30 PM - 8:30 PM"
          primaryAction="Reschedule"
          secondaryAction="Join Now"
        />
        <SessionCard
          name="Vishesh"
          title="Msc in Clinical Psychology"
          date="31st March '22"
          time="7:30 PM - 8:30 PM"
          primaryAction="Re-book"
          secondaryAction="View Profile"
          highlighted
        />
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home-outline" size={26} color="#A5B4FC" />
        <Ionicons name="videocam-outline" size={26} color="#10B981" />
        <Ionicons name="chatbubble-outline" size={26} color="#9CA3AF" />
        <Ionicons name="people-outline" size={26} color="#9CA3AF" />
      </View>
    </View>
  );
}
