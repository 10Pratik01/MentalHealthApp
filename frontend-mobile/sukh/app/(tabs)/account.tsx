import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import WeeklyProgress from '../../components/WeeklyProgress';

const ProfilePage: React.FC = () => {
	const progressData = [85, 60, 90, 45, 75, 80, 95];

	return (
		<SafeAreaView className="flex-1 bg-slate-50">
			{/* Header */}
			<View className="bg-slate-800 py-4 px-5">
				<Text className="text-white text-xl font-bold">Profile</Text>
			</View>

			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Profile banner */}
				<View className="bg-emerald-500 px-5 py-6">
					<View className="flex-row items-center">
						<View className="w-15 h-15 rounded-full bg-white/20 items-center justify-center">
							<Text className="text-white text-2xl font-bold">H</Text>
						</View>
						<View className="flex-1 ml-4">
							<Text className="text-white text-2xl font-bold">Haru</Text>
							<Text className="text-white/80 text-base mt-0.5">@Vibha</Text>
						</View>
						<TouchableOpacity className="p-2">
							<Text className="text-white text-xl">✏️</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Progress (component) */}
				<View className="mx-4 -mt-2.5">
					<WeeklyProgress
						data={progressData}
						deltaText="+2.6%"
						statusText="On track"
						statusLabel="Amazing"
					/>
				</View>

				{/* Settings List */}
				<View className="bg-white mx-4 mt-4 rounded-xl shadow-lg">
					<TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
						<View className="flex-row items-center flex-1">
							<Text className="text-xl mr-4">👤</Text>
							<View className="flex-1">
								<Text className="text-slate-800 text-base font-semibold">My Account</Text>
								<Text className="text-slate-500 text-sm mt-0.5">Make changes to your account</Text>
							</View>
						</View>
						<Text className="text-slate-400 text-xl font-bold">›</Text>
					</TouchableOpacity>

					<TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
						<View className="flex-row items-center flex-1">
							<Text className="text-xl mr-4">🛡️</Text>
							<View className="flex-1">
								<Text className="text-slate-800 text-base font-semibold">Two-Factor Authentication</Text>
								<Text className="text-slate-500 text-sm mt-0.5">Further secure your account for safety</Text>
							</View>
						</View>
						<Text className="text-slate-400 text-xl font-bold">›</Text>
					</TouchableOpacity>

					<TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
						<View className="flex-row items-center flex-1">
							<Text className="text-xl mr-4">📊</Text>
							<View className="flex-1">
								<Text className="text-slate-800 text-base font-semibold">Progress Report</Text>
								<Text className="text-slate-500 text-sm mt-0.5">Check your progress and improve</Text>
							</View>
						</View>
						<Text className="text-slate-400 text-xl font-bold">›</Text>
					</TouchableOpacity>

					<TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
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
					<TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
						<View className="flex-row items-center flex-1">
							<Text className="text-xl mr-4">🆘</Text>
							<View className="flex-1">
								<Text className="text-slate-800 text-base font-semibold">Help & Support</Text>
							</View>
						</View>
						<Text className="text-slate-400 text-xl font-bold">›</Text>
					</TouchableOpacity>

					<TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
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

			{/* Bottom Navigation (placeholder) */}
			<View className="flex-row bg-white py-3 px-5 border-t border-slate-200">
				<TouchableOpacity className="flex-1 items-center py-2"><Text className="text-2xl text-slate-800">🏠</Text></TouchableOpacity>
				<TouchableOpacity className="flex-1 items-center py-2"><Text className="text-2xl text-slate-400">📹</Text></TouchableOpacity>
				<TouchableOpacity className="flex-1 items-center py-2"><Text className="text-2xl text-slate-400">💬</Text></TouchableOpacity>
				<TouchableOpacity className="flex-1 items-center py-2"><Text className="text-2xl text-slate-400">👥</Text></TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default ProfilePage;