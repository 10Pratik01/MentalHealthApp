import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const ProfilePage: React.FC = () => {
  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleMyAccount = () => {
    console.log('Navigate to My Account');
  };

  const handleTwoFactorAuth = () => {
    console.log('Navigate to Two-Factor Authentication');
  };

  const handleProgressReport = () => {
    console.log('Navigate to Progress Report');
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  const handleHelpSupport = () => {
    console.log('Navigate to Help & Support');
  };

  const handleAboutApp = () => {
    console.log('Navigate to About App');
  };

  // Sample progress data for the week (7 days)
  const progressData = [85, 60, 90, 45, 75, 80, 95]; // percentages for each day
  const maxProgress = Math.max(...progressData);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-slate-800 py-4 px-5">
        <Text className="text-white text-xl font-bold">Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View className="bg-emerald-500 px-5 py-6">
          <View className="flex-row items-center">
            <View className="w-15 h-15 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-white text-2xl font-bold">H</Text>
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-white text-2xl font-bold">Haru</Text>
              <Text className="text-white/80 text-base mt-0.5">@Vibha</Text>
            </View>
            <TouchableOpacity className="p-2" onPress={handleEditProfile}>
              <Text className="text-white text-xl">✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Section */}
        <View className="bg-white mx-4 -mt-2.5 rounded-xl p-5 shadow-lg">
          <View className="flex-row justify-between items-center">
            <Text className="text-slate-500 text-sm">Progress this week</Text>
            <Text className="text-emerald-500 text-sm font-bold">+2.6%</Text>
          </View>
          <Text className="text-slate-800 text-3xl font-bold mt-2">Amazing</Text>
          <View className="flex-row items-center mt-2">
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            <Text className="text-emerald-500 text-sm font-medium">On track</Text>
          </View>
          
          {/* Progress Bar Chart */}
          <View className="flex-row justify-between items-end mt-5 h-20">
            {progressData.map((value, index) => (
              <View key={index} className="items-center flex-1">
                <View 
                  className="w-5 rounded-lg mb-2"
                  style={{ 
                    height: (value / maxProgress) * 60,
                    backgroundColor: value >= 70 ? '#10B981' : '#E5E7EB'
                  }}
                />
                <Text className="text-slate-500 text-xs font-medium">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings List */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-lg">
          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100" onPress={handleMyAccount}>
            <View className="flex-row items-center flex-1">
              <Text className="text-xl mr-4">👤</Text>
              <View className="flex-1">
                <Text className="text-slate-800 text-base font-semibold">My Account</Text>
                <Text className="text-slate-500 text-sm mt-0.5">Make changes to your account</Text>
              </View>
            </View>
            <Text className="text-slate-400 text-xl font-bold">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100" onPress={handleTwoFactorAuth}>
            <View className="flex-row items-center flex-1">
              <Text className="text-xl mr-4">🛡️</Text>
              <View className="flex-1">
                <Text className="text-slate-800 text-base font-semibold">Two-Factor Authentication</Text>
                <Text className="text-slate-500 text-sm mt-0.5">Further secure your account for safety</Text>
              </View>
            </View>
            <Text className="text-slate-400 text-xl font-bold">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100" onPress={handleProgressReport}>
            <View className="flex-row items-center flex-1">
              <Text className="text-xl mr-4">📊</Text>
              <View className="flex-1">
                <Text className="text-slate-800 text-base font-semibold">Progress Report</Text>
                <Text className="text-slate-500 text-sm mt-0.5">Check your progress and improve</Text>
              </View>
            </View>
            <Text className="text-slate-400 text-xl font-bold">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4" onPress={handleLogout}>
            <View className="flex-row items-center flex-1">
              <Text className="text-xl mr-4">🚪</Text>
              <View className="flex-1">
                <Text className="text-slate-800 text-base font-semibold">Log out</Text>
                <Text className="text-slate-500 text-sm mt-0.5">Sign out of your account</Text>
              </View>
            </View>
            <Text className="text-slate-400 text-xl font-bold">›</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Settings */}
        <View className="bg-white mx-4 mt-2 mb-5 rounded-xl shadow-lg">
          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100" onPress={handleHelpSupport}>
            <View className="flex-row items-center flex-1">
              <Text className="text-xl mr-4">🔔</Text>
              <View className="flex-1">
                <Text className="text-slate-800 text-base font-semibold">Help & Support</Text>
              </View>
            </View>
            <Text className="text-slate-400 text-xl font-bold">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4" onPress={handleAboutApp}>
            <View className="flex-row items-center flex-1">
              <Text className="text-xl mr-4">❤️</Text>
              <View className="flex-1">
                <Text className="text-slate-800 text-base font-semibold">About App</Text>
              </View>
            </View>
            <Text className="text-slate-400 text-xl font-bold">›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row bg-white py-3 px-5 border-t border-slate-200">
        <TouchableOpacity className="flex-1 items-center py-2">
          <Text className="text-2xl text-slate-800">🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2">
          <Text className="text-2xl text-slate-400">📹</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2">
          <Text className="text-2xl text-slate-400">💬</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2">
          <Text className="text-2xl text-slate-400">👥</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;