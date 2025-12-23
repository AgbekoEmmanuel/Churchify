import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const VideoCard = ({ video, onPress }) => {

    return (
        <TouchableOpacity
            style={[styles.videoCard, {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
                borderColor: colors.borderLight
            }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.videoImageContainer}>
                <Image source={{ uri: video.image }} style={styles.videoCover} />

                {video.isLive && (
                    <View style={styles.liveBadge}>
                        <Text style={styles.liveBadgeText}>LIVE</Text>
                    </View>
                )}

                <View style={styles.playButton}>
                    <Ionicons name="play" size={24} color="#fff" />
                </View>

                <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{video.duration}</Text>
                </View>
            </View>

            <View style={styles.videoInfo}>
                <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>{video.title}</Text>
                <Text style={[styles.videoSpeaker, { color: colors.textSecondary }]} numberOfLines={1}>{video.speaker}</Text>

                <View style={styles.videoMeta}>
                    <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.viewsText, { color: colors.textSecondary }]}>{video.views} views</Text>
                    <Text style={[styles.categoryText, { color: colors.textSecondary }]}>• {video.category}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    videoCard: {
        width: 260, // Slightly wider
        marginRight: 16,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
    },
    videoImageContainer: {
        position: 'relative',
        height: 150, // Fixed height for cover
    },
    videoCover: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    liveBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF4444',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    liveBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -24 }, { translateY: -24 }],
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    durationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    videoInfo: {
        padding: 16,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 6,
        lineHeight: 22,
    },
    videoSpeaker: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    videoMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewsText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginLeft: 6,
    },
    categoryText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginLeft: 4,
    },
});

export default VideoCard;
