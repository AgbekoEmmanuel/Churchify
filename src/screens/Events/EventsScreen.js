import React from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';

const EVENTS_DATA = [
    {
        title: "This Weekend",
        data: [
            { id: '1', title: 'Sunday Celebration Service', time: '8:00 AM & 10:00 AM', location: 'Main Auditorium', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2400', tag: 'Service' },
            { id: '2', title: 'New Members Class', time: '12:30 PM', location: 'Hall B', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2400', tag: 'Class' },
        ]
    },
    {
        title: "Coming Up",
        data: [
            { id: '3', title: 'Worship Night: Overflow', time: 'Friday, 6:00 PM', location: 'Main Auditorium', image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2400', tag: 'Worship' },
            { id: '4', title: 'Community Outreach', time: 'Saturday, 9:00 AM', location: 'City Center', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2400', tag: 'Outreach' },
        ]
    }
];

export default function EventsScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const renderEvent = ({ item }) => (
        <TouchableOpacity style={styles.eventCard} activeOpacity={0.9}>
            <Image source={{ uri: item.image }} style={styles.eventImage} />
            <View style={styles.eventContent}>
                <View style={styles.tagContainer}>
                    <Text style={[styles.tagText, { color: colors.primary }]}>{item.tag}</Text>
                </View>
                <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{item.time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{item.location}</Text>
                </View>
                <TouchableOpacity style={styles.registerBtn}>
                    <Text style={[styles.registerText, { color: colors.primary }]}>Register</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Upcoming Events</Text>
            </View>

            <SectionList
                sections={EVENTS_DATA}
                keyExtractor={(item) => item.id}
                renderItem={renderEvent}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>{title}</Text>
                )}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20,
        borderBottomWidth: 1
    },
    backBtn: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    sectionHeader: {
        fontSize: 14, fontWeight: '700',
        marginTop: 10, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1
    },
    eventCard: {
        backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden',
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4
    },
    eventImage: { width: '100%', height: 150 },
    eventContent: { padding: 16 },
    tagContainer: {
        position: 'absolute', top: -140, right: 16,
        backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20
    },
    tagText: { fontWeight: '700', fontSize: 12 },
    eventTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
    infoText: { fontSize: 13 },
    registerBtn: {
        marginTop: 12, backgroundColor: '#F0F7FF', paddingVertical: 10, borderRadius: 10,
        alignItems: 'center'
    },
    registerText: { fontWeight: '700' },
});
