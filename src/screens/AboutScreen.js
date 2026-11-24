import React, { useState } from 'react';
import { Dimensions, Image, Linking, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { brand, church, leaders, modelsOfEmphasis, photos, services, socials } from '../data/church';
import { BackFab, Body, Button, Caption, Card, Eyebrow, H2, H3, IconButton, PressScale, Screen, SectionHeader, Small } from '../components/ui';
import { colors, fonts, radius } from '../theme';

const JOURNEY = require('../../assets/church/photos/our_journey.jpg');

export default function AboutScreen({ navigation, route }) {
  const canGoBack = navigation.canGoBack() && route.name === 'About';
  const [w, setW] = useState(Math.min(Dimensions.get('window').width, 430));
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Screen padded={false} edges={[]}>
        {/* Hero */}
        <View style={[styles.hero, { height: w * (850 / 870) + 30 }]} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
          {/* "Our journey" — an open road toward the mountains, shown whole */}
          <Image source={JOURNEY} style={{ position: 'absolute', top: 0, left: 0, width: w, height: w * (850 / 870) }} resizeMode="cover" />
          <LinearGradient colors={['rgba(6,6,7,0.7)', 'rgba(6,6,7,0.3)', 'rgba(6,6,7,0)', colors.bg]} locations={[0, 0.4, 0.72, 1]} style={{ position: 'absolute', top: 0, left: 0, width: w, height: w * (850 / 870) + 1 }} />
          {canGoBack ? <BackFab onPress={() => navigation.goBack()} /> : null}
          <View style={styles.heroContent}>
            <Image source={brand.logoFull} style={styles.logo} resizeMode="contain" />
            <Text style={styles.heroTag}>{church.hashtag}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Eyebrow>Our story</Eyebrow>
          <Body style={{ marginTop: 10, fontSize: 16, lineHeight: 26, color: colors.text }}>{church.story}</Body>

          {/* Mission & vision */}
          <View style={[styles.mv, { marginTop: 26 }]}>
            <Ionicons name="locate-outline" size={22} color={colors.gold} />
            <Text style={styles.mvTitle}>Mission</Text>
            <Body style={{ color: colors.text }}>{church.mission.text}</Body>
            <Text style={styles.mvRef}>{church.mission.ref}</Text>
          </View>
          <LinearGradient colors={['#2A1A06', '#120B03']} style={[styles.mv, { borderColor: colors.goldLine }]}>
            <Ionicons name="flag-outline" size={22} color={colors.goldBright} />
            <Text style={styles.mvTitle}>Vision</Text>
            <Body style={{ color: colors.text }}>{church.vision.text}</Body>
            <Text style={styles.mvRef}>{church.vision.ref}</Text>
          </LinearGradient>

          {/* Models of emphasis */}
          <SectionHeader eyebrow="What we stand on" title="Models of Emphasis" />
          <View style={styles.models}>
            {modelsOfEmphasis.map((m, i) => (
              <View key={m} style={styles.model}>
                <Text style={styles.modelNum}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={styles.modelText}>{m}</Text>
              </View>
            ))}
          </View>

          {/* Leadership */}
          <SectionHeader eyebrow="Meet our leaders" title="Leadership" />
          {leaders.map((l) => (
            <PressScale key={l.id} onPress={() => navigation.navigate('Leader', { leader: l })} style={styles.leader}>
              <View style={styles.leaderImgWrap}><Image source={l.image} style={styles.leaderImg} resizeMode="cover" /></View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Caption style={{ color: colors.gold, fontFamily: fonts.label, letterSpacing: 1 }}>{l.role.toUpperCase()}</Caption>
                <H3 style={{ marginTop: 4 }}>{l.name}</H3>
                <Small numberOfLines={2} style={{ marginTop: 4 }}>{l.bio[0]}</Small>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
            </PressScale>
          ))}

          {/* Visit */}
          <SectionHeader eyebrow="Visit us" title="Service times" />
          <Card>
            {services.map((s, i) => (
              <View key={s.id} style={[styles.svc, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong }]}>
                <View style={styles.svcIcon}><Ionicons name={s.day === 0 ? 'sunny-outline' : 'moon-outline'} size={18} color={colors.gold} /></View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <H3>{s.name}</H3>
                  <Caption style={{ marginTop: 2 }}>{s.label} GMT</Caption>
                </View>
              </View>
            ))}
            <View style={[styles.svc, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong }]}>
              <View style={styles.svcIcon}><Ionicons name="location-outline" size={18} color={colors.gold} /></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <H3>{church.venue}</H3>
                <Caption style={{ marginTop: 2 }}>{church.address}</Caption>
              </View>
            </View>
            <Button title="Get directions" icon="navigate-outline" size="md" onPress={() => Linking.openURL(church.mapsUrl)} style={{ marginTop: 12 }} />
          </Card>

          <SectionHeader eyebrow="Get in touch" title="Contact" />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="Call" icon="call-outline" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => Linking.openURL(`tel:${church.phoneRaw}`)} />
            <Button title="WhatsApp" icon="logo-whatsapp" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => Linking.openURL(church.whatsapp)} />
          </View>
          <Button title={church.email} icon="mail-outline" variant="ghost" size="md" style={{ marginTop: 10 }} onPress={() => Linking.openURL(`mailto:${church.email}`)} />

          <View style={styles.socials}>
            {socials.map((s) => (
              <PressScale key={s.id} onPress={() => Linking.openURL(s.url)} style={styles.social}>
                {s.iconSet === 'fa' ? <FontAwesome name={s.icon} size={22} color={colors.text} /> : <Ionicons name={s.icon} size={22} color={colors.text} />}
                <Caption numberOfLines={1} style={{ marginTop: 6, fontSize: 10 }}>{s.label}</Caption>
              </PressScale>
            ))}
          </View>
          <Caption style={{ marginTop: 24, textAlign: 'center', color: colors.textFaint, fontSize: 10 }}>
            Header photo: Alexander Grebenkov / Wikimedia Commons (CC BY 3.0)
          </Caption>
        </View>
      </Screen>
    </View>
  );
}

