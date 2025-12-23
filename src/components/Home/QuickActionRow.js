import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function QuickActionRow({ navigation }) {
    return (
        <View style={s.quickRow}>
            <QuickAction
                icon="book-outline"
                label="Notes"
                onPress={() => navigation.navigate('Notes')}
                colors={colors}
            />
            <QuickAction
                icon="time-outline"
                label="Quiet Time"
                onPress={() => navigation.navigate("QuietTimeStack")}
                colors={colors}
            />
            <QuickAction
                icon="people-outline"
                label="Community"
                onPress={() => navigation.navigate('Community')}
                colors={colors}
            />
            <QuickAction
                icon="calendar-outline"
                label="Events"
                onPress={() => navigation.navigate('Events')}
                colors={colors}
            />
        </View>
    );
}

function QuickAction({ icon, label, onPress }) {
    return (
        <TouchableOpacity style={s.quickItem} onPress={onPress} activeOpacity={0.7}>
            <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[s.quickIcon, { shadowColor: colors.primary }]}
            >
                <Ionicons name={icon} size={22} color={colors.white} />
                {/* Shine effect */}
                <View style={s.shine} />
            </LinearGradient>
            <Text style={[s.quickLabel, { color: colors.text }]}>{label}</Text>
        </TouchableOpacity>
    );
}

const s = StyleSheet.create({
    quickRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    quickItem: {
        alignItems: "center",
        gap: 8,
    },
    quickIcon: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
        position: 'relative',
        overflow: 'hidden',
    },
    shine: {
        position: 'absolute',
        top: -30,
        left: -30,
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        transform: [{ scaleY: 0.5 }, { rotate: '45deg' }],
    },
    quickLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.text,
        letterSpacing: -0.2,
    },
});
