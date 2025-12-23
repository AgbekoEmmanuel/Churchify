import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Animated,
    Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from '../../theme/colors';

export default function HomeHeader({ displayName, streak, initial, onAvatarPress, onNotificationPress }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={[s.fixedHeader, {
            backgroundColor: colors.background,
            borderBottomColor: colors.borderLight,
            shadowColor: colors.shadow
        }]}>
            <SafeAreaView>
                <Animated.View style={[s.headerContent, { opacity: fadeAnim }]}>
                    {/* Left side - Greeting */}
                    <View style={s.greetingSection}>
                        <Text style={[s.greeting, { color: colors.text }]}>👋 Welcome back, {displayName}</Text>
                        <Text style={[s.subGreeting, { color: colors.textSecondary }]}>Here's what's happening today</Text>
                    </View>

                    {/* Right side - Icons */}
                    <View style={s.iconsSection}>
                        <View style={s.iconBadge}>
                            <MaterialCommunityIcons name="fire" size={22} color={colors.warning} />
                            <View style={[s.badgeBubble, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                                <Text style={s.badgeText}>{streak}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={[s.iconButton, { backgroundColor: colors.backgroundSecondary }]} onPress={onNotificationPress}>
                            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onAvatarPress}>
                            <View style={[s.avatar, { backgroundColor: colors.primary, borderColor: colors.backgroundSecondary }]}>
                                <Text style={s.avatarText}>{initial}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Search Bar */}
                <View style={[s.searchBar, {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.borderLight,
                    shadowColor: colors.shadow
                }]}>
                    <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                    <TextInput
                        style={[s.searchInput, { color: colors.text }]}
                        placeholder="Search sermons, events, notes…"
                        placeholderTextColor={colors.textMuted}
                        returnKeyType="search"
                    />
                    <TouchableOpacity style={[s.filterPill, { backgroundColor: colors.backgroundSecondary }]}>
                        <Ionicons name="options-outline" size={16} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const s = StyleSheet.create({
    fixedHeader: {
        // backgroundColor handled inline
        borderBottomWidth: 1,
        paddingTop: Platform.OS === 'android' ? 30 : 0,
        zIndex: 1000,
        elevation: 4,
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    greetingSection: {
        flex: 1,
    },
    greeting: {
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    subGreeting: {
        fontSize: 13,
        fontWeight: "500",
    },
    iconsSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconButton: {
        padding: 4,
        borderRadius: 50,
    },
    iconBadge: {
        position: "relative",
        marginRight: 4,
    },
    badgeBubble: {
        position: "absolute",
        top: -6,
        right: -8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 18,
        alignItems: 'center',
        borderWidth: 1.5,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: "bold",
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        marginLeft: 4,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: "600",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 16,
        borderWidth: 1,
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        height: '100%',
    },
    filterPill: {
        padding: 6,
        borderRadius: 8,
    },
});
