import React, { useMemo, useState } from 'react';
import { Image, Linking, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../context/StoreContext';
import { books, photos, youtube } from '../data/church';
import { getServiceStatus } from '../services/schedule';
import { Body, Button, Caption, Chip, Display, Eyebrow, H2, PressScale, Screen, SectionHeader, Small } from '../components/ui';
import { SermonCard, SermonHero, SermonRow } from '../components/blocks';
import { colors, fonts, radius } from '../theme';

const FILTERS = ['All', 'Sunday Service', 'Midweek', 'Prayer', 'Message', 'Special'];

export default function WatchScreen({ navigation }) {
  const { sermons, sermonsLoading, refreshSermons } = useStore();
  const [filter, setFilter] = useState('All');
  const { live, next } = getServiceStatus();
  const list = useMemo(() => (filter === 'All' ? sermons : sermons.filter((s) => s.kind === filter)), [sermons, filter]);
  const series = useMemo(() => sermons.filter((s) => /trail\s?blazer/i.test(s.title)), [sermons]);
  const open = (s) => navigation.navigate('Sermon', { sermon: s });

  return (
    <Screen refreshControl={<RefreshControl refreshing={sermonsLoading} onRefresh={refreshSermons} tintColor={colors.gold} />}>
      <View style={{ marginTop: 14 }}>
        <Eyebrow>Watch & listen</Eyebrow>
        <Display style={{ marginTop: 6 }}>Messages</Display>
      </View>

      {/* Live banner */}
      <PressScale onPress={() => Linking.openURL(youtube.liveUrl)} style={styles.live}>
        <Image source={photos.preaching} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <LinearGradient colors={['rgba(6,6,7,0.92)', 'rgba(6,6,7,0.35)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        <View style={{ padding: 18, flex: 1, justifyContent: 'center' }}>
          {live ? (
            <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE NOW</Text></View>
          ) : (
            <Text style={styles.liveSoon}>LIVESTREAM</Text>
          )}
          <H2 style={{ marginTop: 8, maxWidth: 220 }}>{live ? `${live.service.name} is live` : 'Join service online'}</H2>
          <Small style={{ marginTop: 4, maxWidth: 230 }}>
            {live ? 'Tap to watch on YouTube' : `Streams every Sunday 10 AM & Wednesday 6:30 PM`}
          </Small>
        </View>
        <View style={styles.liveBtn}><Ionicons name={live ? 'play' : 'logo-youtube'} size={20} color="#141008" /></View>
      </PressScale>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginTop: 22 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {FILTERS.map((f) => <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />)}
      </ScrollView>

      {filter === 'All' ? (
        <>
          <View style={{ marginTop: 20 }}>
            <SermonHero sermon={sermons[0]} onPress={() => open(sermons[0])} />
          </View>

          {series.length ? (
            <>
              <SectionHeader eyebrow="Series" title="TrailBlazers" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
                {series.map((s) => <SermonCard key={s.id} sermon={s} onPress={() => open(s)} />)}
              </ScrollView>
            </>
          ) : null}

          <SectionHeader eyebrow="Archive" title="Recent messages" />
          {sermons.slice(1).map((s) => <SermonRow key={s.id} sermon={s} onPress={() => open(s)} />)}
        </>
      ) : (
        <View style={{ marginTop: 14 }}>
          {list.length ? list.map((s) => <SermonRow key={s.id} sermon={s} onPress={() => open(s)} />) : (
            <Body style={{ marginTop: 20, textAlign: 'center' }}>No {filter.toLowerCase()} recordings yet.</Body>
          )}
        </View>
      )}

      <SectionHeader eyebrow="Apostle Michael Dadzie" title="Books" action="Library" onAction={() => navigation.navigate('Library')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {books.map((b) => (
          <PressScale key={b.id} onPress={() => navigation.navigate('Library')} style={{ width: 120, marginRight: 14 }}>
            <Image source={b.cover} style={styles.book} resizeMode="cover" />
            <Caption numberOfLines={2} style={{ marginTop: 8, color: colors.textSecondary }}>{b.title}</Caption>
          </PressScale>
        ))}
      </ScrollView>

      <Button title="Open YouTube channel" variant="secondary" icon="logo-youtube" onPress={() => Linking.openURL(youtube.channelUrl)} style={{ marginTop: 30 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  live: { height: 150, marginTop: 20, borderRadius: radius.xl, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  livePill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.live, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginRight: 6 },
  liveText: { fontFamily: fonts.heading, fontSize: 10, letterSpacing: 1.5, color: '#fff' },
  liveSoon: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 2, color: colors.gold },
  liveBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', marginRight: 18 },
  book: { width: 120, height: 160, borderRadius: 12, backgroundColor: colors.surface2 },
});
