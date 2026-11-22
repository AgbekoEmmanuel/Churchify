import React, { useState } from 'react';
import { Dimensions, Image, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { brand, church, fellowshipPhoto, fellowships, getFellowship } from '../data/church';
import { fellowshipNotices } from '../data/content';
import { timeAgo } from '../services/schedule';
import { BackFab, Body, Button, Caption, Card, Display, Eyebrow, H2, H3, PressScale, Screen, Scripture, SectionHeader, Small } from '../components/ui';
import { colors, fonts, radius, rs } from '../theme';

export default function FellowshipScreen({ navigation }) {
  const { member } = useAuth();
  const mine = getFellowship(member.fellowshipId);
  const [cw, setCw] = useState(Math.min(Dimensions.get('window').width, 430) - 40);

  return (
    <Screen>
      <View style={{ marginTop: 14 }}>
        <Eyebrow>Community</Eyebrow>
        <Display style={{ marginTop: 6 }}>Fellowship</Display>
      </View>

      {/* My fellowship */}
      <View style={styles.hero} onLayout={(e) => setCw(e.nativeEvent.layout.width)}>
        {/* whole 4:3 congregation photo on top, text below — no crop */}
        <View style={{ width: cw, height: cw * 0.75 }}>
          <FellowshipBackdrop f={mine} width={cw} height={cw * 0.75} fadeTo={colors.surface} />
        </View>
        <View style={{ paddingHorizontal: 20, paddingBottom: 20, marginTop: -54 }}>
          <View style={[styles.badge, { borderColor: mine.accent }]}>
            <View style={[styles.dot, { backgroundColor: mine.accent }]} />
            <Text style={styles.badgeText}>YOUR FELLOWSHIP</Text>
          </View>
          <Text style={styles.heroName}>{mine.name}</Text>
          <Body style={{ color: colors.text, opacity: 0.85, marginTop: 6 }}>{mine.description}</Body>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <Button title="Prayer" icon="flame-outline" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => navigation.navigate('Prayer')} />
        <Button title="WhatsApp" icon="logo-whatsapp" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => Linking.openURL(church.whatsapp)} />
      </View>

      <SectionHeader eyebrow={`${mine.name} fellowship`} title="Notices" />
      {fellowshipNotices.map((n) => (
        <Card key={n.id} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.dot, { backgroundColor: mine.accent, marginRight: 8 }]} />
            <H3 style={{ flex: 1 }}>{n.title}</H3>
            <Caption>{timeAgo(n.date)}</Caption>
          </View>
          <Small style={{ marginTop: 6 }}>{n.body}</Small>
        </Card>
      ))}

      <Card style={styles.verse}>
        <Scripture style={{ fontSize: 17, lineHeight: 26 }}>
          “For where two or three are gathered together in my name, there am I in the midst of them.”
        </Scripture>
        <Text style={styles.ref}>— Matthew 18:20</Text>
      </Card>

      <SectionHeader eyebrow="The Balance family" title="All fellowships" />
      <View style={styles.grid}>
        {fellowships.map((f) => (
          <PressScale key={f.id} onPress={() => navigation.navigate('FellowshipDetail', { fellowship: f })} style={[styles.tile, f.id === mine.id && { borderColor: f.accent }]}>
            <View style={[styles.tileBar, { backgroundColor: f.accent }]} />
            <Text style={styles.tileName}>{f.name}</Text>
            <Caption numberOfLines={2} style={{ marginTop: 4 }}>{f.description}</Caption>
            {f.id === mine.id ? <Text style={[styles.tileMine, { color: f.accent }]}>● Yours</Text> : null}
          </PressScale>
        ))}
      </View>
    </Screen>
  );
}

// Blurred congregation photo + fellowship colour wash + The Balance Church mark.
function FellowshipBackdrop({ f, width, height, fadeTo }) {
  return (
    <View style={{ width, height, overflow: 'hidden', backgroundColor: '#0B0B0D' }}>
      <Image source={fellowshipPhoto(f)} blurRadius={Platform.OS === 'android' ? 6 : 14} style={{ position: 'absolute', top: -20, left: -20, width: width + 40, height: height + 40 }} resizeMode="cover" />
      <LinearGradient colors={[f.accent + '55', 'rgba(6,6,7,0.35)', 'rgba(6,6,7,0.55)']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <Image source={brand.mark} style={[styles.backdropMark, { width: height * 0.95, height: height * 0.95 * (149 / 162), top: height * 0.06, right: -height * 0.12 }]} resizeMode="contain" />
      <LinearGradient colors={['rgba(0,0,0,0)', fadeTo]} locations={[0.55, 1]} style={StyleSheet.absoluteFill} />
      <View style={[styles.accentBar, { backgroundColor: f.accent }]} />
    </View>
  );
}

export function FellowshipDetailScreen({ route, navigation }) {
  const { fellowship: f } = route.params;
  const { member } = useAuth();
  const isMine = member && member.fellowshipId === f.id;
  const [w, setW] = useState(Math.min(Dimensions.get('window').width, 430));
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      <Screen padded={false} edges={[]}>
        {/* 4:3 congregation photo shown whole — no zoom/crop */}
        <View style={{ height: w * 0.75 + 40, overflow: 'hidden' }}>
          <FellowshipBackdrop f={f} width={w} height={w * 0.75 + 40} fadeTo={colors.bg} />
          <BackFab onPress={() => navigation.goBack()} />
          <View style={{ position: 'absolute', left: 20, bottom: 10 }}>
            <Eyebrow style={{ color: f.accent }}>Fellowship</Eyebrow>
            <Text style={styles.heroName}>{f.name}</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Body style={{ fontSize: 17, lineHeight: 27, color: colors.text, marginTop: 10 }}>{f.description}</Body>
          <Card style={{ marginTop: 22 }}>
            <H3>{isMine ? 'This is your fellowship' : 'Fellowships at The Balance Church'}</H3>
            <Small style={{ marginTop: 6 }}>
              {isMine
                ? 'Notices from your fellowship leaders appear on your Fellowship tab.'
                : 'Every member belongs to one fellowship. To change fellowship, speak with your current fellowship leader or the church office.'}
            </Small>
          </Card>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginTop: 20, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  heroMark: { position: 'absolute', right: -40, top: -20, width: 220, height: 200, opacity: 0.08, tintColor: '#fff' },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(0,0,0,0.4)' },
  badgeText: { fontFamily: fonts.label, fontSize: 9, letterSpacing: 1.6, color: colors.text, marginLeft: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  heroName: { fontFamily: fonts.display, fontSize: rs(40), color: colors.text, letterSpacing: -1, marginTop: 10 },
  verse: { marginTop: 18, padding: 20, backgroundColor: colors.bgRaised, borderColor: colors.goldLine },
  ref: { fontFamily: fonts.label, fontSize: 12, color: colors.gold, marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48.5%', minHeight: 128, padding: 14, marginBottom: 10, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tileBar: { width: 22, height: 4, borderRadius: 2, marginBottom: 12 },
  tileName: { fontFamily: fonts.heading, fontSize: 16, color: colors.text },
  tileMine: { fontFamily: fonts.label, fontSize: 11, marginTop: 8 },
  backdropMark: { position: 'absolute', opacity: 0.22, tintColor: '#FFFFFF' },
  accentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
});
