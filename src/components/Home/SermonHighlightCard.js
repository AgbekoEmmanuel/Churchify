import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function SermonHighlightCard({ navigation }) {
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={[s.sermonCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Media', { screen: 'SermonsList' })}
            >
                <ImageBackground
                    source={{ uri: "https://i.pinimg.com/1200x/34/2a/d1/342ad15a074fa1a4cf24afe25c499c4b.jpg" }}
                    style={s.sermonImage}
                    imageStyle={{ borderRadius: 24 }}
                >
                    <LinearGradient
                        colors={[`${colors.primary}E6`, "rgba(10,62,94,0.4)", "transparent"]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFillObject}
                    />

                    {/* Glass effect container for content */}
                    <View style={s.sermonContent}>
                        <View style={s.badge}>
                            <View style={s.liveDot} />
                            <Text style={s.badgeText}>Sunday Service</Text>
                        </View>

                        <View style={{ gap: 4 }}>
                            <Text style={s.sermonKicker}>Latest Sermon</Text>
                            <Text style={s.sermonTitle}>"Walking In Faith"</Text>
                        </View>

                        <View style={s.sermonMetaRow}>
                            <View style={s.metaItem}>
                                <Ionicons name="time-outline" size={14} color={colors.white} />
                                <Text style={s.sermonMeta}>12:30 PM</Text>
                            </View>
                            <View style={s.divider} />
                            <View style={s.metaItem}>
                                <Ionicons name="location-outline" size={14} color={colors.white} />
                                <Text style={s.sermonMeta}>Main Hall</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[s.playButton, { backgroundColor: colors.surface }]}>
                        <Ionicons name="play" size={20} color={colors.primary} />
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </Animated.View>
    );
}

const s = StyleSheet.create({
    sermonCard: {
        height: 220,
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 24,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    sermonImage: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 20,
        borderRadius: 24,
        overflow: 'hidden',
    },
    sermonContent: {
        gap: 12,
    },
    badge: {
        position: 'absolute',
        top: -160,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    sermonKicker: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
    },
    sermonTitle: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: "800",
        letterSpacing: -0.5,
        lineHeight: 30,
        maxWidth: '85%',
    },
    sermonMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sermonMeta: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 13,
        fontWeight: "500",
    },
    divider: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    playButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
});
