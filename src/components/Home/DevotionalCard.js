import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function DevotionalCard({ onPress }) {
    return (
        <TouchableOpacity
            style={[d.card, {
                backgroundColor: colors.card,
                borderColor: colors.borderLight,
                shadowColor: colors.shadow
            }]}
            activeOpacity={0.9}
            onPress={onPress}
        >
            {/* Top blue accent line */}
            <View style={[d.accent, { backgroundColor: colors.primary }]} />

            {/* Header row */}
            <View style={d.headerRow}>
                <View style={d.leftWrap}>
                    <View style={[d.iconWrap, { backgroundColor: colors.backgroundSecondary }]}>
                        <Ionicons name="leaf-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[d.title, { color: colors.text }]}>Devotional for the Day</Text>
                        <View style={d.subRow}>
                            <Text numberOfLines={1} style={[d.subtitle, { color: colors.textSecondary }]}>
                                Growing Daily in faith daily by listening to the word of God…
                            </Text>
                            <Text style={[d.readMore, { color: colors.primary }]}> Read More</Text>
                        </View>
                    </View>
                </View>

                <Text style={[d.dateText, { color: colors.textMuted }]}>
                    {new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const d = StyleSheet.create({
    card: {
        borderRadius: 20, // Increased from 12
        marginHorizontal: 16,
        marginBottom: 24, // Added spacing
        borderWidth: 1,
        overflow: 'hidden',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    accent: {
        height: 4,
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    leftWrap: {
        flex: 1,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 2,
    },
    subRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'nowrap',
        paddingRight: 10,
    },
    subtitle: {
        fontSize: 12,
        flexShrink: 1,
    },
    readMore: {
        fontSize: 12,
        fontWeight: '800',
    },
    dateText: {
        fontSize: 11,
        fontWeight: '700',
    },
});
