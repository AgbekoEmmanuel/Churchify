import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function ProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [user, setUser] = useState({ name: 'Guest', email: 'guest@churchify.com', fellowship: 'General' });
    const [notifications, setNotifications] = useState(true);

    // ... loadProfile ...
    const handleLogout = () => {
        // Implement logout logic here later if needed
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
    };

    // Render Logic
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: insets.top }]}>
                {/* ... header content ... */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.profileCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200' }}
                        style={styles.avatar}
                    />
                    <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
                    <View style={[styles.badge, { backgroundColor: colors.backgroundSecondary }]}>
                        <Text style={[styles.badgeText, { color: colors.primary }]}>{user.fellowship}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>Settings</Text>

                    <SettingItem
                        icon="notifications-outline"
                        title="Notifications"
                        rightElement={<Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.primary }} />}
                        colors={colors}
                    />
                    {/* Dark Mode Removed */}
                    <SettingItem icon="language-outline" title="Language" value="English" colors={colors} />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>Account</Text>
                    <SettingItem icon="card-outline" title="Giving History" isLink onPress={() => navigation.navigate('Giving')} colors={colors} />
                    <SettingItem icon="shield-checkmark-outline" title="Privacy & Security" isLink colors={colors} />
                    <SettingItem icon="help-circle-outline" title="Help & Support" isLink colors={colors} />
                </View>

                {/* ... logout ... */}

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Version 1.0.5 (Build 24)</Text>
            </ScrollView>
        </View>
    );
}

const SettingItem = ({ icon, title, value, rightElement, isLink, onPress, colors }) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: colors.card }]} onPress={onPress} disabled={!onPress}>
        <View style={styles.itemLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name={icon} size={20} color={colors.text} />
            </View>
            <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
        </View>
        <View style={styles.itemRight}>
            {rightElement}
            {value && <Text style={[styles.itemValue, { color: colors.textSecondary }]}>{value}</Text>}
            {isLink && <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
        </View>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        backgroundColor: colors.primary, paddingHorizontal: 20, paddingBottom: 24,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    backBtn: { padding: 4 },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
    editBtn: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },

    content: { paddingBottom: 40 },

    profileCard: {
        backgroundColor: '#fff', margin: 20, marginTop: -20, borderRadius: 20,
        alignItems: 'center', padding: 24,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
    },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
    userName: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
    userEmail: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
    badge: { backgroundColor: '#EBF3FA', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    badgeText: { color: colors.primary, fontWeight: '600', fontSize: 12 },

    section: { marginBottom: 24, paddingHorizontal: 20 },
    sectionHeader: { fontSize: 14, fontWeight: '700', color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase' },

    item: {
        backgroundColor: '#fff', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: 12, marginBottom: 8
    },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
    itemTitle: { fontSize: 16, color: colors.text, fontWeight: '500' },
    itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemValue: { color: colors.textSecondary, fontSize: 14 },

    logoutBtn: { marginHorizontal: 20, backgroundColor: '#FFE5E5', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
    logoutText: { color: '#FF4444', fontWeight: '700', fontSize: 16 },
    version: { textAlign: 'center', color: colors.textMuted, fontSize: 12 }
});
