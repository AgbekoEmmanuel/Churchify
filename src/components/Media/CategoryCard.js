import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const CategoryCard = ({ title, subtitle, icon, color, onPress, img }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <Image source={{ uri: img }} style={styles.cover} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.cardRow}>
                <View style={[styles.iconWrap, { backgroundColor: color }]}>
                    <Ionicons name={icon} size={20} color="#fff" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardSub}>{subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.borderLight,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    cover: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.card,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: '800',
        color: colors.text,
        fontSize: 18,
        marginBottom: 2,
    },
    cardSub: {
        color: colors.textSecondary,
        fontSize: 14,
    },
});

export default CategoryCard;
