import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";

export default function BottomNavBar() {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.replace("/home")} style={styles.iconWrap}>
        <Image source={icons.home} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/session")} style={styles.iconWrap}>
        <Image source={icons.search} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconWrap}>
        <Image source={icons.play} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/account")} style={styles.iconWrap}>
        <Image source={icons.person} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 60,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  iconWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#059669",
  },
});
