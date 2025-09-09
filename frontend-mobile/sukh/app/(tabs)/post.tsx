import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for bell + bottom icons
import styles from "./postStyles";

export default function PostScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handlePost = () => {
    console.log("Posted:", { title, description });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
        <Text style={styles.headerText}>Community 2</Text>
        <View style={styles.notificationWrapper}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Share your experience</Text>

        <Text style={styles.inputLabel}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Type here"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Type here"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Ionicons name="home-outline" size={28} color="#999" />
        <Ionicons name="videocam-outline" size={28} color="#999" />
        <Ionicons name="chatbubble-outline" size={28} color="#999" />
        <Ionicons name="people" size={28} color="#10B981" /> {/* active */}
      </View>
    </View>
  );
}
