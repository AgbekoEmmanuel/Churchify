import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

// Assets
const HERO = 'https://i.pinimg.com/1200x/75/54/4b/75544b517162a147c9ca5fa04bf2cca7.jpg';
const WEEK1 = 'https://i.pinimg.com/736x/7d/17/0c/7d170c25fe51f9a35436212fc0a6a745.jpg';
const WEEK2 = 'https://i.pinimg.com/736x/ff/04/77/ff0477c658fba2626e49f1d91127a48f.jpg';
const WEEK3 = 'https://i.pinimg.com/1200x/70/58/42/705842b9f1eab293a0ccc2c976b1179b.jpg';
const PASTOR = 'https://i.pinimg.com/736x/38/39/65/3839657b36fbf81b16d774a3e9659db8.jpg';
const SERMON1 = 'https://i.pinimg.com/736x/41/af/d3/41afd317dc4a52053b6a330c9d74d31c.jpg';
const SERMON2 = 'https://i.pinimg.com/736x/4b/8b/38/4b8b383d220231cd4b739607efb45139.jpg';

export default function DevotionalReadingScreen({ navigation }) {
  const thisWeek = [
    { id: 'w1', when: 'Yesterday', title: 'Pattern for Obedience', author: 'by Sam Adeyemi', cover: WEEK1 },
    { id: 'w2', when: 'Yesterday', title: 'Pattern for Obedience', author: 'by Sam Adeyemi', cover: WEEK2 },
    { id: 'w3', when: 'Yesterday', title: 'Pattern for Obedience', author: 'by Sam Adeyemi', cover: WEEK3 },
  ];

  const latestSermons = [
    { id: 's1', title: 'Walking in the Spirit for Maximum output', views: '24K', duration: '45m', cover: SERMON1 },
    { id: 's2', title: 'Covenant Service that yields Growth', views: '18K', duration: '38m', cover: SERMON2 },
  ];

  const shareIt = async () => {
    try {
      await Share.share({
        message: `Conflict resolution at Workplace\nMatthew 18:15 - 20\n\n"If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over."`
      });
    } catch {}
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.hBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Devotional</Text>
        <TouchableOpacity style={s.hBtn} onPress={shareIt}>
          <Ionicons name="share-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Cover */}
        <Image source={{ uri: HERO }} style={s.hero} />

        {/* Date */}
        <Text style={s.date}>Monday, 20th April 2023</Text>

        {/* Title */}
        <Text style={s.title}>Conflict resolution at Workplace</Text>

        {/* Scripture ref */}
        <View style={s.refRow}>
          <Ionicons name="book-outline" size={16} color={colors.text} />
          <Text style={s.refText}>Matthew 18:15 - 20</Text>
        </View>

        {/* Highlighted quote */}
        <View style={s.quoteCard}>
          <Text style={s.quoteText}>
            "If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over."
          </Text>
          <Text style={s.quoteRef}>Matthew 18:15</Text>
        </View>

        {/* Listen button */}
        <TouchableOpacity style={s.listenBtn} activeOpacity={0.9}>
          <Ionicons name="play-circle-outline" size={20} color="#fff" />
          <Text style={s.listenText}>Listen to devotion</Text>
        </TouchableOpacity>

        {/* Body text */}
        <View style={s.bodyWrap}>
          <Text style={s.paragraph}>
            When Jesus was born, there was a bright light at night (Luke 2:8-14). When Jesus died, there was darkness at noon. Even the sun hid its face from the terrible suffering of the Son of God. Jesus' suffering was not only physical but, more deeply, spiritual.
          </Text>
          
          <Text style={s.paragraph}>
            Even though his pain was indescribable, from the flogging and torture he endured to the excruciating agony of crucifixion, Jesus' greatest suffering was that he was separated from the Father and subjected to the torments of hell.
          </Text>
          
          <Text style={s.paragraph}>
            Jesus became a curse for us. Our transgressions lay fully on him. The ugliness of our sin covered him with shame and pain. The crushing weight of our iniquities was cast on him. Because he was made to be sin for us (2 Corinthians 5:21), the law demanded his death, for the wages of sin is death (Romans 6:23).
          </Text>
        </View>

        {/* Repeated quote */}
        <View style={s.quoteCard}>
          <Text style={s.quoteText}>
            "If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over."
          </Text>
          <Text style={s.quoteRef}>Matthew 18:15</Text>
        </View>

        {/* Author section */}
        <View style={s.authorWrap}>
          <Image source={{ uri: PASTOR }} style={s.authorImg} />
          <View style={{ flex: 1 }}>
            <Text style={s.authorTitle}>Author</Text>
            <Text style={s.authorName}>Pst. Nelson</Text>
            <Text style={s.authorRole}>Senior Branch pastor</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={s.actionsRow}>
          <TouchableOpacity style={s.actionBtn} activeOpacity={0.9}>
            <LinearGradient colors={['#E8F0F7', '#E8F0F7']} style={s.actionGrad}>
              <Ionicons name="bookmark-outline" size={18} color={colors.primary} />
              <Text style={s.actionText}>Save for later</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={s.actionBtn} activeOpacity={0.9} onPress={shareIt}>
            <LinearGradient colors={['#E8F0F7', '#E8F0F7']} style={s.actionGrad}>
              <Ionicons name="share-social-outline" size={18} color={colors.primary} />
              <Text style={s.actionText}>Share Devotion</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* From This week */}
        <Text style={s.sectionTitle}>From This week</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.weekRow}>
          {thisWeek.map(w => (
            <TouchableOpacity key={w.id} style={s.weekCard} activeOpacity={0.9}>
              <Image source={{ uri: w.cover }} style={s.weekImg} />
              <View style={s.weekMeta}>
                <Text style={s.weekWhen}>{w.when}</Text>
                <Text style={s.weekTitle} numberOfLines={1}>{w.title}</Text>
                <Text style={s.weekAuthor} numberOfLines={1}>{w.author}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Latest Sermons */}
        <Text style={[s.sectionTitle, { marginTop: 8 }]}>Latest Sermons</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.sermonsRow}>
          {latestSermons.map(sermon => (
            <TouchableOpacity key={sermon.id} style={s.sermonCard} activeOpacity={0.9}>
              <View style={s.sermonImageWrap}>
                <Image source={{ uri: sermon.cover }} style={s.sermonImg} />
                <View style={s.playIcon}>
                  <Ionicons name="play" size={16} color="#fff" />
                </View>
              </View>
              <View style={s.sermonMeta}>
                <Text style={s.sermonTitle} numberOfLines={2}>{sermon.title}</Text>
                <View style={s.sermonStats}>
                  <Text style={s.sermonViews}>👁 {sermon.views}</Text>
                  <Text style={s.sermonDuration}>⏱ {sermon.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  hBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.cardSecondary || '#F5F9FC',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },

  hero: { width: '100%', height: 200, backgroundColor: colors.accent },

  date: {
    marginTop: 16,
    marginHorizontal: 20,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  title: {
    marginTop: 8,
    marginHorizontal: 20,
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },

  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
  },
  refText: { color: colors.text, fontWeight: '700', fontSize: 15 },

  quoteCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  quoteText: { color: colors.text, fontSize: 16, lineHeight: 24, fontStyle: 'italic' },
  quoteRef: { marginTop: 12, color: colors.text, fontWeight: '900', fontSize: 15 },

  listenBtn: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#2D3748',
    borderRadius: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  listenText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  bodyWrap: { marginTop: 20, paddingHorizontal: 20, gap: 16 },
  paragraph: { color: colors.textSecondary, lineHeight: 24, fontSize: 16 },

  authorWrap: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  authorImg: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.accent },
  authorTitle: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  authorName: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 2 },
  authorRole: { color: colors.textSecondary, fontSize: 13, marginTop: 1 },

  actionsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 16 },
  actionBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  actionGrad: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  actionText: { color: colors.primary, fontWeight: '800', fontSize: 15 },

  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  weekRow: { paddingHorizontal: 20, gap: 12 },
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
  weekImg: { width: '100%', height: 110 },
  weekMeta: { padding: 12 },
  weekWhen: { fontSize: 12, color: colors.textMuted, marginBottom: 3 },
  weekTitle: { fontWeight: '800', color: colors.text, fontSize: 13, marginBottom: 3 },
  weekAuthor: { fontSize: 12, color: colors.textSecondary },

  sermonsRow: { paddingHorizontal: 20, gap: 16 },
  sermonCard: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sermonImageWrap: { position: 'relative' },
  sermonImg: { width: '100%', height: 130 },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sermonMeta: { padding: 14 },
  sermonTitle: { fontWeight: '800', color: colors.text, fontSize: 14, lineHeight: 20 },
  sermonStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  sermonViews: { fontSize: 12, color: colors.textMuted },
  sermonDuration: { fontSize: 12, color: colors.textMuted },
});
