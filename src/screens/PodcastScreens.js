import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Linking, RefreshControl, Share, StyleSheet, Text, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAudio, useAudioStatus } from '../context/AudioContext';
import { church, spotify } from '../data/church';
import { podcastArtwork, formatClock, formatDuration, durationToSeconds } from '../services/podcast';
import { formatLongDate } from '../services/schedule';
import { Body, Button, Caption, Eyebrow, H1, H3, Header, IconButton, PressScale, Screen, SectionHeader, Small } from '../components/ui';
import { colors, fonts, GUTTER, radius } from '../theme';

export const SPOTIFY_GREEN = '#1DB954';
const LOCAL_ART = require('../../assets/church/photos/podcast_art.jpg');

// Episode artwork: the bundled podcast cover shows instantly (and offline);
// an episode's own artwork, if it has one, loads over it.
export function Artwork({ uri, style }) {
  const own = uri && uri !== podcastArtwork;
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <Image source={LOCAL_ART} style={StyleSheet.absoluteFill} resizeMode="cover" />
      {own ? <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
    </View>
  );
}

const openSpotify = () => Linking.openURL(spotify.showUrl);
const shortDate = (d) => formatLongDate(new Date(d).toISOString());

/* ---------- Building blocks ---------- */

export function SpotifyButton({ style, compact }) {
  return (
    <PressScale onPress={openSpotify} style={[styles.spotifyBtn, compact && { height: 34, paddingHorizontal: 12 }, style]}>
      <FontAwesome name="spotify" size={compact ? 15 : 18} color="#0B0B0C" />
      <Text numberOfLines={1} style={[styles.spotifyText, compact && { fontSize: 12 }]}>{compact ? 'Spotify' : 'Open in Spotify'}</Text>
    </PressScale>
  );
}

export function EpisodeCard({ episode, onPress }) {
  const { current } = useAudio();
  const { playing } = useAudioStatus();
  const isOn = current && current.id === episode.id;
  return (
    <PressScale onPress={onPress} style={styles.card}>
      <View>
        <Artwork uri={episode.image} style={styles.cardImg} />
        <View style={styles.cardPlay}>
          <Ionicons name={isOn && playing ? 'pause' : 'play'} size={16} color="#141008" style={!(isOn && playing) && { marginLeft: 2 }} />
        </View>
      </View>
      <Text numberOfLines={2} style={styles.cardTitle}>{episode.title}</Text>
      <Caption style={{ marginTop: 4 }}>{formatDuration(episode.duration)}</Caption>
    </PressScale>
  );
}

export function EpisodeRow({ episode, onPress, last }) {
  const { current } = useAudio();
  const { playing } = useAudioStatus();
  const isOn = current && current.id === episode.id;
  return (
    <PressScale onPress={onPress} style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Artwork uri={episode.image} style={styles.rowImg} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text numberOfLines={2} style={[styles.rowTitle, isOn && { color: colors.gold }]}>{episode.title}</Text>
        <Caption style={{ marginTop: 4 }}>{shortDate(episode.published)} · {formatDuration(episode.duration)}</Caption>
      </View>
      <View style={[styles.rowPlay, isOn && { backgroundColor: colors.gold, borderColor: colors.gold }]}>
        <Ionicons name={isOn && playing ? 'pause' : 'play'} size={15} color={isOn ? '#141008' : colors.text} style={!(isOn && playing) && { marginLeft: 2 }} />
      </View>
    </PressScale>
  );
}

// Seek bar: tap or drag anywhere on it.
function Scrubber({ position, duration, onSeek }) {
  const [w, setW] = useState(1);
  const [drag, setDrag] = useState(null);
  const pct = duration ? Math.min(1, (drag != null ? drag : position) / duration) : 0;
  const toSec = (x) => Math.max(0, Math.min(duration, (x / w) * duration));
  return (
    <View>
      <View
        style={styles.scrubHit}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => !!duration}
        onMoveShouldSetResponder={() => !!duration}
        onResponderGrant={(e) => setDrag(toSec(e.nativeEvent.locationX))}
        onResponderMove={(e) => setDrag(toSec(e.nativeEvent.locationX))}
        onResponderRelease={() => { if (drag != null) onSeek(drag); setDrag(null); }}
        onResponderTerminate={() => setDrag(null)}
      >
        <View style={styles.scrubTrack}>
          <View style={[styles.scrubFill, { width: `${pct * 100}%` }]} />
        </View>
        <View style={[styles.scrubKnob, { left: Math.max(0, pct * w - 7) }]} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <Caption>{formatClock(drag != null ? drag : position)}</Caption>
        <Caption>-{formatClock(Math.max(0, duration - (drag != null ? drag : position)))}</Caption>
      </View>
    </View>
  );
}

