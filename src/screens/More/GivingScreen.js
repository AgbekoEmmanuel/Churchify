import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Animated,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

const AMOUNTS = [10, 20, 50, 100, 200, 500];
const FUNDS = ['Tithes', 'Offering', 'Building Fund', 'Missions'];

export default function GivingScreen({ navigation }) {
    const [amount, setAmount] = useState('');
    const [selectedFund, setSelectedFund] = useState('Tithes');
    const [isRecurring, setIsRecurring] = useState(false);

    const handleAmountSelect = (val) => {
        setAmount(val.toString());
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Give</Text>
                <TouchableOpacity style={styles.historyButton}>
                    <Ionicons name="time-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Main Amount Display */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        keyboardType="numeric"
                        autoFocus={false}
                    />
                </View>

                <View style={styles.cardContainer}>
                    {/* Fund Selector */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Select Fund</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fundScroll}>
                            {FUNDS.map(fund => (
                                <TouchableOpacity
                                    key={fund}
                                    style={[
                                        styles.fundChip,
                                        { backgroundColor: colors.background, borderColor: colors.borderLight },
                                        selectedFund === fund && { backgroundColor: colors.primary, borderColor: colors.primary }
                                    ]}
                                    onPress={() => setSelectedFund(fund)}
                                >
                                    <Text style={[
                                        styles.fundText,
                                        { color: colors.text },
                                        selectedFund === fund && { color: '#fff' }
                                    ]}>{fund}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Quick Amounts */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Quick Amount</Text>
                        <View style={styles.grid}>
                            {AMOUNTS.map(val => (
                                <TouchableOpacity
                                    key={val}
                                    style={[
                                        styles.amountChip,
                                        { backgroundColor: '#fff', borderColor: colors.border }, // Chip bg might just be white always or surface
                                        amount === val.toString() && { borderColor: colors.primary, backgroundColor: `${colors.primary}10` }
                                    ]}
                                    onPress={() => handleAmountSelect(val)}
                                >
                                    <Text style={[
                                        styles.amountChipText,
                                        { color: colors.text },
                                        amount === val.toString() && { color: colors.primary }
                                    ]}>${val}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Recurring Toggle */}
                    <View style={[styles.recurringRow, { backgroundColor: colors.background }]}>
                        <View>
                            <Text style={[styles.recurringTitle, { color: colors.text }]}>Make this recurring</Text>
                            <Text style={[styles.recurringSub, { color: colors.textSecondary }]}>Schedule automatic monthly giving</Text>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.toggle,
                                { backgroundColor: colors.border },
                                isRecurring && { backgroundColor: colors.success }
                            ]}
                            onPress={() => setIsRecurring(!isRecurring)}
                        >
                            <View style={[styles.toggleCircle, isRecurring && styles.toggleCircleActive]} />
                        </TouchableOpacity>
                    </View>

                    {/* Give Button */}
                    <TouchableOpacity style={[styles.giveButton, { shadowColor: colors.primary }]} activeOpacity={0.9}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradient}
                        >
                            <Text style={styles.giveButtonText}>Give Now</Text>
                            <Ionicons name="lock-closed" size={16} color="rgba(255,255,255,0.7)" style={{ marginLeft: 8 }} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={[styles.secureText, { color: colors.textMuted }]}>
                        <Ionicons name="shield-checkmark" size={14} color={colors.success} /> 100% Secure Transaction
                    </Text>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    currencySymbol: {
        fontSize: 40,
        color: '#fff',
        fontWeight: '700',
        marginRight: 4,
    },
    amountInput: {
        fontSize: 64,
        color: '#fff',
        fontWeight: '700',
        minWidth: 60,
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
    },
    fundScroll: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    fundChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 12,
        borderWidth: 1,
    },
    fundText: {
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    amountChip: {
        width: '30%',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1,
    },
    amountChipText: {
        fontSize: 16,
        fontWeight: '700',
    },
    recurringRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 32,
    },
    recurringTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    recurringSub: {
        fontSize: 12,
        marginTop: 2,
    },
    toggle: {
        width: 50,
        height: 30,
        borderRadius: 15,
        padding: 2,
    },
    toggleCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#fff',
    },
    toggleCircleActive: {
        transform: [{ translateX: 20 }]
    },
    giveButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    gradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    giveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    secureText: {
        textAlign: 'center',
        fontSize: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
