import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType, GestureResponderEvent } from "react-native";

type InfoItem = {
  icon?: React.ReactNode;
  text: string;
};

type SessionCardProps = {
  avatar?: ImageSourcePropType;
  name: string;
  title: string;
  date?: string;
  time?: string;
  primaryAction?: string;
  secondaryAction?: string;
  highlighted?: boolean;
  info?: InfoItem[];
  onPrimaryPress?: (event: GestureResponderEvent) => void;
  onSecondaryPress?: (event: GestureResponderEvent) => void;
  primaryText?: string;
  secondaryText?: string;
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#111827",
  },
  title: {
    fontSize: 14,
    color: "#6B7280",
  },
  infoRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  infoText: {
    marginLeft: 6,
    color: "#6B7280",
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600" as const,
  },
  secondaryText: {
    color: "#10B981",
    fontWeight: "600" as const,
    alignSelf: "center" as const,
  },
});

const SessionCard: React.FC<SessionCardProps> = ({
  avatar,
  name,
  title,
  info = [],
  onPrimaryPress,
  onSecondaryPress,
  primaryText = "Join",
  secondaryText = "Details",
}) => (
  <View style={cardStyles.card}>
    <View style={cardStyles.row}>
      <Image source={avatar} style={cardStyles.avatar} />
      <View>
        <Text style={cardStyles.name}>{name}</Text>
        <Text style={cardStyles.title}>{title}</Text>
      </View>
    </View>
    <View style={cardStyles.infoRow}>
      {info.map((item, idx) => (
        <View key={idx} style={cardStyles.infoItem}>
          {item.icon}
          <Text style={cardStyles.infoText}>{item.text}</Text>
        </View>
      ))}
    </View>
    <View style={cardStyles.actionsRow}>
      <TouchableOpacity style={cardStyles.primaryButton} onPress={onPrimaryPress}>
        <Text style={cardStyles.primaryText}>{primaryText}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSecondaryPress}>
        <Text style={cardStyles.secondaryText}>{secondaryText}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default SessionCard;
