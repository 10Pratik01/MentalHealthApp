import React, { useMemo, useState } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import { SafeAreaView, View, Text, ScrollView, Pressable, Image, StatusBar } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// NOTE: This screen uses NativeWind (Tailwind for RN). Ensure you've set up nativewind and the tailwind preset.
// 1) npm i nativewind tailwindcss
// 2) npx tailwindcss init -p
// 3) Add the NativeWind preset in tailwind.config.js and include the RN paths.

// Types
export type MoodKey = "happy" | "calm" | "manic" | "angry";

interface Mood {
  key: MoodKey;
  label: string;
  icon: React.ReactNode; // ReactNode avoids the JSX.Element typing issue
}

const MOODS: Mood[] = [
  { key: "happy", label: "Happy", icon: <Ionicons name="happy" size={22} color="#fff" /> },
  { key: "calm", label: "Calm", icon: <MaterialCommunityIcons name="yin-yang" size={22} color="#fff" /> },
  {
    key: "manic",
    label: "Manic",
    icon: (
      <Image
        source={{ uri: "https://img.icons8.com/ios-filled/50/spiral.png" }}
        className="w-5 h-5"
      />
    ),
  },
  { key: "angry", label: "Angry", icon: <Ionicons name="sad" size={22} color="#fff" /> },
];

const Badge: React.FC<{ count?: number }> = ({ count = 0 }) => {
  if (!count) return null;
  return (
    <View className="absolute -top-1 -right-1 bg-emerald-400 w-5 h-5 rounded-full items-center justify-center">
      <Text className="text-[10px] font-semibold text-black">{count}</Text>
    </View>
  );
};

const Chip: React.FC<{
  active?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}> = ({ active, onPress, children }) => (
  <Pressable
    onPress={onPress}
    className={[
      "px-3 py-2 rounded-xl mr-3 mb-2 flex-row items-center gap-2",
      active ? "bg-emerald-500" : "bg-[#263038]",
    ].join(" ")}
  >
    <Text className={["text-sm", active ? "text-black" : "text-slate-200"].join(" ")}>{children}</Text>
  </Pressable>
);

const FeatureCard: React.FC<{
  title: string;
  subtitle?: string;
  cta?: string;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  bg?: string; // solid background color fallback (no gradient dependency)
}> = ({ title, subtitle, cta, onPress, leftIcon, bg = "#1f2937" }) => (
  <Pressable onPress={onPress} className="rounded-2xl overflow-hidden">
    <View className="p-4" style={{ backgroundColor: bg }}>
      <View className="flex-row items-center">
        <View className="mr-3">{leftIcon}</View>
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold">{title}</Text>
          {subtitle ? <Text className="text-slate-100/80 text-xs mt-1">{subtitle}</Text> : null}
          {cta ? (
            <View className="mt-3 self-start bg-white/10 px-3 py-1 rounded-lg">
              <Text className="text-slate-100 text-xs">{cta}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  </Pressable>
);

const QuickAction: React.FC<{
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
}> = ({ label, icon, onPress }) => (
  <Pressable
    onPress={onPress}
    className="bg-[#263038] rounded-2xl px-4 py-3 items-center justify-center flex-row gap-2"
  >
    {icon}
    <Text className="text-white font-medium">{label}</Text>
  </Pressable>
);

const QuoteCard = () => (
  <View className="bg-[#263038] rounded-2xl p-4">
    <Text className="text-slate-200">“Sukh believes that your mind deserves the space it wants”</Text>
  </View>
);


const HomeScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);

  const moodChips = useMemo(
    () =>
      MOODS.map((m) => (
        <Pressable key={m.key} onPress={() => setSelectedMood(m.key)}>
          <View
            className={[
              "items-center justify-center w-16 h-16 rounded-2xl mr-3",
              selectedMood === m.key ? "bg-emerald-400" : "bg-[#263038]",
            ].join(" ")}
          >
            <View className="mb-1">{m.icon}</View>
            <Text className={selectedMood === m.key ? "text-black text-xs" : "text-slate-200 text-xs"}>
              {m.label}
            </Text>
          </View>
        </Pressable>
      )),
    [selectedMood]
  );

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#0b1116]">
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View className="px-5 pt-2 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-9 h-9 rounded-full overflow-hidden">
            {/* Replace with user's avatar */}
            <Image source={{ uri: "https://i.pravatar.cc/72?img=5" }} className="w-full h-full" />
          </View>
          <View>
            <Text className="text-slate-300 text-xs">Good Afternoon,</Text>
            <Text className="text-white text-xl font-semibold">Vibha</Text>
          </View>
        </View>
        <View className="relative">
          <Pressable className="w-10 h-10 rounded-full bg-[#263038] items-center justify-center">
            <Ionicons name="notifications-outline" size={18} color="#fff" />
          </Pressable>
          <Badge count={3} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }} className="px-5">
        {/* Prompt */}
        <Text className="text-slate-300 mb-3">How are you feeling today ?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row">{moodChips}</View>
        </ScrollView>

        {/* Chatbot */}
        <FeatureCard
          title="Chatbot"
          subtitle="Talk to Sukh for quick, stigma-free support"
          cta="Open Chat"
          leftIcon={<Feather name="message-circle" size={28} color="#fff" />}
          bg="#1f2937"
          onPress={() => router.push("/chat")} 
        />

        {/* 1 on 1 Sessions */}
        <View className="mt-4">
          <FeatureCard
            title="1 on 1 Sessions"
            subtitle="Let’s open up to the things that matter the most"
            cta="Book Now"
            leftIcon={<MaterialCommunityIcons name="account-heart" size={28} color="#fff" />}
            bg="#10b981"
            onPress={() => router.push("/session")} 
          />
        </View>

        {/* Quick actions */}
        <View className="mt-4 flex-row gap-3">
          <View className="flex-1">
            <QuickAction label="Diary" icon={<Ionicons name="book" size={18} color="#fff" />}  onPress={() => router.push("/")} />
          </View>
          <View className="flex-1">
            <QuickAction label="Stories" icon={<Ionicons name="newspaper" size={18} color="#fff" onPress={() => router.push("/motivationalcontent")}  />} />
          </View>
        </View>

        <View className="mt-4">
          <QuoteCard />
        </View>

        {/* Daily Plan section */}
        <View className="mt-4">
          <FeatureCard
            title="Daily Plan"
            subtitle="Start Day Report → Personalized Activities → End Day Report"
            cta="Start Now"
            leftIcon={<MaterialCommunityIcons name="chart-timeline-variant" size={28} color="#fff" />}
            bg="#10b981"
          />
        </View>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
};

export default HomeScreen;