/* ---------- Mini player (sits above the tab bar while audio is playing) ---------- */

export function MiniPlayer({ onOpen }) {
  const { current, toggle, stop } = useAudio();
  const { playing, currentTime = 0, duration = 0, isBuffering } = useAudioStatus();
  if (!current) return null;
  const total = duration || durationToSeconds(current.duration);
  return (
    <PressScale onPress={onOpen} scaleTo={0.99} style={styles.mini}>
      <View style={[styles.miniProgress, { width: `${total ? Math.min(100, (currentTime / total) * 100) : 0}%` }]} />
      <Artwork uri={current.image} style={styles.miniImg} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text numberOfLines={1} style={styles.miniTitle}>{current.title}</Text>
        <Text numberOfLines={1} style={styles.miniSub}>{isBuffering && !playing ? 'Loading…' : `Sermon audio · ${formatClock(currentTime)}`}</Text>
      </View>
      <PressScale onPress={toggle} hitSlop={8} style={styles.miniBtn}>
        <Ionicons name={playing ? 'pause' : 'play'} size={20} color={colors.text} />
      </PressScale>
      <PressScale onPress={stop} hitSlop={8} style={styles.miniBtn}>
        <Ionicons name="close" size={20} color={colors.textMuted} />
      </PressScale>
    </PressScale>
  );
}

/* ---------- All episodes ---------- */

export function PodcastScreen({ navigation }) {
  const { episodes, loading, refresh, play } = useAudio();
  const open = (ep) => { play(ep); navigation.navigate('Episode', { episode: ep }); };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} eyebrow="Listen" title="Sermon audio" right={<IconButton icon="share-outline" onPress={() => Share.share({ message: `${spotify.title} on Spotify\n${spotify.showUrl}\n\n${church.name}` })} />} />
      <Screen edges={[]} contentStyle={{ paddingTop: 18 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.gold} />}>
        <View style={styles.showHead}>
          <Image source={LOCAL_ART} style={styles.showImg} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Eyebrow style={{ color: SPOTIFY_GREEN }}>Podcast · Spotify</Eyebrow>
            <H3 style={{ marginTop: 6 }}>{spotify.title}</H3>
            <Caption style={{ marginTop: 4 }}>{episodes.length}+ messages · new every week</Caption>
          </View>
        </View>
        <Small style={{ marginTop: 14 }}>Listen right here in the app, even with your screen off, or open the show in Spotify to follow it and download for offline.</Small>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <Button title="Play latest" icon="play" size="md" style={{ flex: 1 }} onPress={() => episodes[0] && open(episodes[0])} />
          <SpotifyButton style={{ flex: 1 }} />
        </View>
        <SectionHeader eyebrow="All messages" title="Episodes" />
        {episodes.map((ep, i) => <EpisodeRow key={ep.id || ep.audioUrl} episode={ep} onPress={() => open(ep)} last={i === episodes.length - 1} />)}
      </Screen>
    </View>
  );
}

/* ---------- Now playing ---------- */

