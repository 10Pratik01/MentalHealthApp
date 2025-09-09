
import React from "react";
import { Tabs } from "expo-router";
import { ImageBackground, Image, Text, View, StyleSheet } from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

function TabIcon({ focused, icon, title }: any) {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        style={styles.focusedTab}
      >
        <Image source={icon} tintColor="#151312" style={styles.icon} />
        <Text style={styles.focusedText}>{title}</Text>
      </ImageBackground>
    );
  }

  return (
    <View style={styles.unfocusedTab}>
      <Image source={icon} tintColor="#A8B5DB" style={styles.icon} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#1e1e1e",
          borderRadius: 10,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 55,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "index",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="session"
        options={{
          title: "Sessions",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Sessions" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  focusedTab: {
    flexDirection: "row",
    minWidth: 76,
    minHeight: 40,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  focusedText: {
    color: "#A8B5DB",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  unfocusedTab: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    borderRadius: 999,
  },
});
