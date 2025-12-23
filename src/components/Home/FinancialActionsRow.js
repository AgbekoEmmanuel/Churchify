import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function FinancialActionsRow() {
    return (
        <View style={s.container}>
            <View style={s.sectionHeader}>
                <Text style={[s.sectionTitle, { color: colors.text }]}>Quick Financial Actions</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.scrollContent}
            >
                <FinancialAction
                    icon="wallet-outline"
                    label="Offertory"
                    onPress={() => console.log('Offertory clicked')}
                    color={colors.primary}
                    labelColor={colors.textSecondary}
                    shadowColor={colors.shadowStrong}
                />
                <FinancialAction
                    icon="card-outline"
                    label="Tithe"
                    onPress={() => console.log('Tithe clicked')}
                    color={colors.secondary}
                    labelColor={colors.textSecondary}
                    shadowColor={colors.shadowStrong}
                />
                <FinancialAction
                    icon="heart-outline"
                    label="Giving"
                    onPress={() => console.log('Giving clicked')}
                    color={colors.complementary}
                    labelColor={colors.textSecondary}
                    shadowColor={colors.shadowStrong}
                />
                <FinancialAction
                    icon="ribbon-outline"
                    label="Pledges"
                    onPress={() => console.log('Pledges clicked')}
                    color="#8B5A2B"
                    labelColor={colors.textSecondary}
                    shadowColor={colors.shadowStrong}
                />
                <FinancialAction
                    icon="gift-outline"
                    label="Donations"
                    onPress={() => console.log('Donations clicked')}
                    color="#0E7C61"
                    labelColor={colors.textSecondary}
                    shadowColor={colors.shadowStrong}
                />
            </ScrollView>
        </View>
    );
}

function FinancialAction({ icon, label, onPress, color, labelColor, shadowColor }) {
    return (
        <TouchableOpacity style={s.financialActionItem} onPress={onPress} activeOpacity={0.85}>
            <View style={[s.financialActionIcon, { backgroundColor: color, shadowColor: shadowColor }]}>
                <Ionicons name={icon} size={22} color="#fff" />
            </View>
            <Text style={[s.financialActionLabel, { color: labelColor }]}>{label}</Text>
        </TouchableOpacity>
    );
}

const s = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    financialActionItem: {
        alignItems: 'center',
        width: 72,
        gap: 8,
    },
    financialActionIcon: {
        width: 60,
        height: 60,
        borderRadius: 20, // Squircle
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    financialActionLabel: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
});