export function LeaderScreen({ route, navigation }) {
  const { leader } = route.params;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Screen padded={false} edges={[]}>
        <View style={{ height: 440, backgroundColor: '#0E0E10', overflow: 'hidden' }}>
          <Image source={leader.image} style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: '92%', height: '96%' }} resizeMode="contain" />
          <LinearGradient colors={['rgba(6,6,7,0)', colors.bg]} locations={[0.6, 1]} style={StyleSheet.absoluteFill} />
          <BackFab onPress={() => navigation.goBack()} />
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: -10 }}>
          <Eyebrow>{leader.role}</Eyebrow>
          <H2 style={{ fontSize: 28, lineHeight: 34, marginTop: 8 }}>{leader.name}</H2>
          {leader.bio.map((p, i) => <Body key={i} style={{ marginTop: 14, fontSize: 16, lineHeight: 26 }}>{p}</Body>)}
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { justifyContent: 'flex-start', overflow: 'hidden' },
  heroContent: { alignItems: 'center', paddingTop: 64 },
  logo: { width: 250, height: 250 * (148 / 761) },
  heroTag: { fontFamily: fonts.serifItalic, fontSize: 16, color: colors.textSecondary, marginTop: 12 },
  mv: { padding: 20, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  mvTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.text, marginTop: 12, marginBottom: 8 },
  mvRef: { fontFamily: fonts.label, fontSize: 12, color: colors.gold, marginTop: 12, letterSpacing: 0.5 },
  models: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  model: { width: '48.5%', flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  modelNum: { fontFamily: fonts.label, fontSize: 11, color: colors.gold, width: 26 },
  modelText: { fontFamily: fonts.light, fontSize: 15, color: colors.text, flex: 1 },
  leader: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  leaderImgWrap: { width: 72, height: 88, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.surface3 },
  leaderImg: { width: '100%', height: '100%' },
  svc: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  svcIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  socials: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  social: { width: '18.6%', alignItems: 'center', paddingVertical: 14, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
});
