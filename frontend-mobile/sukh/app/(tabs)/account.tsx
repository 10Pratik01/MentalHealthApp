import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import WeeklyProgress from '../../components/WeeklyProgress';
import BottomNavBar from '../../components/BottomNavBar';

const ProfilePage: React.FC = () => {
	const progressData = [85, 60, 90, 45, 75, 80, 95];

	const handleEditProfile = () => {
		// Navigate to edit profile screen
		console.log('Navigate to edit profile');
	};

	const handleMyAccount = () => {
		// Navigate to my account screen
		console.log('Navigate to my account');
	};

	const handleTwoFactorAuth = () => {
		// Navigate to two-factor authentication screen
		console.log('Navigate to two-factor authentication');
	};

	const handleLogout = () => {
		Alert.alert(
			'Log Out',
			'Are you sure you want to log out?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Log Out',
					style: 'destructive',
					onPress: () => {
						// Handle logout logic
						console.log('User logged out');
					},
				},
			]
		);
	};

	const handleProgressReport = () => {
		// Navigate to progress report screen
		console.log('Navigate to progress report');
	};

	const handleHelpSupport = () => {
		// Navigate to help & support screen
		console.log('Navigate to help & support');
	};

	const handleAboutApp = () => {
		// Navigate to about app screen
		console.log('Navigate to about app');
	};

	const renderMenuItem = (
		icon: string,
		title: string,
		description: string,
		onPress: () => void,
		isDestructive: boolean = false
	) => (
		<TouchableOpacity
			onPress={onPress}
			className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm"
		>
			<View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4">
				<Text className="text-gray-600 text-lg">{icon}</Text>
			</View>
			<View className="flex-1">
				<Text className={`text-lg font-semibold ${isDestructive ? 'text-red-500' : 'text-gray-800'}`}>
					{title}
				</Text>
				<Text className="text-gray-500 text-sm mt-1">{description}</Text>
			</View>
			<Text className="text-gray-400 text-lg">›</Text>
		</TouchableOpacity>
	);

	return (
		<View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
			<SafeAreaView style={{ flex: 1 }}>
				{/* Header */}
				<View style={{ backgroundColor: '#1e293b', paddingVertical: 16, paddingHorizontal: 20 }}>
					<Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Profile</Text>
				</View>
				
				<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
					{/* User Profile Card */}
					<View className="bg-teal-500 mx-4 mt-4 rounded-xl p-6 flex-row items-center">
						<Image
							source={{ uri: 'https://example.com/user-avatar.jpg' }}
							className="w-16 h-16 rounded-full mr-4"
						/>
						<View className="flex-1">
							<Text className="text-white text-2xl font-bold">Haru</Text>
							<Text className="text-white text-lg opacity-90">@Vibha</Text>
						</View>
						<TouchableOpacity
							onPress={handleEditProfile}
							className="w-8 h-8 items-center justify-center"
						>
							<Text className="text-white text-xl">✏️</Text>
						</TouchableOpacity>
					</View>

					{/* Progress Section */}
					<View className="mx-4 mt-6">
						<WeeklyProgress
							data={progressData}
							title="Progress this week"
							deltaText="+2.45%"
							statusText="On track"
							statusLabel="Amazing"
						/>
					</View>

					{/* Settings Menu */}
					<View className="mx-4 mt-6 mb-6">
						{renderMenuItem(
							'👤',
							'My Account',
							'Make changes to your account',
							handleMyAccount
						)}
						
						{renderMenuItem(
							'🛡️',
							'Two-Factor Authentication',
							'Further secure your account for safety',
							handleTwoFactorAuth
						)}
						
						{renderMenuItem(
							'��',
							'Progress Report',
							'Check your progress and improve',
							handleProgressReport
						)}
						
						{renderMenuItem(
							'🔔',
							'Help & Support',
							'Get help and contact support',
							handleHelpSupport
						)}
						
						{renderMenuItem(
							'❤️',
							'About App',
							'Learn more about this application',
							handleAboutApp
						)}
						
						{renderMenuItem(
							'🚪',
							'Log out',
							'Sign out of your account',
							handleLogout,
							true
						)}
					</View>
				</ScrollView>
			</SafeAreaView>
			<BottomNavBar />
		</View>
	);
};

export default ProfilePage;