import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PostCard, { Post } from '../../components/PostCard';

const API_BASE_URL = 'http://localhost:5432/api/v1/community'; // Replace with your backend URL

const CommunityPage: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [composeOpen, setComposeOpen] = useState(false);

	// Axios instance with auth token
	const getAxiosInstance = async () => {
		const token = await AsyncStorage.getItem('token');
		return axios.create({
			baseURL: API_BASE_URL,
			headers: { Authorization: `Bearer ${token}` },
		});
	};

// Fetch posts
const fetchPosts = useCallback(async () => {
	try {
		setLoading(true);
		const api = await getAxiosInstance();
		const res = await api.get('/getPost');

		console.log("Raw response:", res.data);

		// ✅ Normalize data safely into an array
		const rawPosts = res.data?.posts ?? res.data ?? [];
		const postsArray = Array.isArray(rawPosts) ? rawPosts : [rawPosts];

		const mappedPosts: Post[] = postsArray.map((p: any) => ({
			id: p._id,
			authorName: p.anonymous ? 'Anonymous' : p.author?.name || 'Unknown',
			content: p.content,
			timestamp: new Date(p.createdAt).toLocaleString(),
			likes: p.likes?.length || 0,
			comments: p.comments?.length || 0,
			anonymous: p.anonymous,
		}));

		setPosts(mappedPosts);
	} catch (err: any) {
		console.error("Fetch posts error:", err);
		Alert.alert('Error', err.response?.data?.message || 'Failed to fetch posts');
	} finally {
		setLoading(false);
	}
}, []);


	useEffect(() => {
		let mounted = true;
		if (mounted) fetchPosts();
		return () => { mounted = false; };
	}, [fetchPosts]);

	// Create new post
	const onCreatePostChoice = async (anonymous: boolean) => {
		setComposeOpen(false);

		const content = prompt('Enter your post content');
		if (!content) return;

		try {
			const api = await getAxiosInstance();
			const res = await api.post('/createPost', { content, anonymous });
			if (res.status === 201) {
				Alert.alert('Success', 'Post created successfully');
				fetchPosts(); // Refresh posts
			}
		} catch (err: any) {
			console.error(err);
			Alert.alert('Error', err.response?.data?.message || 'Failed to create post');
		}
	};

	const unreadCount = 3;

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.avatarBtn}><Text style={styles.avatarLabel}>You</Text></TouchableOpacity>
				<Text style={styles.title}>Community</Text>
				<TouchableOpacity style={styles.bellBtn}>
					<Text style={styles.bellIcon}>🔔</Text>
					{unreadCount > 0 && (
						<View style={styles.badge}>
							<Text style={styles.badgeTxt}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>

			{/* Sub-header */}
			<View style={styles.subHeader}>
				<Text style={styles.chip}>Trending</Text>
				<View style={{ flex: 1 }} />
				<TouchableOpacity style={styles.filterBtn}><Text style={{ color: 'rgba(255,255,255,0.8)' }}>⚙️</Text></TouchableOpacity>
			</View>

			{/* Feed */}
			<View style={styles.feed}>
				{loading ? (
					<Text style={styles.loading}>Loading…</Text>
				) : (
					<FlatList
						data={posts}
						keyExtractor={(item) => item.id}
						ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
						renderItem={({ item }) => <PostCard post={item} />}
						contentContainerStyle={{ paddingBottom: 120 }}
					/>
				)}
			</View>

			{/* Floating + */}
			<TouchableOpacity style={styles.fab} onPress={() => setComposeOpen(true)} activeOpacity={0.85}>
				<Text style={styles.fabPlus}>＋</Text>
			</TouchableOpacity>

			{/* Modal: choose identity */}
			<Modal visible={composeOpen} transparent animationType="fade" onRequestClose={() => setComposeOpen(false)}>
				<View style={styles.modalBackdrop}>
					<View style={styles.modalCard}>
						<View style={styles.modalHeaderRow}>
							<Text style={styles.modalTitle}>Create a post</Text>
							<TouchableOpacity style={styles.closeBtn} onPress={() => setComposeOpen(false)}>
								<Text style={{ color: 'white', fontSize: 18 }}>✕</Text>
							</TouchableOpacity>
						</View>

						<Text style={styles.modalSub}>Choose how you want to appear in the community.</Text>

						<View style={styles.modalChoices}>
							<TouchableOpacity style={[styles.choice, { marginBottom: 10 }]} onPress={() => onCreatePostChoice(false)}>
								<Text style={styles.choiceEmoji}>👤</Text>
								<View style={styles.choiceTextWrap}>
									<Text style={styles.choiceTitle}>Post with your name</Text>
									<Text style={styles.choiceHint}>Share as yourself</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.choice} onPress={() => onCreatePostChoice(true)}>
								<Text style={styles.choiceEmoji}>🕶️</Text>
								<View style={styles.choiceTextWrap}>
									<Text style={styles.choiceTitle}>Post anonymously</Text>
									<Text style={styles.choiceHint}>Hide your identity</Text>
								</View>
							</TouchableOpacity>
						</View>

						<Text style={styles.modalFootNote}>Be kind. This space is moderated for safety.</Text>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	// Keep all the same styles as before
	container: { flex: 1, backgroundColor: '#0f1017' },
	header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' },
	avatarBtn: { height: 36, width: 36, borderRadius: 18, backgroundColor: '#4b5563', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.12)' },
	avatarLabel: { color: 'white', fontSize: 12 },
	title: { flex: 1, textAlign: 'center', color: 'white', fontSize: 18, fontWeight: '600' },
	bellBtn: { height: 36, width: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', position: 'relative' },
	bellIcon: { color: 'white', fontSize: 18 },
	badge: { position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#34d399', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
	badgeTxt: { color: '#0f1017', fontSize: 10, fontWeight: '700' },
	subHeader: { paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
	chip: { color: '#86efac', backgroundColor: 'rgba(16,185,129,0.18)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, fontSize: 12, fontWeight: '600' },
	filterBtn: { height: 28, width: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
	feed: { flex: 1, paddingHorizontal: 12, paddingTop: 6 },
	loading: { color: 'rgba(255,255,255,0.7)', paddingHorizontal: 4, paddingTop: 8 },
	fab: { position: 'absolute', right: 16, bottom: 28, height: 56, width: 56, borderRadius: 28, backgroundColor: '#34d399', alignItems: 'center', justifyContent: 'center', shadowColor: '#34d399', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
	fabPlus: { color: '#0f1017', fontSize: 30, fontWeight: '700', marginTop: -1 },
	modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
	modalCard: { backgroundColor: '#161825', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
	modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	modalTitle: { color: 'white', fontSize: 16, fontWeight: '600' },
	closeBtn: { height: 28, width: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
	modalSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },
	modalChoices: { marginTop: 14 },
	choice: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderRadius: 12, padding: 12 },
	choiceEmoji: { fontSize: 20, marginRight: 10 },
	choiceTextWrap: { flexShrink: 1 },
	choiceTitle: { color: 'white', fontSize: 14, fontWeight: '600' },
	choiceHint: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
	modalFootNote: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 12, textAlign: 'center' },
});

export default CommunityPage;
