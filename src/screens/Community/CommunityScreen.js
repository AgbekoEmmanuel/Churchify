import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';

const FELLOWSHIP_THEMES = {
    'Men\'s Fellowship': { color: '#2C3E50', image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2400', icon: 'man' },
    'Women\'s Ministry': { color: '#E91E63', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400', icon: 'woman' },
    'Youth Church': { color: '#FF5722', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2400', icon: 'flash' },
    'Children\'s Ministry': { color: '#4CAF50', image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?q=80&w=2400', icon: 'happy' },
    'General': { color: colors.primary, image: 'https://images.unsplash.com/photo-1544427920-299317d446df?q=80&w=2400', icon: 'people' }
};

export default function CommunityScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [fellowship, setFellowship] = useState('General');
    const [isAdmin, setIsAdmin] = useState(false); // Mock admin role

    useEffect(() => {
        loadFellowship();
    }, []);

    const loadFellowship = async () => {
        try {
            const stored = await AsyncStorage.getItem('userFellowship');
            if (stored) setFellowship(stored);
            // userProfile check for role could happen here
        } catch (e) {
            console.log('Error loading fellowship', e);
        }
    };

    const theme = FELLOWSHIP_THEMES[fellowship] || FELLOWSHIP_THEMES['General'];

    return (
        <View style={styles.container}>
            {/* Header Image */}
            <View style={styles.headerContainer}>
                <Image source={{ uri: theme.image }} style={styles.headerImage} />
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                    style={styles.headerOverlay}
                />
                <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={[styles.headerContent, { paddingBottom: 24 }]}>
                    <View style={[styles.badge, { backgroundColor: theme.color }]}>
                        <Ionicons name={(theme.icon === 'man' || theme.icon === 'woman') ? theme.icon : theme.icon === 'flash' ? 'flash' : 'people'} size={14} color="#fff" />
                        <Text style={styles.badgeText}>{fellowship}</Text>
                    </View>
                    <Text style={styles.headerTitle}>{fellowship} Fellowship</Text>
                    <Text style={styles.headerSubtitle}>Connect, Grow, and Serve together.</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>

                {/* Admin Portal Entry - Visible for demo */}
                <TouchableOpacity style={styles.adminCard} onPress={() => console.log('Admin Portal Accessed')}>
                    <LinearGradient
                        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={styles.adminGradient}
                    >
                        <View>
                            <Text style={styles.adminTitle}>Leader's Portal</Text>
                            <Text style={styles.adminSub}>Manage members & events</Text>
                        </View>
                        <MaterialCommunityIcons name="shield-crown" size={32} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.grid}>
                    <ActionCard icon="chatbubbles-outline" title="Discuss" color={colors.primary} delay={0} />
                    <ActionCard icon="calendar-outline" title="Events" color={colors.secondary} delay={100} />
                    <ActionCard icon="people-outline" title="Members" color="#E91E63" delay={200} />
                    <ActionCard icon="book-outline" title="Resources" color="#FF9800" delay={300} />
                </View>

                {/* Upcoming Meetup */}
                <Text style={styles.sectionTitle}>Next Meetup</Text>
                <View style={styles.meetupCard}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateDay}>24</Text>
                        <Text style={styles.dateMonth}>DEC</Text>
                    </View>
                    <View style={styles.meetupInfo}>
                        <Text style={styles.meetupTitle}>Christmas Eve Fellowship</Text>
                        <Text style={styles.meetupTime}>⏰ 6:00 PM - 8:00 PM</Text>
                        <Text style={styles.meetupLoc}>📍 Main Auditorium</Text>
                    </View>
                    <TouchableOpacity style={styles.joinBtn}>
                        <Text style={styles.joinText}>Join</Text>
                    </TouchableOpacity>
                </View>

                {/* Prayer Requests */}
                <View style={styles.rowHeader}>
                    <Text style={styles.sectionTitle}>Community Prayers</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>View All</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
                    <PrayerCard author="Sarah Jenkins" request="Pray for my upcoming exams." />
                    <PrayerCard author="David Okonkwo" request="Healing for my grandmother." />
                    <PrayerCard author="Fellowship Lead" request="Growth for our upcoming outreach." />
                </ScrollView>

            </ScrollView>
        </View>
    );
}

const ActionCard = ({ icon, title, color }) => (
    <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
)

const PrayerCard = ({ author, request }) => (
    <View style={styles.prayerCard}>
        <View style={styles.prayerHeader}>
            <View style={styles.prayerAvatar}>
                <Text style={styles.prayerInitial}>{author[0]}</Text>
            </View>
            <Text style={styles.prayerAuthor}>{author}</Text>
        </View>
        <Text style={styles.prayerText} numberOfLines={2}>{request}</Text>
    </View>
)

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerContainer: { height: 280, position: 'relative' },
    headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    headerOverlay: { ...StyleSheet.absoluteFillObject },
    backButton: {
        position: 'absolute', left: 20,
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center', justifyContent: 'center'
    },
    headerContent: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 24
    },
    badge: {
        flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 8, gap: 4
    },
    badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
    headerTitle: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 4 },
    headerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 16 },

    content: { padding: 20 },

    adminCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 24, elevation: 5 },
    adminGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
    adminTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
    adminSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },

    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    actionCard: {
        width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
    },
    iconBox: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    actionTitle: { fontWeight: '600', color: colors.text },

    meetupCard: {
        flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 24,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
    },
    dateBox: {
        backgroundColor: '#F0F7FF', padding: 10, borderRadius: 12, alignItems: 'center', marginRight: 16
    },
    dateDay: { fontSize: 20, fontWeight: '800', color: colors.primary },
    dateMonth: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
    meetupInfo: { flex: 1 },
    meetupTitle: { fontWeight: '700', fontSize: 15, color: colors.text, marginBottom: 4 },
    meetupTime: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
    meetupLoc: { fontSize: 12, color: colors.textMuted },
    joinBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    joinText: { color: '#fff', fontWeight: '600', fontSize: 12 },

    rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    seeAll: { color: colors.primary, fontWeight: '600' },
    prayerCard: {
        width: 200, backgroundColor: '#fff', padding: 16, borderRadius: 16, marginRight: 12,
        borderWidth: 1, borderColor: '#f0f0f0'
    },
    prayerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    prayerAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
    prayerInitial: { color: '#fff', fontWeight: '700' },
    prayerAuthor: { fontWeight: '600', fontSize: 13, color: colors.text },
    prayerText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});
