
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import WeeklyProgress from '../../components/WeeklyProgress';
import BottomNavBar from '../../components/BottomNavBar';

const ProfilePage: React.FC = () => {
	const progressData = [85, 60, 90, 45, 75, 80, 95];

	return (
		<View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
			<SafeAreaView style={{ flex: 1 }}>
				{/* Header */}
				<View style={{ backgroundColor: '#1e293b', paddingVertical: 16, paddingHorizontal: 20 }}>
					<Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Profile</Text>
				</View>
				<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
					{/* ...existing code... */}
				</ScrollView>
			</SafeAreaView>
			<BottomNavBar />
		</View>
	);
}

export default ProfilePage;