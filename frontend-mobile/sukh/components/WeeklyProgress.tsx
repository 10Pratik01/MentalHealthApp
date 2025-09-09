import React from 'react';
import { View, Text } from 'react-native';

type WeeklyProgressProps = {
	data: number[]; // e.g. 7 values (0-100)
	title?: string; // default: "Progress this week"
	deltaText?: string; // e.g. "+2.6%"
	statusText?: string; // e.g. "On track"
	statusLabel?: string; // e.g. "Amazing"
	maxBarHeight?: number; // px height for tallest bar, default 60
};

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
	data,
	title = 'Progress this week',
	deltaText = '+0%',
	statusText = 'On track',
	statusLabel = 'Amazing',
	maxBarHeight = 60,
}) => {
	const max = Math.max(1, ...data);
	const days = ['S','M','T','W','T','F','S'];

	return (
		<View className="bg-white rounded-xl p-5 shadow-lg">
			<View className="flex-row items-center justify-between">
				<Text className="text-slate-500 text-sm">{title}</Text>
				<Text className="text-emerald-500 text-sm font-bold">{deltaText}</Text>
			</View>

			<Text className="text-slate-800 text-3xl font-bold mt-2">{statusLabel}</Text>

			<View className="flex-row items-center mt-2">
				<View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
				<Text className="text-emerald-500 text-sm font-medium">{statusText}</Text>
			</View>

			<View className="flex-row justify-between items-end mt-5 h-20">
				{data.map((v, i) => (
					<View key={i} className="items-center flex-1">
						<View
							className="w-5 rounded-lg mb-2"
							style={{
								height: (v / max) * maxBarHeight,
								backgroundColor: v >= 70 ? '#10B981' : '#E5E7EB',
							}}
						/>
						<Text className="text-slate-500 text-xs font-medium">{days[i] ?? ''}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

export default WeeklyProgress;