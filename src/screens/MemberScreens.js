import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { church } from '../data/church';
import { prayerCategories } from '../data/content';
import { formatDay, formatLongDate, formatShortDate, formatTime, getServiceStatus, timeAgo } from '../services/schedule';
import {
  Body, Button, Caption, Card, Chip, Display, EmptyState, Eyebrow, Field, H2, H3, Header, IconButton, Screen, SectionHeader, Small, tap,
} from '../components/ui';
import { MemberCard } from './MeScreen';
import { colors, fonts, radius } from '../theme';

/* ---------------- Member card ---------------- */
export function MemberCardScreen({ navigation }) {
  const { member } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} title="Membership card" />
      <Screen edges={[]} contentStyle={{ paddingTop: 24 }}>
        <MemberCard member={member} />
        <View style={styles.bigQr}>
          <QRCode value={`TBC-MEMBER:${member.memberId}`} size={200} backgroundColor="#F4F2EE" color="#0B0A08" />
        </View>
        <H3 style={{ textAlign: 'center', marginTop: 18 }}>{member.memberId}</H3>
        <Small style={{ textAlign: 'center', marginTop: 6 }}>
          Show this code to the ushers at the welcome desk to record your attendance.
        </Small>
      </Screen>
    </View>
  );
}

/* ---------------- Check-in ---------------- */
export function CheckInScreen({ navigation }) {
  const { member } = useAuth();
  const { checkins, addCheckin } = useStore();
  const { live, next } = getServiceStatus();
  const target = live ? { ...live.service, start: live.start } : next ? { ...next.service, start: next.start } : null;
  const opensAt = target ? new Date(target.start.getTime() - 60 * 60000) : null;
  const isOpen = !!live || (opensAt && new Date() >= opensAt);
  const key = target ? `${target.id}-${target.start.toISOString().slice(0, 10)}` : '';
  const done = checkins.find((c) => c.key === key);

  const checkIn = () => {
    addCheckin({ key, service: target.name, serviceDate: target.start.toISOString() });
    tap('medium');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} title="Check in" />
      <Screen edges={[]} contentStyle={{ paddingTop: 22 }}>
        <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
          <View style={[styles.ring, done && { borderColor: 'rgba(91,214,155,0.5)', backgroundColor: 'rgba(91,214,155,0.1)' }]}>
            <Ionicons name={done ? 'checkmark' : 'qr-code-outline'} size={34} color={done ? colors.success : colors.gold} />
          </View>
          <Eyebrow style={{ marginTop: 18 }}>{live ? 'Happening now' : 'Next service'}</Eyebrow>
          <H2 style={{ marginTop: 6 }}>{target ? target.name : 'No service scheduled'}</H2>
          {target ? <Small style={{ marginTop: 4 }}>{formatDay(target.start)}, {formatShortDate(target.start)} · {formatTime(target.start)} · {church.venue}</Small> : null}

          {done ? (
            <Body style={{ marginTop: 18, color: colors.success, textAlign: 'center' }}>You’re checked in. Welcome home, {member.firstName}!</Body>
          ) : isOpen ? (
            <Button title="I’m here — check me in" icon="checkmark-circle-outline" onPress={checkIn} style={{ marginTop: 22, alignSelf: 'stretch' }} />
          ) : (
            <>
              <Small style={{ marginTop: 18, textAlign: 'center' }}>Check-in opens one hour before service, at {opensAt ? formatTime(opensAt) : ''}.</Small>
              {__DEV__ ? <Button title="Check in anyway (preview)" variant="ghost" size="md" onPress={checkIn} style={{ marginTop: 14, alignSelf: 'stretch' }} /> : null}
            </>
          )}
        </Card>

        <Button title="Show my member QR to an usher" variant="secondary" icon="id-card-outline" onPress={() => navigation.navigate('MemberCard')} style={{ marginTop: 14 }} />

        <SectionHeader eyebrow="Your record" title="Attendance history" />
        {checkins.length ? checkins.map((c) => (
          <View key={c.id} style={styles.histRow}>
            <View style={styles.histDot} />
            <View style={{ flex: 1 }}>
              <H3 style={{ fontSize: 15 }}>{c.service}</H3>
              <Caption style={{ marginTop: 2 }}>{formatLongDate(c.serviceDate)}</Caption>
            </View>
            <Caption>{formatTime(c.at)}</Caption>
          </View>
        )) : <EmptyState icon="calendar-outline" title="No check-ins yet" body="Your attendance will show here after you check in at service." />}
      </Screen>
    </View>
  );
}

