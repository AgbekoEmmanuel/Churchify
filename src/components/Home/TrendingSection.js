import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const TRENDING_MESSAGES = [
    {
        id: "1",
        title: "Faith Over Fear",
        speaker: "Pastor John",
        date: "Aug 25, 2025",
        duration: "12:30",
        category: "Inspiration",
        image: "https://i.pinimg.com/736x/5c/92/40/5c9240698cb89d2836854076ac58f5af.jpg",
        plays: "2.5K"
    },
    {
        id: "2",
        title: "Walking in Purpose",
        speaker: "Pastor Sarah",
        date: "Aug 22, 2025",
        duration: "18:45",
        category: "Purpose",
        image: "https://i.pinimg.com/736x/34/38/68/34386836f9b1f2dc9ce644919776f29b.jpg",
        plays: "1.8K"
    },
    {
        id: "3",
        title: "God's Love Endures",
        speaker: "Elder Mark",
        date: "Aug 20, 2025",
        duration: "15:20",
        category: "Love",
        image: "https://i.pinimg.com/1200x/f6/28/ca/f628ca4c7ea82a03955ac0e8bb5b3ed8.jpg",
        plays: "3.1K"
    },
];

export default function TrendingSection({ navigation }) {
    return (
        <View style={s.container}>
            <View style={s.sectionHeader}>
                <Text style={[s.sectionTitle, { color: colors.text }]}>Trending Messages</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Media', { screen: 'SermonsList' })}>
                    <Text style={[s.seeAll, { color: colors.primary }]}>See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {TRENDING_MESSAGES.map((message) => (
                    <TrendingMessageCard
                        key={message.id}
                        {...message}
                        colors={colors}
                        onPress={() => navigation.navigate('Media', {
                            screen: 'SermonDetails',
                            params: { messageId: message.id }
                        })}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

function TrendingMessageCard({ title, speaker, duration, category, image, plays, onPress }) {
    return (
        <TouchableOpacity style={[s.trendingCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]} activeOpacity={0.9} onPress={onPress}>
            <ImageBackground
                source={{ uri: image }}
                style={s.trendingCardBackground}
                imageStyle={{ borderRadius: 20 }}
            >
                <LinearGradient
                    colors={['rgba(14,86,134,0.1)', 'rgba(0,0,0,0.85)']}
                    style={s.trendingCardGradient}
                >
                    {/* Category pill at top */}
                    <View style={s.trendingCategoryPill}>
                        <Text style={s.trendingCategory}>{category}</Text>
                    </View>

                    {/* Content at bottom */}
                    <View style={s.trendingCardContent}>
                        <Text style={s.trendingTitle} numberOfLines={2}>
                            {title}
                        </Text>

                        <Text style={s.trendingSpeaker} numberOfLines={1}>
                            by {speaker}
                        </Text>

                        <View style={s.trendingFooter}>
                            <View style={s.trendingMetaItem}>
                                <Ionicons name="time-outline" size={12} color="#fff" />
                                <Text style={s.trendingMetaText}>{duration}</Text>
                            </View>

                            <View style={s.trendingMetaItem}>
                                <Ionicons name="play-outline" size={12} color="#fff" />
                                <Text style={s.trendingMetaText}>{plays}</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const s = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    seeAll: {
        fontSize: 13,
        fontWeight: '600',
    },
    trendingCard: {
        width: 160,
        height: 220,
        marginRight: 16,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    trendingCardBackground: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    trendingCardGradient: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 12,
    },
    trendingCategoryPill: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 'auto',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(10px)', // Web support
    },
    trendingCategory: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
        textTransform: 'uppercase',
    },
    trendingCardContent: {
        marginTop: 8,
    },
    trendingTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.white,
        lineHeight: 20,
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    trendingSpeaker: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 8,
    },
    trendingFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    trendingMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendingMetaText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
});
