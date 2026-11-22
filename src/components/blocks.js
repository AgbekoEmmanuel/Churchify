import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Linking, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { church, photos, youtube, brand } from '../data/church';
import { countdownParts, formatDay, formatShortDate, formatTime, getServiceStatus, monthShort, dayNum } from '../services/schedule';
import { Body, Button, Caption, Eyebrow, H2, H3, PressScale, Small, Tag } from './ui';
import { colors, fonts, radius, space } from '../theme';

/* ---------- Live / next service ---------- */
export function ServiceCard({ onWatch }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const { live, next } = getServiceStatus(now);
  const c = next ? countdownParts(next.start, now) : null;

  return (
    <ImageBackground source={photos.congregationWide} style={styles.service} imageStyle={{ borderRadius: radius.xl, opacity: 0.38 }}>
      <LinearGradient colors={['rgba(6,6,7,0.2)', 'rgba(6,6,7,0.92)']} style={[StyleSheet.absoluteFill, { borderRadius: radius.xl }]} />
      {live ? (
        <>
          <View style={styles.liveRow}>
            <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE NOW</Text></View>
            <Caption style={{ color: colors.textSecondary, marginLeft: 10 }}>{church.venue}</Caption>
          </View>
          <H2 style={{ marginTop: 12, fontSize: 24 }}>{live.service.name} is on</H2>
          <Small style={{ marginTop: 4 }}>Join the family as we worship and receive the Word.</Small>
          <Button title="Watch live" icon="play" onPress={onWatch || (() => Linking.openURL(youtube.liveUrl))} style={{ marginTop: 18 }} size="md" />
        </>
      ) : next ? (
        <>
          <Eyebrow>Next gathering</Eyebrow>
          <H2 style={{ marginTop: 8, fontSize: 22 }}>{next.service.name}</H2>
          <Small style={{ marginTop: 4 }}>
            {formatDay(next.start)}, {formatShortDate(next.start)} · {formatTime(next.start)} · {church.venue}
          </Small>
          <View style={styles.countRow}>
            {[['days', c.days], ['hrs', c.hours], ['min', c.mins], ['sec', c.secs]].map(([l, v]) => (
              <View key={l} style={styles.countBox}>
                <Text style={styles.countNum}>{String(v).padStart(2, '0')}</Text>
                <Text style={styles.countLabel}>{l}</Text>
              </View>
            ))}
          </View>
          <PressScale onPress={() => Linking.openURL(church.mapsUrl)} style={styles.directions}>
            <Ionicons name="navigate-outline" size={14} color={colors.gold} />
            <Text style={styles.directionsText}>{church.address}</Text>
          </PressScale>
        </>
      ) : null}
    </ImageBackground>
  );
}

/* ---------- Year theme banner ---------- */
// Full 16:9 artwork shown whole (its own "VISIBILITY" lettering stays intact),
// with the caption underneath — a tall, near-square card.
export function YearThemeBanner({ onPress }) {
  const [w, setW] = useState(0);
  return (
    <PressScale onPress={onPress} style={styles.theme}>
      <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ width: '100%', height: w ? w * (2025 / 3600) : 190, backgroundColor: '#1A0E04' }}>
        {w ? <Image source={photos.yearTheme} style={{ width: w, height: w * (2025 / 3600) }} resizeMode="cover" /> : null}
        <LinearGradient colors={['rgba(18,12,6,0)', '#140C05']} locations={[0.7, 1]} style={StyleSheet.absoluteFill} />
      </View>
      <LinearGradient colors={['#140C05', '#0E0904']} style={styles.themeBody}>
        <Text style={styles.themeEyebrow}>{church.yearTheme.year} · Our year of</Text>
        <Text style={styles.themeTitle}>{church.yearTheme.title.toUpperCase()}</Text>
        <Text style={styles.themeSub}>{church.yearTheme.subtitle}</Text>
        <View style={styles.themeTag}>
          <Text style={styles.themeTagText}>{church.hashtag}</Text>
        </View>
      </LinearGradient>
    </PressScale>
  );
}