export function EpisodeScreen({ route, navigation }) {
  const { episodes, current, play, toggle, skip, seekTo, rate, setRate } = useAudio();
  const { playing, currentTime = 0, duration = 0, isBuffering } = useAudioStatus();
  const ep = (route.params && route.params.episode) || current;
  const isOn = current && ep && current.id === ep.id;
  const total = isOn && duration ? duration : durationToSeconds(ep && ep.duration);
  const upNext = useMemo(() => {
    const i = episodes.findIndex((e) => ep && e.id === ep.id);
    return episodes.slice(i + 1, i + 5);
  }, [episodes, ep]);
  if (!ep) return null;
  const RATES = [1, 1.25, 1.5, 0.75];
  const nextRate = () => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header
        onBack={() => navigation.goBack()}
        eyebrow="Now playing"
        title="Sermon audio"
        right={<IconButton icon="share-outline" onPress={() => Share.share({ message: `“${ep.title}” — Apostle Michael Dadzie\nListen on Spotify: ${spotify.showUrl}\n\n${church.name}` })} />}
      />
      <Screen edges={[]} contentStyle={{ paddingTop: 20 }}>
        <View style={styles.artWrap}>
          <Artwork uri={ep.image} style={styles.art} />
        </View>
        <Eyebrow style={{ marginTop: 22 }}>{shortDate(ep.published)}</Eyebrow>
        <H1 style={{ marginTop: 8 }}>{ep.title}</H1>
        <Small style={{ marginTop: 4 }}>Apostle Michael Dadzie · {formatDuration(ep.duration)}</Small>

        <View style={{ marginTop: 22 }}>
          <Scrubber position={isOn ? currentTime : 0} duration={total} onSeek={(s) => (isOn ? seekTo(s) : (play(ep), setTimeout(() => seekTo(s), 600)))} />
        </View>

        <View style={styles.controls}>
          <PressScale onPress={nextRate} style={styles.rateBtn}><Text style={styles.rateText}>{rate}×</Text></PressScale>
          <PressScale onPress={() => skip(-15)} disabled={!isOn} style={styles.ctl}><Ionicons name="play-back" size={22} color={isOn ? colors.text : colors.textFaint} /><Text style={styles.ctlLabel}>15</Text></PressScale>
          <PressScale onPress={() => (isOn ? toggle() : play(ep))} style={styles.bigPlay}>
            {isOn && isBuffering && !playing ? <ActivityIndicator color="#141008" /> : (
              <Ionicons name={isOn && playing ? 'pause' : 'play'} size={30} color="#141008" style={!(isOn && playing) && { marginLeft: 4 }} />
            )}
          </PressScale>
          <PressScale onPress={() => skip(30)} disabled={!isOn} style={styles.ctl}><Ionicons name="play-forward" size={22} color={isOn ? colors.text : colors.textFaint} /><Text style={styles.ctlLabel}>30</Text></PressScale>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.spotifyCard}>
          <FontAwesome name="spotify" size={26} color={SPOTIFY_GREEN} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.spotifyCardTitle}>Prefer Spotify?</Text>
            <Caption style={{ marginTop: 2 }}>Follow the show and download messages for offline.</Caption>
          </View>
          <SpotifyButton compact />
        </View>

        {ep.description ? <Body style={{ marginTop: 18 }}>{ep.description}</Body> : null}

        {upNext.length ? <SectionHeader eyebrow="Keep listening" title="Up next" /> : null}
        {upNext.map((e, i) => (
          <EpisodeRow key={e.id || e.audioUrl} episode={e} last={i === upNext.length - 1} onPress={() => { play(e); navigation.setParams({ episode: e }); }} />
        ))}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  spotifyBtn: { height: 48, borderRadius: radius.pill, backgroundColor: SPOTIFY_GREEN, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 12 },
  spotifyText: { fontFamily: fonts.label, fontSize: 13, flexShrink: 1, color: '#0B0B0C' },
  card: { width: 150, marginRight: 14 },
  cardImg: { width: 150, height: 150, borderRadius: 16, backgroundColor: colors.surface2 },
  cardPlay: { position: 'absolute', right: 8, bottom: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: fonts.label, fontSize: 13, lineHeight: 18, color: colors.text, marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  rowImg: { width: 56, height: 56, borderRadius: 12, backgroundColor: colors.surface2 },
  rowTitle: { fontFamily: fonts.label, fontSize: 14, lineHeight: 19, color: colors.text },
  rowPlay: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  scrubHit: { height: 28, justifyContent: 'center' },
  scrubTrack: { height: 4, borderRadius: 2, backgroundColor: colors.surface3, overflow: 'hidden' },
  scrubFill: { height: 4, backgroundColor: colors.gold },
  scrubKnob: { position: 'absolute', top: 7, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.goldBright },
  mini: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 8, padding: 8, borderRadius: 16, backgroundColor: '#1A1712', borderWidth: 1, borderColor: colors.goldLine, overflow: 'hidden' },
  miniProgress: { position: 'absolute', left: 0, bottom: 0, height: 2, backgroundColor: colors.gold },
  miniImg: { width: 42, height: 42, borderRadius: 10, backgroundColor: colors.surface2 },
  miniTitle: { fontFamily: fonts.label, fontSize: 13, color: colors.text },
  miniSub: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  miniBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  showHead: { flexDirection: 'row', alignItems: 'center' },
  showImg: { width: 92, height: 92, borderRadius: 18, backgroundColor: colors.surface2 },
  artWrap: { alignItems: 'center' },
  art: { width: '100%', maxWidth: 340, aspectRatio: 1, borderRadius: 24, backgroundColor: colors.surface2 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingHorizontal: 4 },
  rateBtn: { width: 44, height: 32, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  rateText: { fontFamily: fonts.label, fontSize: 12, color: colors.textSecondary },
  ctl: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  ctlLabel: { fontFamily: fonts.label, fontSize: 9, color: colors.textMuted, marginTop: 1 },
  bigPlay: { width: 74, height: 74, borderRadius: 37, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  spotifyCard: { flexDirection: 'row', alignItems: 'center', marginTop: 24, padding: 14, borderRadius: radius.lg, backgroundColor: 'rgba(29,185,84,0.08)', borderWidth: 1, borderColor: 'rgba(29,185,84,0.28)' },
  spotifyCardTitle: { fontFamily: fonts.label, fontSize: 14, color: colors.text },
});
