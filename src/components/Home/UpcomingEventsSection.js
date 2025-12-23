import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function UpcomingEventsSection() {
    const EVENTS = [
        {
            id: "1",
            title: "Youth Conference",
            date: "Sun, 25 Aug • 9:00 AM",
            color: colors.primary,
            image: "https://i.pinimg.com/1200x/0d/cd/1f/0dcd1fa0df2b52f2d956d7310ffa7548.jpg"
        },
        {
            id: "2",
            title: "Prayer Night",
            date: "Wed, 28 Aug • 7:00 PM",
            color: colors.secondary,
            image: "https://i.pinimg.com/736x/e8/d3/94/e8d3948ffe66a99df6ebb89a9ebc7a93.jpg"
        },
        {
            id: "3",
            title: "Bible Study",
            date: "Mon, 02 Sep • 6:30 PM",
            color: colors.complementary,
            image: "https://i.pinimg.com/1200x/fb/7f/c4/fb7fc49d266b14f186202eba81cc9360.jpg"
        },
    ];

    return (
        <View style={s.container}>
            <View style={s.sectionHeader}>
                <Text style={[s.sectionTitle, { color: colors.text }]}>Upcoming Events</Text>
                <TouchableOpacity onPress={() => console.log('See all events')}>
                    <Text style={[s.seeAll, { color: colors.primary }]}>See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 8 }}
            >
                {EVENTS.map((e) => (
                    <EventCard
                        key={e.id}
                        title={e.title}
                        date={e.date}
                        bgColor={e.color}
                        image={e.image}
                        colors={colors}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

function EventCard({ title, date, bgColor, image }) {
    return (
        <TouchableOpacity style={[s.eventCard, { backgroundColor: colors.card, shadowColor: colors.shadowStrong }]} activeOpacity={0.9}>
            <ImageBackground
                source={{ uri: image }}
                style={s.eventCardBackground}
                imageStyle={{ borderRadius: 20 }}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={s.eventCardGradient}
                >
                    <View style={s.eventDatePill}>
                        <Text style={[s.eventDate, { color: colors.primary }]}>{date.split('•')[0].trim()}</Text>
                    </View>

                    <View style={s.eventCardContent}>
                        <Text style={s.eventTitle} numberOfLines={2}>
                            {title}
                        </Text>
                        <View style={s.eventFooter}>
                            <View style={s.eventPlacePill}>
                                <Ionicons name="time-outline" size={12} color="#fff" />
                                <Text style={s.eventPlace}>{date.split('•')[1] || 'Main Hall'}</Text>
                            </View>
                            <View style={[s.actionBtn, { backgroundColor: colors.primary }]}>
                                <Ionicons name="arrow-forward" size={12} color="#fff" />
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
    eventCard: {
        width: 200,
        height: 260,
        marginRight: 16,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    eventCardBackground: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    eventCardGradient: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16,
    },
    eventDatePill: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    eventDate: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    eventCardContent: {
        gap: 8,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 24,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    eventFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    eventPlacePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    eventPlace: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    actionBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    }
});