/* ---------- Sermons ---------- */
export function SermonHero({ sermon, onPress }) {
  if (!sermon) return null;
  return (
    <PressScale onPress={onPress} style={styles.sHero}>
      <Image source={{ uri: sermon.thumb }} style={styles.sHeroImg} resizeMode="cover" />
      <LinearGradient colors={['rgba(6,6,7,0)', 'rgba(6,6,7,0.95)']} style={StyleSheet.absoluteFill} />
      <View style={styles.playBig}><Ionicons name="play" size={24} color="#141008" style={{ marginLeft: 3 }} /></View>
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
        <Tag label={sermon.kind} />
        <H2 style={{ marginTop: 10 }} numberOfLines={2}>{sermon.title}</H2>
        <Caption style={{ marginTop: 4, color: colors.textSecondary }}>{sermon.speaker} · {formatShortDate(sermon.published)}</Caption>
      </View>
    </PressScale>
  );
}

export function SermonCard({ sermon, onPress, width = 240 }) {
  return (
    <PressScale onPress={onPress} style={{ width, marginRight: 14 }}>
      <View style={styles.sThumbWrap}>
        <Image source={{ uri: sermon.thumb }} style={styles.sThumb} resizeMode="cover" />
        <View style={styles.playSm}><Ionicons name="play" size={14} color={colors.text} style={{ marginLeft: 2 }} /></View>
        <View style={styles.kind}><Text style={styles.kindText}>{sermon.kind}</Text></View>
      </View>
      <H3 numberOfLines={2} style={{ marginTop: 10, fontSize: 15 }}>{sermon.title}</H3>
      <Caption style={{ marginTop: 3 }}>{formatShortDate(sermon.published)}</Caption>
    </PressScale>
  );
}

export function SermonRow({ sermon, onPress }) {
  return (
    <PressScale onPress={onPress} style={styles.sRow}>
      <View style={styles.sRowThumbWrap}>
        <Image source={{ uri: sermon.thumb }} style={styles.sRowThumb} resizeMode="cover" />
        <View style={styles.playXs}><Ionicons name="play" size={11} color={colors.text} style={{ marginLeft: 1 }} /></View>
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={styles.sRowKind}>{sermon.kind.toUpperCase()}{sermon.isFull ? ' · FULL SERVICE' : ''}</Text>
        <H3 numberOfLines={2} style={{ fontSize: 15, marginTop: 3 }}>{sermon.title}</H3>
        <Caption style={{ marginTop: 3 }}>{sermon.speaker} · {formatShortDate(sermon.published)}</Caption>
      </View>
    </PressScale>
  );
}

