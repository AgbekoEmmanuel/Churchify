import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { brand, church, getFellowship } from '../data/church';
import { announcements, dailyWords, events } from '../data/content';
import { greeting, timeAgo } from '../services/schedule';
import {
  Avatar, Caption, Card, Display, Eyebrow, H3, IconButton, PressScale, Screen, Scripture, SectionHeader, Small,
} from '../components/ui';
import { EventCard, MembersOnly, SermonHero, ServiceCard, YearThemeBanner } from '../components/blocks';
import { BusinessHealthTiles } from './NewsScreens';
import { colors, fonts, radius, rs } from '../theme';

export default function HomeScreen({ navigation }) {
  const { member, isMember } = useAuth();
  const { sermons, rsvps } = useStore();
  const word = useMemo(() => dailyWords[new Date().getUTCDate() % dailyWords.length], []);
  const fellowship = member ? getFellowship(member.fellowshipId) : null;
  const latest = sermons[0];
  const upcoming = events.filter((e) => isMember || !e.membersOnly).slice(0, 5);
  const go = (route, params) => navigation.navigate(route, params);

  const actions = isMember
    ? [
        { icon: 'qr-code-outline', label: 'Check in', route: 'CheckIn' },
        { icon: 'wallet-outline', label: 'Give', tab: 'Give' },
        { icon: 'flame-outline', label: 'Prayer', route: 'Prayer' },
        { icon: 'create-outline', label: 'Notes', route: 'Notes' },
      ]
    : [
        { icon: 'play-circle-outline', label: 'Watch', tab: 'Watch' },
        { icon: 'wallet-outline', label: 'Give', tab: 'Give' },
        { icon: 'location-outline', label: 'Visit', route: 'About', params: { section: 'visit' } },
        { icon: 'book-outline', label: 'Books', route: 'Library' },
      ];

  return (
    <Screen>
      {/* Top bar */}
      <View style={styles.top}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={brand.mark} style={styles.mark} resizeMode="contain" />
          <Image source={brand.wordmark} style={styles.word} resizeMode="contain" />
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {isMember ? (
            <>
              <IconButton icon="notifications-outline" badge onPress={() => go('Announcements')} />
              <Pressable onPress={() => navigation.navigate('Me')}>
                <Avatar name={`${member.firstName} ${member.lastName}`} size={40} />
              </Pressable>
            </>
          ) : (
            <PressScale onPress={() => go('SignIn')} style={styles.signInPill}>
              <Ionicons name="lock-closed" size={13} color="#141008" />
              <Text style={styles.signInText}>Sign in</Text>
            </PressScale>
          )}
        </View>
      </View>

      {/* Greeting */}
      <View style={{ marginTop: 26, marginBottom: 20 }}>
        <Caption style={{ fontSize: 13 }}>{greeting()}{isMember ? ',' : ''}</Caption>
        <Display style={{ marginTop: 4 }}>{isMember ? member.firstName : 'Welcome home.'}</Display>
        {fellowship ? (
          <Pressable onPress={() => navigation.navigate('Fellowship')} style={styles.fellowPill}>
            <View style={[styles.fellowDot, { backgroundColor: fellowship.accent }]} />
            <Text style={styles.fellowText}>{fellowship.name} Fellowship</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
          </Pressable>
        ) : (
          <Small style={{ marginTop: 6 }}>You’re browsing as a guest. Sermons and giving are open to everyone.</Small>
        )}
      </View>

      <ServiceCard />

      {/* Quick actions */}
      <View style={styles.actions}>
        {actions.map((a) => (
          <PressScale key={a.label} onPress={() => (a.tab ? navigation.navigate(a.tab) : go(a.route, a.params))} style={styles.action}>
            <View style={styles.actionIcon}><Ionicons name={a.icon} size={22} color={colors.gold} /></View>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </PressScale>
        ))}
      </View>

      {/* Word for today */}
      <Card style={styles.word2}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Eyebrow>Word for today</Eyebrow>
          <Pressable hitSlop={10} onPress={() => Share.share({ message: `“${word.text}” — ${word.ref}\n\n${church.name} ${church.hashtag}` })}>
            <Ionicons name="share-outline" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
        <Scripture style={{ marginTop: 14 }}>“{word.text}”</Scripture>
        <Text style={styles.ref}>— {word.ref}</Text>
      </Card>

      {/* Latest message */}
      <SectionHeader eyebrow="Latest message" title="From the pulpit" action="All" onAction={() => navigation.navigate('Watch')} />
      <SermonHero sermon={latest} onPress={() => go('Sermon', { sermon: latest })} />

      {/* Business & Health — the Sunday segments */}
      <SectionHeader eyebrow="Every Sunday" title="Business & Health" action="Open" onAction={() => go('News')} />
      <BusinessHealthTiles onOpen={(tab) => go('News', { tab })} />

      {/* Announcements */}
      <SectionHeader eyebrow="Church family" title="Announcements" action={isMember ? 'See all' : undefined} onAction={() => go('Announcements')} />
      {isMember ? (
        announcements.slice(0, 2).map((a) => (
          <Card key={a.id} onPress={() => go('Announcements')} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              {a.pinned ? <Ionicons name="pin" size={12} color={colors.gold} style={{ marginRight: 6 }} /> : null}
              <Caption style={{ color: colors.gold, fontFamily: fonts.label }}>{a.audience}</Caption>
              <Caption style={{ marginLeft: 'auto' }}>{timeAgo(a.date)}</Caption>
            </View>
            <H3>{a.title}</H3>
            <Small numberOfLines={2} style={{ marginTop: 4 }}>{a.body}</Small>
          </Card>
        ))
      ) : (
        <MembersOnly
          compact
          title="Inside the family"
          body="Announcements, fellowship updates, check-in and your membership card are for members."
          onSignIn={() => go('SignIn')}
          onRequest={() => go('RequestAccess')}
        />
      )}

      {/* Events */}
      <SectionHeader eyebrow="What’s coming" title="Upcoming events" action="Calendar" onAction={() => go('Events')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {upcoming.map((e) => <EventCard key={e.id} event={e} going={rsvps.includes(e.id)} onPress={() => go('Event', { event: e })} />)}
      </ScrollView>

      <View style={{ marginTop: 30 }}>
        <YearThemeBanner onPress={() => go('About')} />
      </View>

      <View style={styles.footer}>
        <Image source={brand.mark} style={{ width: 26, height: 24, tintColor: colors.textFaint }} resizeMode="contain" />
        <Text style={styles.footerText}>{church.hashtag}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  mark: { width: 30, height: 28, tintColor: colors.white },
  word: { width: 112, height: 112 * (119 / 602), marginLeft: 10 },
  signInPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.gold, paddingHorizontal: 14, height: 36, borderRadius: radius.pill },
  signInText: { fontFamily: fonts.label, fontSize: 13, color: '#141008' },
  fellowPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, gap: 6 },
  fellowDot: { width: 8, height: 8, borderRadius: 4 },
  fellowText: { fontFamily: fonts.label, fontSize: 12, color: colors.textSecondary },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  action: { flex: 1, alignItems: 'center' },
  actionIcon: { width: rs(60), height: rs(60), borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: fonts.label, fontSize: 12, color: colors.textSecondary, marginTop: 8 },
  word2: { marginTop: 22, padding: 20, backgroundColor: colors.bgRaised, borderColor: colors.goldLine },
  ref: { fontFamily: fonts.label, fontSize: 12, color: colors.gold, marginTop: 12, letterSpacing: 0.5 },
  footer: { alignItems: 'center', marginTop: 40, gap: 8 },
  footerText: { fontFamily: fonts.serifItalic, fontSize: 14, color: colors.textFaint },
});
