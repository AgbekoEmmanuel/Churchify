import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

// Assets
const HERO = 'https://i.pinimg.com/1200x/75/54/4b/75544b517162a147c9ca5fa04bf2cca7.jpg';
const WEEK1 = 'https://i.pinimg.com/736x/7d/17/0c/7d170c25fe51f9a35436212fc0a6a745.jpg';
const WEEK2 = 'https://i.pinimg.com/736x/ff/04/77/ff0477c658fba2626e49f1d91127a48f.jpg';
const WEEK3 = 'https://i.pinimg.com/1200x/70/58/42/705842b9f1eab293a0ccc2c976b1179b.jpg';
const TOPIC_FAITH = 'https://i.pinimg.com/736x/7d/17/0c/7d170c25fe51f9a35436212fc0a6a745.jpg';
const TOPIC_FRUITFULNESS = 'https://i.pinimg.com/1200x/70/58/42/705842b9f1eab293a0ccc2c976b1179b.jpg';
const TOPIC_BAPTISM = 'https://i.pinimg.com/1200x/59/62/e6/5962e649698e0f57c698c4a14746edb6.jpg';

export default function DevotionalHomeScreen({ route, navigation }) {
  const item = route?.params?.item || {
    date: new Date().toISOString(),
  };

  // Toggle hero video
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  // Replace with your direct MP4/HLS URL when available
  const VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const dateLabel = useMemo(() => {
    const d = new Date(item.date);
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, [item.date]);

  const thisWeek = [
    { id: 'w1', when: 'Yesterday', title: 'Pattern for Obedience', author: 'by Sam Adeyemi', cover: WEEK1 },
    { id: 'w2', when: 'Yesterday', title: 'Pattern for Obedience', author: 'by Sam Adeyemi', cover: WEEK2 },
    { id: 'w3', when: 'Yesterday', title: 'Pattern for Obedience', author: 'by Sam Adeyemi', cover: WEEK3 },
  ];

  const topics = [
    { id: 't1', label: 'Faith', image: TOPIC_FAITH },
    { id: 't2', label: 'Fruitfulness', image: TOPIC_FRUITFULNESS },
    { id: 't3', label: 'Baptism', image: TOPIC_BAPTISM },
  ];

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Devotional</Text>
        <View style={s.headerBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Hero with ribbon (image or video) */}
        <View style={s.heroWrap}>
          {!showVideo ? (
            <>
              <Image source={{ uri: HERO }} style={s.hero} />

              {/* Centered play icon */}
              <TouchableOpacity
                style={s.playCenter}
                activeOpacity={0.9}
                onPress={() => setShowVideo(true)}
              >
                <View style={s.playBg}>
                  <Ionicons name="play" size={26} color="#fff" />
                </View>
              </TouchableOpacity>

              {/* Ribbon */}
              <LinearGradient
                colors={['#9C27B0', '#E91E63']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.ribbon}
              >
                <Text style={s.ribbonDate}>{dateLabel}</Text>
                <Text style={s.ribbonText}>Watch today's Devotion</Text>
              </LinearGradient>
            </>
          ) : (
            <View style={s.videoWrap}>
              <Video
                ref={videoRef}
                source={{ uri: VIDEO_URL }}
                style={s.video}
                resizeMode="contain"
                shouldPlay
                useNativeControls
              />
              <TouchableOpacity
                style={s.closeVideo}
                onPress={async () => {
                  try {
                    await videoRef.current?.pauseAsync();
                  } catch {}
                  setShowVideo(false);
                }}
              >
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Main devotional card - clickable */}
        <TouchableOpacity
          style={s.mainCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('DevotionalReading')}
        >
          <Text style={s.mainTitle}>Conflict resolution at Workplace</Text>
          <View style={s.refRow}>
            <Ionicons name="book-outline" size={16} color={colors.text} />
            <Text style={s.refText}>Matthew 18:15 - 20</Text>
          </View>
        </TouchableOpacity>

        {/* This week */}
        <Text style={s.sectionTitle}>This week</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.weekRow}
        >
          {thisWeek.map(w => (
            <TouchableOpacity key={w.id} style={s.weekCard} activeOpacity={0.9}>
              <Image source={{ uri: w.cover }} style={s.weekImage} />
              <View style={s.weekMeta}>
                <Text style={s.weekWhen}>{w.when}</Text>
                <Text style={s.weekTitle} numberOfLines={1}>{w.title}</Text>
                <Text style={s.weekAuthor} numberOfLines={1}>{w.author}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Topics */}
        <Text style={[s.sectionTitle, { marginTop: 8 }]}>Topics</Text>
        <View style={s.topicsWrap}>
          {topics.map(t => (
            <TouchableOpacity key={t.id} style={s.topicCard} activeOpacity={0.9}>
              <Image source={{ uri: t.image }} style={s.topicImage} />
              <LinearGradient
                colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={s.topicOverlay}
              />
              <Text style={s.topicLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.seeAllBtn}>
          <Text style={s.seeAllText}>See all Topics</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.cardSecondary || '#F5F9FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },

  heroWrap: { margin: 16, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  hero: { width: width - 32, height: 200, borderRadius: 16 },

  // Play overlay
  playCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -28,
    marginLeft: -28,
  },
  playBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  // Ribbon
  ribbon: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  ribbonDate: { color: '#fff', fontSize: 13, fontWeight: '600' },
  ribbonText: { color: '#fff', fontSize: 14, fontWeight: '800', marginTop: 2 },

  // Video container
  videoWrap: {
    width: width - 32,
    height: 200,
    backgroundColor: 'black',
    borderRadius: 16,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  closeVideo: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainCard: {
    marginHorizontal: 16,
    backgroundColor: '#E9F3FF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D5E6FF',
    marginBottom: 4,
  },
  mainTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
  refRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  refText: { color: colors.text, fontWeight: '700', fontSize: 15 },

  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  weekRow: { paddingHorizontal: 16, gap: 12 },
  weekCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  weekImage: { width: '100%', height: 120 },
  weekMeta: { padding: 12 },
  weekWhen: { fontSize: 12, color: colors.textMuted, marginBottom: 3 },
  weekTitle: { fontWeight: '800', color: colors.text, fontSize: 14, marginBottom: 3 },
  weekAuthor: { fontSize: 12, color: colors.textSecondary },

  topicsWrap: { paddingHorizontal: 16, gap: 12 },
  topicCard: {
    height: 130,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  topicImage: { width: '100%', height: '100%' },
  topicOverlay: { ...StyleSheet.absoluteFillObject },
  topicLabel: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  seeAllBtn: { alignItems: 'center', paddingVertical: 16, marginTop: 8 },
  seeAllText: { color: colors.textMuted, fontWeight: '700', fontSize: 15 },
});