/* ---------- Events ---------- */
export function EventCard({ event, onPress, going }) {
  return (
    <PressScale onPress={onPress} style={styles.eCard}>
      <Image source={event.image} style={styles.eImg} resizeMode="cover" />
      <LinearGradient colors={['rgba(6,6,7,0)', 'rgba(6,6,7,0.88)', colors.bg]} locations={[0.3, 0.62, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.eDate}>
        <Text style={styles.eMonth}>{monthShort(event.date)}</Text>
        <Text style={styles.eDay}>{dayNum(event.date)}</Text>
      </View>
      {event.membersOnly ? <View style={styles.eLock}><Ionicons name="lock-closed" size={11} color={colors.gold} /><Text style={styles.eLockText}>Members</Text></View> : null}
      <View style={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
        <Caption style={{ color: colors.gold, fontFamily: fonts.label }}>{event.category}</Caption>
        <H3 numberOfLines={2} style={{ marginTop: 4 }}>{event.title}</H3>
        <Caption style={{ marginTop: 4, color: colors.textSecondary }}>
          {formatDay(event.date).slice(0, 3)} · {formatTime(event.date)}{going ? '  ·  ✓ Going' : ''}
        </Caption>
      </View>
    </PressScale>
  );
}

export function EventRow({ event, onPress, going }) {
  return (
    <PressScale onPress={onPress} style={styles.eRow}>
      <View style={styles.eRowDate}>
        <Text style={styles.eMonth}>{monthShort(event.date)}</Text>
        <Text style={[styles.eDay, { fontSize: 22 }]}>{dayNum(event.date)}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <H3 numberOfLines={1}>{event.title}</H3>
        <Caption style={{ marginTop: 3 }}>{formatTime(event.date)} · {event.venue}</Caption>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
          <Tag label={event.category} color={colors.textSecondary} />
          {going ? <Tag label="Going" color={colors.success} /> : null}
          {event.membersOnly ? <Tag label="Members" /> : null}
        </View>
      </View>
      <Image source={event.image} style={styles.eRowImg} />
    </PressScale>
  );
}

/* ---------- Guest lock ---------- */
export function MembersOnly({ title = 'For members only', body, onSignIn, onRequest, compact }) {
  return (
    <View style={[styles.lock, compact && { paddingVertical: 22 }]}>
      <Image source={brand.mark} style={styles.lockMark} resizeMode="contain" />
      <View style={styles.lockIcon}><Ionicons name="lock-closed" size={20} color={colors.gold} /></View>
      <H2 style={{ textAlign: 'center', marginTop: 16 }}>{title}</H2>
      <Body style={{ textAlign: 'center', marginTop: 8 }}>
        {body || 'Sign in with your member account to see what’s happening in the church family.'}
      </Body>
      <Button title="Member sign in" icon="lock-open-outline" onPress={onSignIn} style={{ marginTop: 22, alignSelf: 'stretch' }} />
      {onRequest ? <Button title="Request access" variant="ghost" onPress={onRequest} style={{ marginTop: 10, alignSelf: 'stretch' }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  service: { borderRadius: radius.xl, padding: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  liveRow: { flexDirection: 'row', alignItems: 'center' },
  livePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.live, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff', marginRight: 6 },
  liveText: { fontFamily: fonts.heading, fontSize: 10, letterSpacing: 1.5, color: '#fff' },
  countRow: { flexDirection: 'row', gap: 8, marginTop: 18 },
  countBox: { flex: 1, paddingVertical: 12, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  countNum: { fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: -0.5 },
  countLabel: { fontFamily: fonts.label, fontSize: 9, letterSpacing: 1.5, color: colors.textMuted, textTransform: 'uppercase', marginTop: 2 },
  directions: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 6 },
  directionsText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textSecondary },

  theme: { borderRadius: radius.xl, overflow: 'hidden', backgroundColor: '#140C05', borderWidth: 1, borderColor: colors.goldLine },
  themeBody: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 20 },
  themeEyebrow: { fontFamily: fonts.label, fontSize: 11, letterSpacing: 2.4, color: colors.gold, textTransform: 'uppercase' },
  themeTitle: { fontFamily: fonts.display, fontSize: 34, letterSpacing: 1.5, color: '#FFF3DC', marginTop: 4 },
  themeSub: { fontFamily: fonts.bodyMedium, fontSize: 13, color: 'rgba(255,243,220,0.75)', marginTop: 4 },
  themeTag: { alignSelf: 'flex-start', marginTop: 14, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: colors.goldLine },
  themeTagText: { fontFamily: fonts.serifItalic, fontSize: 13, color: colors.goldBright },

  sHero: { height: 240, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  sHeroImg: { ...StyleSheet.absoluteFillObject },
  playBig: { position: 'absolute', top: 18, right: 18, width: 52, height: 52, borderRadius: 26, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  sThumbWrap: { aspectRatio: 16 / 9, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.surface2 },
  sThumb: { width: '100%', height: '100%' },
  playSm: { position: 'absolute', left: 10, bottom: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  kind: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  kindText: { fontFamily: fonts.label, fontSize: 9, letterSpacing: 0.8, color: colors.goldBright, textTransform: 'uppercase' },
  sRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  sRowThumbWrap: { width: 132, aspectRatio: 16 / 9, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surface2 },
  sRowThumb: { width: '100%', height: '100%' },
  playXs: { position: 'absolute', right: 6, bottom: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center' },
  sRowKind: { fontFamily: fonts.label, fontSize: 9, letterSpacing: 1.2, color: colors.gold },

  eCard: { width: 220, height: 280, borderRadius: radius.lg, overflow: 'hidden', marginRight: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  eImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  eDate: { position: 'absolute', top: 12, left: 12, width: 46, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(6,6,7,0.8)', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  eMonth: { fontFamily: fonts.label, fontSize: 9, letterSpacing: 1.5, color: colors.gold },
  eDay: { fontFamily: fonts.display, fontSize: 18, color: colors.text, marginTop: -1 },
  eLock: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(6,6,7,0.8)', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 4 },
  eLockText: { fontFamily: fonts.label, fontSize: 10, color: colors.gold },
  eRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  eRowDate: { width: 56, paddingVertical: 10, borderRadius: 14, backgroundColor: colors.surface2, alignItems: 'center' },
  eRowImg: { width: 54, height: 68, borderRadius: 10, marginLeft: 10 },

  lock: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 22, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  lockMark: { position: 'absolute', width: 260, height: 240, opacity: 0.04, tintColor: '#fff', top: -30, right: -70 },
  lockIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.goldLine, alignItems: 'center', justifyContent: 'center' },
});
