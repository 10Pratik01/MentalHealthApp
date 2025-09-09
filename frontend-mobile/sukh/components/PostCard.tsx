import React from 'react';
import { Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export type Post = {
	id: string;
	authorName: string;
	authorAvatarUrl?: string;
	content: string;
	timestamp: string; // ISO or "just now"
	likes: number;
	comments: number;
	anonymous?: boolean;
};

type Props = {
	post: Post;
	onLike?: (id: string) => void;
	onComment?: (id: string) => void;
	onShare?: (id: string) => void;
};

const PostCard: React.FC<Props> = ({ post, onLike, onComment, onShare }) => {
	const displayName = post.anonymous ? 'Anonymous' : post.authorName;

	return (
		<View style={styles.card}>
			<View style={styles.headerRow}>
				<View style={styles.avatar}>
					{post.anonymous ? (
						<Text style={styles.avatarText}>Anon</Text>
					) : post.authorAvatarUrl ? (
						<Image source={{ uri: post.authorAvatarUrl }} style={styles.avatarImg} />
					) : (
						<Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
					)}
				</View>
				<View style={styles.nameTime}>
					<Text style={styles.name}>{displayName}</Text>
					<Text style={styles.time}>{post.timestamp}</Text>
				</View>
			</View>

			<Text style={styles.content}>{post.content}</Text>

			<View style={styles.actionsRow}>
				<TouchableOpacity style={styles.actionBtn} onPress={() => onLike?.(post.id)}>
					<Text style={styles.actionIcon}>👍</Text>
					<Text style={styles.actionTxt}>{post.likes}</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionBtn} onPress={() => onComment?.(post.id)}>
					<Text style={styles.actionIcon}>💬</Text>
					<Text style={styles.actionTxt}>{post.comments}</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.shareBtn} onPress={() => onShare?.(post.id)}>
					<Text style={styles.actionIcon}>↗️</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderColor: 'rgba(255,255,255,0.12)',
		borderWidth: 1,
		borderRadius: 10,
		padding: 12,
	},
	headerRow: { flexDirection: 'row', alignItems: 'center' },
	avatar: {
		height: 34,
		width: 34,
		borderRadius: 17,
		backgroundColor: '#4b5563',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	avatarImg: { height: '100%', width: '100%' },
	avatarText: { color: 'white', fontSize: 11 },
	nameTime: { marginLeft: 10, flexShrink: 1 },
	name: { color: 'white', fontSize: 14, fontWeight: '600' },
	time: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: -2 },
	content: {
		color: 'rgba(255,255,255,0.9)',
		fontSize: 13,
		lineHeight: 18,
		marginTop: 8,
	},
	actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
	actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 18 },
	actionIcon: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginRight: 6 },
	actionTxt: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
	shareBtn: { marginLeft: 'auto' },
});

export default PostCard;