/* ---------------- Notes ---------------- */
export function NotesScreen({ navigation }) {
  const { notes } = useStore();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} title="Sermon notes" right={<IconButton icon="add" onPress={() => navigation.navigate('NoteEditor')} />} />
      <Screen edges={[]} contentStyle={{ paddingTop: 16 }}>
        {notes.length ? notes.map((n) => (
          <Card key={n.id} onPress={() => navigation.navigate('NoteEditor', { note: n })} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={n.sermonId ? 'play-circle-outline' : 'document-text-outline'} size={16} color={colors.gold} />
              <Caption style={{ marginLeft: 6, flex: 1 }}>{n.sermonId ? 'Sermon note' : 'Personal note'}</Caption>
              <Caption>{timeAgo(n.updatedAt)}</Caption>
            </View>
            <H3 style={{ marginTop: 8 }} numberOfLines={1}>{n.title || 'Untitled'}</H3>
            <Small numberOfLines={3} style={{ marginTop: 4 }}>{n.body}</Small>
          </Card>
        )) : (
          <EmptyState
            icon="create-outline"
            title="No notes yet"
            body="Take notes while you watch a message, or start a fresh page for what God is saying to you."
            action="New note"
            onAction={() => navigation.navigate('NoteEditor')}
          />
        )}
      </Screen>
    </View>
  );
}

export function NoteEditorScreen({ route, navigation }) {
  const note = route.params && route.params.note;
  const { saveNote, deleteNote } = useStore();
  const [title, setTitle] = useState(note ? note.title : '');
  const [body, setBody] = useState(note ? note.body : '');

  const save = () => {
    saveNote({ ...(note || {}), title: title.trim() || 'Untitled', body });
    navigation.goBack();
  };
  const remove = () => {
    const go = () => { deleteNote(note.id); navigation.goBack(); };
    if (Platform.OS === 'web') return go();
    Alert.alert('Delete note?', 'This can’t be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: go }]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header
        onBack={() => navigation.goBack()}
        title={note ? 'Edit note' : 'New note'}
        right={note ? <IconButton icon="trash-outline" color={colors.danger} onPress={remove} /> : null}
      />
      <Screen edges={[]} contentStyle={{ paddingTop: 16 }}>
        <Field placeholder="Title" value={title} onChangeText={setTitle} inputStyle={{ fontFamily: fonts.heading, fontSize: 18 }} />
        <Field placeholder="Write here…" multiline value={body} onChangeText={setBody} inputStyle={{ minHeight: 280 }} />
        <Button title="Save" onPress={save} disabled={!body.trim() && !title.trim()} />
      </Screen>
    </View>
  );
}

/* ---------------- Prayer ---------------- */
export function PrayerScreen({ navigation }) {
  const { prayers, addPrayer } = useStore();
  const [category, setCategory] = useState('Personal');
  const [text, setText] = useState('');
  const [confidential, setConfidential] = useState(true);
  const [sent, setSent] = useState(false);

  const submit = () => {
    addPrayer({ category, text, confidential });
    setText(''); setSent(true); tap('medium');
    setTimeout(() => setSent(false), 2600);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} title="Prayer request" />
      <Screen edges={[]} contentStyle={{ paddingTop: 20 }}>
        <Eyebrow>We stand with you</Eyebrow>
        <Display style={{ marginTop: 6, fontSize: 28, lineHeight: 34 }}>What can we pray about?</Display>
        <Body style={{ marginTop: 8, marginBottom: 20 }}>Your request goes to the pastoral and prayer team.</Body>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
          {prayerCategories.map((c) => <View key={c} style={{ marginBottom: 8 }}><Chip label={c} active={category === c} onPress={() => setCategory(c)} /></View>)}
        </View>
        <Field placeholder="Share your request…" multiline value={text} onChangeText={setText} />

        <Pressable onPress={() => setConfidential((v) => !v)} style={styles.toggle}>
          <Ionicons name={confidential ? 'checkbox' : 'square-outline'} size={22} color={confidential ? colors.gold : colors.textMuted} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.toggleTitle}>Keep confidential</Text>
            <Caption style={{ marginTop: 2 }}>Only the pastors will see this request.</Caption>
          </View>
        </Pressable>

        {sent ? (
          <View style={styles.sent}><Ionicons name="checkmark-circle" size={18} color={colors.success} /><Small style={{ color: colors.success, marginLeft: 8 }}>Received. We’re praying with you.</Small></View>
        ) : null}
        <Button title="Send request" icon="paper-plane-outline" onPress={submit} disabled={text.trim().length < 5} />

        {prayers.length ? <SectionHeader eyebrow="History" title="My requests" /> : null}
        {prayers.map((p) => (
          <Card key={p.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Caption style={{ color: colors.gold, fontFamily: fonts.label, flex: 1 }}>{p.category}{p.confidential ? ' · Confidential' : ''}</Caption>
              <Caption>{timeAgo(p.createdAt)}</Caption>
            </View>
            <Small style={{ marginTop: 6, color: colors.text }}>{p.text}</Small>
            <Caption style={{ marginTop: 8 }}>Status: {p.status}</Caption>
          </Card>
        ))}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  bigQr: { alignSelf: 'center', marginTop: 28, padding: 16, borderRadius: 22, backgroundColor: '#F4F2EE' },
  ring: { width: 84, height: 84, borderRadius: 42, borderWidth: 1.5, borderColor: colors.goldLine, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  histRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  histDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 12 },
  toggle: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: 18 },
  toggleTitle: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text },
  sent: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
});
