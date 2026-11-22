import React from 'react';
import { Alert, Image, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { brand, church, getFellowship } from '../data/church';
import { formatShortDate } from '../services/schedule';
import { Avatar, Caption, Card, Display, Eyebrow, H2, ListRow, PressScale, Screen, SectionHeader } from '../components/ui';
import { colors, fonts, radius } from '../theme';

export function MemberCard({ member, compact }) {
  const f = getFellowship(member.fellowshipId);
  return (
    <LinearGradient colors={['#1D1A14', '#0B0A08']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, compact && { padding: 18 }]}>
      <Image source={brand.mark} style={styles.cardWatermark} resizeMode="contain" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Image source={brand.logoFull} style={{ width: 132, height: 132 * (148 / 761) }} resizeMode="contain" />
        <Text style={styles.cardKind}>MEMBER</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: compact ? 22 : 34 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName}>{member.firstName} {member.lastName}</Text>
          <Text style={styles.cardId}>{member.memberId}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 14 }}>
            <View>
              <Text style={styles.cardLabel}>FELLOWSHIP</Text>
              <Text style={styles.cardValue}>{f ? f.name : '—'}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>SINCE</Text>
              <Text style={styles.cardValue}>{new Date(member.memberSince).getUTCFullYear()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.qr}>
          <QRCode value={`TBC-MEMBER:${member.memberId}`} size={compact ? 64 : 78} backgroundColor="#F4F2EE" color="#0B0A08" />
        </View>
      </View>
    </LinearGradient>
  );
}

export default function MeScreen({ navigation }) {
  const { member, signOut } = useAuth();
  const { notes, prayers, checkins, rsvps } = useStore();
  const go = (r, p) => navigation.navigate(r, p);

  const confirmSignOut = () => {
    if (Platform.OS === 'web') { signOut(); return; }
    Alert.alert('Sign out?', 'You’ll need your Member ID and password to sign back in.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <Screen>
      <View style={styles.head}>
        <Avatar name={`${member.firstName} ${member.lastName}`} size={58} />
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Eyebrow style={{ fontSize: 10 }}>Member · {member.department}</Eyebrow>
          <Display style={{ fontSize: 26, lineHeight: 32, marginTop: 4 }}>{member.firstName} {member.lastName}</Display>
        </View>
      </View>

      <PressScale onPress={() => go('MemberCard')} style={{ marginTop: 22 }}>
        <MemberCard member={member} compact />
      </PressScale>
      <Caption style={{ textAlign: 'center', marginTop: 10 }}>Tap your card to show it at the welcome desk</Caption>

      <View style={styles.stats}>
        {[
          ['Check-ins', checkins.length, 'CheckIn'],
          ['Notes', notes.length, 'Notes'],
          ['Prayers', prayers.length, 'Prayer'],
          ['Going', rsvps.length, 'Events'],
        ].map(([l, v, r]) => (
          <PressScale key={l} onPress={() => go(r)} style={styles.stat}>
            <Text style={styles.statNum}>{v}</Text>
            <Caption>{l}</Caption>
          </PressScale>
        ))}
      </View>

      <SectionHeader title="My church life" />
      <Card style={{ paddingVertical: 4 }}>
        <ListRow icon="qr-code-outline" title="Service check-in" subtitle="Mark your attendance" onPress={() => go('CheckIn')} />
        <ListRow icon="create-outline" title="Sermon notes" subtitle={`${notes.length} saved`} onPress={() => go('Notes')} />
        <ListRow icon="flame-outline" title="Prayer requests" subtitle="Share with the prayer team" onPress={() => go('Prayer')} />
        <ListRow icon="calendar-outline" title="Events" subtitle="Calendar & RSVPs" onPress={() => go('Events')} />
        <ListRow icon="megaphone-outline" title="Announcements" onPress={() => go('Announcements')} last />
      </Card>

      <SectionHeader title="The church" />
      <Card style={{ paddingVertical: 4 }}>
        <ListRow icon="information-circle-outline" title="About The Balance Church" subtitle="Mission, vision & leadership" onPress={() => go('About')} />
        <ListRow icon="trending-up-outline" title="Business & Health" subtitle="Sunday business & health segments" onPress={() => go('News')} />
        <ListRow icon="library-outline" title="Library" subtitle="Books by Apostle Michael Dadzie" onPress={() => go('Library')} />
        <ListRow icon="logo-whatsapp" title="Message the church office" subtitle={church.phone} onPress={() => Linking.openURL(church.whatsapp)} last />
      </Card>

      <SectionHeader title="Account" />
      <Card style={{ paddingVertical: 4 }}>
        <ListRow icon="id-card-outline" title="Member ID" subtitle={member.memberId} right={null} />
        <ListRow icon="calendar-number-outline" title="Member since" subtitle={formatShortDate(member.memberSince) + ', ' + new Date(member.memberSince).getUTCFullYear()} right={null} />
        <ListRow icon="key-outline" title="Change password" onPress={() => go('ForgotPassword')} />
        <ListRow icon="log-out-outline" title="Sign out" danger onPress={confirmSignOut} last />
      </Card>

      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Image source={brand.mark} style={{ width: 24, height: 22, tintColor: colors.textFaint }} resizeMode="contain" />
        <Caption style={{ marginTop: 8, color: colors.textFaint }}>The Balance Church · v1.0</Caption>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  card: { borderRadius: radius.xl, padding: 22, borderWidth: 1, borderColor: colors.goldLine, overflow: 'hidden' },
  cardWatermark: { position: 'absolute', right: -50, bottom: -60, width: 240, height: 220, opacity: 0.06, tintColor: colors.goldBright },
  cardKind: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 3, color: colors.gold },
  cardName: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
  cardId: { fontFamily: fonts.label, fontSize: 13, letterSpacing: 2.5, color: colors.goldBright, marginTop: 4 },
  cardLabel: { fontFamily: fonts.label, fontSize: 8, letterSpacing: 1.6, color: colors.textMuted },
  cardValue: { fontFamily: fonts.subheading, fontSize: 13, color: colors.text, marginTop: 2 },
  qr: { padding: 7, borderRadius: 12, backgroundColor: '#F4F2EE' },
  stats: { flexDirection: 'row', gap: 8, marginTop: 20 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  statNum: { fontFamily: fonts.display, fontSize: 22, color: colors.text, marginBottom: 2 },
});
