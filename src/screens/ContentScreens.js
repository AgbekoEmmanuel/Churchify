import React, { useState } from 'react';
import { Image, Linking, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { books, church } from '../data/church';
import { announcements, events } from '../data/content';
import { formatLongDate, formatTime, timeAgo } from '../services/schedule';
import { BackFab, Body, Button, Caption, Card, Chip, Eyebrow, H1, H3, Header, IconButton, Screen, Small, Tag } from '../components/ui';
import { EventRow, MembersOnly } from '../components/blocks';
import { colors, fonts, radius } from '../theme';

/* ---------------- Events ---------------- */
export function EventsScreen({ navigation }) {
  const { isMember } = useAuth();
  const { rsvps } = useStore();
  const [filter, setFilter] = useState('All');
  const visible = events.filter((e) => isMember || !e.membersOnly);
  const cats = ['All', ...Array.from(new Set(visible.map((e) => e.category)))];
  const list = filter === 'All' ? visible : filter === 'Going' ? visible.filter((e) => rsvps.includes(e.id)) : visible.filter((e) => e.category === filter);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} title="Events" />
      <Screen edges={[]} contentStyle={{ paddingTop: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginBottom: 16 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {(isMember ? [...cats, 'Going'] : cats).map((c) => <Chip key={c} label={c} active={filter === c} onPress={() => setFilter(c)} />)}
        </ScrollView>
        {list.map((e) => <EventRow key={e.id} event={e} going={rsvps.includes(e.id)} onPress={() => navigation.navigate('Event', { event: e })} />)}
        {!isMember ? (
          <Card style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('SignIn')}>
            <Ionicons name="lock-closed" size={18} color={colors.gold} />
            <Small style={{ flex: 1, marginLeft: 12 }}>Some programs are for members only. Sign in to see the full calendar.</Small>
          </Card>
        ) : null}
      </Screen>
    </View>
  );
}

export function EventScreen({ route, navigation }) {
  const { event } = route.params;
  const { isMember } = useAuth();
  const { rsvps, toggleRsvp } = useStore();
  const going = rsvps.includes(event.id);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Screen padded={false} edges={[]}>
        <View style={{ height: 460, backgroundColor: '#000', overflow: 'hidden' }}>
          <Image source={event.image} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <LinearGradient colors={['rgba(6,6,7,0.4)', 'rgba(6,6,7,0)', colors.bg]} locations={[0, 0.3, 1]} style={StyleSheet.absoluteFill} />
          <BackFab onPress={() => navigation.goBack()} />
          <BackFab onPress={() => Share.share({ message: `${event.title} — ${formatLongDate(event.date)}, ${formatTime(event.date)} at ${event.venue}. ${church.name}` })} icon="share-outline" right />
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Tag label={event.category} />
            {event.membersOnly ? <Tag label="Members only" color={colors.textSecondary} /> : null}
          </View>
          <H1 style={{ marginTop: 12 }}>{event.title}</H1>
          <View style={styles.meta}>
            <Ionicons name="calendar-outline" size={18} color={colors.gold} />
            <View style={{ marginLeft: 12 }}>
              <H3 style={{ fontSize: 15 }}>{formatLongDate(event.date)}</H3>
              <Caption style={{ marginTop: 2 }}>{formatTime(event.date)} GMT</Caption>
            </View>
          </View>
          <View style={styles.meta}>
            <Ionicons name="location-outline" size={18} color={colors.gold} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <H3 style={{ fontSize: 15 }}>{event.venue}</H3>
              <Caption style={{ marginTop: 2 }}>{event.venue === church.venue ? church.address : 'Accra'}</Caption>
            </View>
          </View>
          <Body style={{ marginTop: 18 }}>{event.description}</Body>
          {isMember ? (
            <Button
              title={going ? 'You’re going ✓' : 'I’ll be there'}
              variant={going ? 'secondary' : 'primary'}
              onPress={() => toggleRsvp(event.id)}
              style={{ marginTop: 24 }}
            />
          ) : null}
          <Button title="Directions" icon="navigate-outline" variant="ghost" onPress={() => Linking.openURL(church.mapsUrl)} style={{ marginTop: 10 }} />
        </View>
      </Screen>
    </View>
  );
}

/* ---------------- Announcements ---------------- */
export function AnnouncementsScreen({ navigation }) {
  const { isMember } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} title="Announcements" />
      <Screen edges={[]} contentStyle={{ paddingTop: 16 }}>
        {isMember ? announcements.map((a) => (
          <Card key={a.id} style={[{ marginBottom: 12 }, a.pinned && { borderColor: colors.goldLine }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {a.pinned ? <Ionicons name="pin" size={13} color={colors.gold} style={{ marginRight: 6 }} /> : null}
              <Caption style={{ color: colors.gold, fontFamily: fonts.label, flex: 1 }}>{a.audience}</Caption>
              <Caption>{timeAgo(a.date)}</Caption>
            </View>
            <H3 style={{ marginTop: 8 }}>{a.title}</H3>
            <Small style={{ marginTop: 6, lineHeight: 20 }}>{a.body}</Small>
          </Card>
        )) : (
          <MembersOnly onSignIn={() => navigation.navigate('SignIn')} onRequest={() => navigation.navigate('RequestAccess')} />
        )}
      </Screen>
    </View>
  );
}

/* ---------------- Library ---------------- */
export function LibraryScreen({ navigation }) {
  const [featured, ...rest] = books;
  const ask = (b) => Linking.openURL(`${church.whatsapp}?text=${encodeURIComponent(`Hello, I’d like to get a copy of “${b.title}” by Apostle Michael Dadzie.`)}`);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} title="Library" />
      <Screen edges={[]} contentStyle={{ paddingTop: 20 }}>
        <Eyebrow>Books by Apostle Michael Dadzie</Eyebrow>
        <H1 style={{ marginTop: 6 }}>Wisdom for the shelf</H1>
        <View style={styles.featured}>
          <Image source={featured.cover} style={styles.featuredImg} resizeMode="cover" />
          <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
            <Tag label="Featured" />
            <H3 style={{ marginTop: 10, fontSize: 18 }}>{featured.title}</H3>
            <Button title="Get a copy" size="sm" onPress={() => ask(featured)} style={{ marginTop: 14, alignSelf: 'flex-start', paddingHorizontal: 16 }} />
          </View>
        </View>
        <Text style={styles.moreLabel}>MORE TITLES</Text>
        {rest.map((b) => (
          <View key={b.id} style={styles.bookRow}>
            <Image source={b.cover} style={styles.bookImg} resizeMode="cover" />
            <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
              <Caption style={{ color: colors.textMuted }}>Apostle Michael Dadzie</Caption>
              <H3 numberOfLines={2} style={{ marginTop: 4, fontSize: 16 }}>{b.title}</H3>
              <Button title="Get a copy" size="sm" variant="secondary" onPress={() => ask(b)} style={{ marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 16 }} />
            </View>
          </View>
        ))}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 16, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  featured: { flexDirection: 'row', marginTop: 20, padding: 14, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.goldLine },
  featuredImg: { width: 120, height: 170, borderRadius: 12 },
  moreLabel: { fontFamily: fonts.label, fontSize: 11, letterSpacing: 2, color: colors.gold, marginTop: 28, marginBottom: 12 },
  bookRow: { flexDirection: 'row', padding: 12, marginBottom: 12, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  bookImg: { width: 84, height: 118, borderRadius: 10, backgroundColor: colors.surface2 },
});
