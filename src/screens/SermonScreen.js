import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../context/AudioContext';
import { church, youtube } from '../data/church';
import { countdownParts, formatLongDate, getServiceStatus } from '../services/schedule';
import YouTubePlayer from '../components/YouTubePlayer';
import { Body, Button, Caption, Eyebrow, Field, H1, H2, Header, IconButton, PressScale, Screen, SectionHeader, Small, Tag } from '../components/ui';
import { SermonRow } from '../components/blocks';
import { colors, fonts, radius } from '../theme';

export default function SermonScreen({ route, navigation }) {
  const { sermon } = route.params;
  const { isMember } = useAuth();
  const { sermons, notes, saveNote } = useStore();
  const existing = useMemo(() => notes.find((n) => n.sermonId === sermon.id), [notes, sermon.id]);
  const [draft, setDraft] = useState(existing ? existing.body : '');
  const [saved, setSaved] = useState(false);
  // Playback position from the in-app player, so "Watch on YouTube" resumes there.
  usePauseAudio();
  const pos = useRef(0);
  const onTime = useCallback((t) => { pos.current = t; }, []);
  const atTime = (url) => (pos.current > 5 ? `${url}&t=${Math.floor(pos.current)}s` : url);
  const more = sermons.filter((s) => s.id !== sermon.id && s.title !== sermon.title).slice(0, 4);

  const save = () => {
    saveNote({ id: existing && existing.id, sermonId: sermon.id, title: sermon.title, body: draft });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header
        onBack={() => navigation.goBack()}
        eyebrow={sermon.kind}
        title="Now playing"
        right={<IconButton icon="share-outline" onPress={() => Share.share({ message: `${sermon.title} — ${sermon.speaker}\n${sermon.url}\n\n${church.name}` })} />}
      />
      <YouTubePlayer videoId={sermon.id} onTime={onTime} />
      <WatchOnYouTubeBar onPress={() => Linking.openURL(atTime(sermon.url))} />
      <Screen edges={[]} contentStyle={{ paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Tag label={sermon.kind} />
          {sermon.isFull ? <Tag label="Full service" color={colors.textSecondary} /> : null}
        </View>
        <H1 style={{ marginTop: 12 }}>{sermon.title}</H1>
        <Small style={{ marginTop: 6 }}>{sermon.speaker} · {formatLongDate(sermon.published)}</Small>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
          <Button title="Share" icon="share-social-outline" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => Share.share({ message: `${sermon.title} — ${sermon.speaker}
${sermon.url}

${church.name}` })} />
          <Button title="Give" icon="wallet-outline" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => navigation.navigate('Give')} />
        </View>

        <SectionHeader eyebrow="Your notes" title="Take notes" />
        {isMember ? (
          <View>
            <Field
              placeholder="What is the Holy Spirit saying to you through this message?"
              multiline
              value={draft}
              onChangeText={setDraft}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {saved ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Caption style={{ color: colors.success, marginLeft: 6 }}>Saved to your notes</Caption>
                </View>
              ) : <Caption style={{ flex: 1 }}>Private to you · synced to your Notes</Caption>}
              <Button title="Save note" size="sm" onPress={save} disabled={!draft.trim()} style={{ paddingHorizontal: 18 }} />
            </View>
          </View>
        ) : (
          <View style={styles.locked}>
            <Ionicons name="lock-closed" size={16} color={colors.gold} />
            <Text style={styles.lockedText}>Sign in as a member to keep sermon notes.</Text>
          </View>
        )}

        {more.length ? <SectionHeader eyebrow="Keep watching" title="More messages" /> : null}
        {more.map((s) => <SermonRow key={s.id} sermon={s} onPress={() => navigation.push('Sermon', { sermon: s })} />)}
      </Screen>
    </View>
  );
}

// Slim bar under the in-app player: the video plays here, and one tap takes the
// viewer to YouTube (at the same moment) if they prefer the YouTube app.
export function WatchOnYouTubeBar({ onPress, live, label }) {
  return (
    <View style={styles.ytBar}>
      <View style={[styles.ytDot, live && { backgroundColor: colors.live }, label && !live && { backgroundColor: colors.textMuted }]} />
      <Text numberOfLines={1} style={styles.ytBarText}>{label || (live ? 'Live · in the app' : 'Playing in the app')}</Text>
      <PressScale onPress={onPress} style={styles.ytBtn} hitSlop={8}>
        <Ionicons name="logo-youtube" size={15} color="#FF3B30" />
        <Text style={styles.ytBtnText}>Watch on YouTube</Text>
        <Ionicons name="open-outline" size={12} color={colors.textSecondary} />
      </PressScale>
    </View>
  );
}

// Sunday & midweek livestream, played inside the app.
// Sermon audio and a video shouldn't play over each other.
function usePauseAudio() {
  const audio = useAudio();
  useEffect(() => { audio && audio.pause(); }, []);
}

export function LiveScreen({ navigation }) {
  usePauseAudio();
  const { sermons } = useStore();
  const { live, next } = getServiceStatus();
  const c = next ? countdownParts(next.start) : null;
  const latest = sermons[0];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} eyebrow={live ? 'Live now' : 'Livestream'} title={live ? live.service.name : 'Church online'} />
      <YouTubePlayer liveChannel={youtube.channelId} />
      <WatchOnYouTubeBar live={!!live} label={live ? 'Live · in the app' : 'Offline until service'} onPress={() => Linking.openURL(youtube.liveUrl)} />
      <Screen edges={[]} contentStyle={{ paddingTop: 20 }}>
        {live ? (
          <>
            <Tag label="● LIVE" color={colors.live} />
            <H1 style={{ marginTop: 12 }}>{live.service.name}</H1>
            <Small style={{ marginTop: 6 }}>Worship with the family from wherever you are. If the stream hasn’t started yet, give it a minute and pull to refresh.</Small>
          </>
        ) : (
          <>
            <Eyebrow>Not live right now</Eyebrow>
            <H2 style={{ marginTop: 8 }}>Next: {next ? next.service.name : 'Sunday Service'}</H2>
            {c ? <Small style={{ marginTop: 6 }}>Starts in {c.days ? `${c.days}d ` : ''}{c.hours}h {c.mins}m · {next.service.label} GMT</Small> : null}
            <Small style={{ marginTop: 10 }}>The stream shows here automatically when we go live. Turn on service reminders to get a nudge.</Small>
            <Button title="Service reminders" icon="notifications-outline" variant="secondary" size="md" onPress={() => navigation.navigate('NotificationSettings')} style={{ marginTop: 16 }} />
          </>
        )}
        {latest ? (
          <>
            <SectionHeader eyebrow="Catch up" title="Latest message" />
            <SermonRow sermon={latest} onPress={() => navigation.navigate('Sermon', { sermon: latest })} />
          </>
        ) : null}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  ytBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: colors.bgRaised, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  ytDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success, marginRight: 8 },
  ytBarText: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textSecondary },
  ytBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 32, borderRadius: radius.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.borderStrong },
  ytBtnText: { fontFamily: fonts.label, fontSize: 12, color: colors.text },
  locked: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  lockedText: { fontFamily: fonts.body, fontSize: 14, color: colors.textSecondary, flex: 1 },
});
