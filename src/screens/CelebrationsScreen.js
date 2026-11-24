import React, { useMemo, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { wishTemplates } from '../data/celebrations';
import { useCelebrations } from '../context/CelebrationsContext';
import { Avatar, Button, Caption, Eyebrow, H3, Header, PressScale, Screen, SectionHeader, Small, tap } from '../components/ui';
import { colors, fonts, radius } from '../theme';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Days from today until the next "MM-DD" (0 = today).
export function daysUntil(mmdd, now = new Date()) {
  const [m, d] = mmdd.split('-').map(Number);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(now.getFullYear(), m - 1, d);
  if (next < today) next = new Date(now.getFullYear() + 1, m - 1, d);
  return Math.round((next - today) / 86400000);
}

const whenLabel = (n, mmdd) => {
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  const [m, d] = mmdd.split('-').map(Number);
  const date = new Date(new Date().getFullYear(), m - 1, d);
  return n < 7 ? DAYS[date.getDay()] : `${d} ${MONTHS[m - 1].slice(0, 3)}`;
};

// Everyone with a birthday in the next `days` days, soonest first.
export function upcomingCelebrations(days = 7, { birthdays = [] } = {}, now = new Date()) {
  return birthdays
    .map((x) => ({ ...x, kind: 'birthday', title: x.name, in: daysUntil(x.date, now) }))
    .filter((x) => x.in <= days)
    .sort((p, q) => p.in - q.in || p.title.localeCompare(q.title));
}

/* ---------- Home strip ---------- */

export function CelebrationStrip({ onOpen, onWish }) {
  const data = useCelebrations();
  const list = useMemo(() => upcomingCelebrations(7, data), [data]);
  if (!list.length) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
      {list.map((c) => (
        <PressScale key={c.id} onPress={() => (c.in === 0 ? onWish(c) : onOpen())} style={[styles.chip, c.in === 0 && styles.chipToday]}>
          <Avatar name={c.title} size={46} />
          <Text numberOfLines={2} style={styles.chipName}>{c.title}</Text>
          <Text style={[styles.chipWhen, c.in === 0 && { color: colors.goldBright }]}>
            🎂 {whenLabel(c.in, c.date)}
          </Text>
        </PressScale>
      ))}
      <PressScale onPress={onOpen} style={[styles.chip, { justifyContent: 'center' }]}>
        <View style={styles.ringIcon}><Ionicons name="calendar-outline" size={20} color={colors.gold} /></View>
        <Text style={[styles.chipName, { color: colors.gold }]}>See all</Text>
      </PressScale>
    </ScrollView>
  );
}

/* ---------- Send-a-wish sheet ---------- */

export function WishSheet({ person, onClose }) {
  const insets = useSafeAreaInsets();
  const { member } = useAuth();
  const { sendWish } = useStore();
  const templates = wishTemplates;
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const close = () => { setSent(false); setText(''); onClose(); };
  const send = () => {
    sendWish({ to: person.id, toName: person.title, kind: person.kind, message: text.trim() || templates[0], from: member ? `${member.firstName} ${member.lastName}` : '' });
    tap('medium');
    setSent(true);
  };
  return (
    <Modal visible={!!person} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap} pointerEvents="box-none">
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.grab} />
          {person ? (
            sent ? (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text style={{ fontSize: 46 }}>🎉</Text>
                <Text style={styles.sheetTitle}>Wish sent!</Text>
                <Small style={{ textAlign: 'center', marginTop: 6 }}>{person.title} will see your message in the app.</Small>
                <Button title="Done" size="md" onPress={close} style={{ marginTop: 20, alignSelf: 'stretch' }} />
                <ConfettiCannon count={90} origin={{ x: Dimensions.get('window').width / 2, y: -20 }} fadeOut autoStart explosionSpeed={300} fallSpeed={2600} colors={['#D6AE5E', '#F0CB7C', '#FFFFFF', '#E0705A', '#6FD39B']} />
              </View>
            ) : (
              <>
                <Eyebrow>Birthday wish</Eyebrow>
                <Text style={styles.sheetTitle}>To {person.title}</Text>
                <View style={{ marginTop: 14, gap: 8 }}>
                  {templates.map((t) => (
                    <PressScale key={t} onPress={() => setText(t)} style={[styles.tpl, text === t && styles.tplOn]}>
                      <Text style={styles.tplText}>{t}</Text>
                    </PressScale>
                  ))}
                </View>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="…or write your own message"
                  placeholderTextColor={colors.textMuted}
                  multiline
                  style={styles.input}
                />
                <Button title="Send wish" icon="gift-outline" onPress={send} style={{ marginTop: 14 }} />
              </>
            )
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------- Full screen ---------- */

export default function CelebrationsScreen({ navigation }) {
  const [range, setRange] = useState(7);
  const [wish, setWish] = useState(null);
  const { wishes = [] } = useStore();
  const data = useCelebrations();
  const list = useMemo(() => upcomingCelebrations(range, data), [range, data]);
  const today = list.filter((c) => c.in === 0);
  const later = list.filter((c) => c.in > 0);
  const wished = (id) => wishes.some((w) => w.to === id && new Date(w.at).toDateString() === new Date().toDateString());

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} eyebrow="Church family" title="Birthdays" />
      <Screen edges={[]} contentStyle={{ paddingTop: 18 }}>
        <View style={styles.seg}>
          {[[7, 'This week'], [31, 'This month']].map(([n, label]) => (
            <PressScale key={n} onPress={() => setRange(n)} style={[styles.segBtn, range === n && styles.segOn]}>
              <Text style={[styles.segText, range === n && { color: '#141008' }]}>{label}</Text>
            </PressScale>
          ))}
        </View>

        <View style={styles.source}>
          <Ionicons name={data.source === 'church' ? 'cloud-done-outline' : 'flask-outline'} size={14} color={data.source === 'church' ? colors.success : colors.gold} />
          <Caption style={{ flex: 1, marginLeft: 8 }}>
            {data.source === 'church'
              ? `From the church birthday list${data.stale ? ' (saved copy — you’re offline)' : ''}`
              : 'Sample names — the church birthday list isn’t connected yet.'}
          </Caption>
        </View>

        {today.length ? (
          <>
            <SectionHeader eyebrow={new Date().toDateString().slice(0, 10)} title="Celebrating today" />
            {today.map((c) => (
              <LinearGradient key={c.id} colors={['#2A1D08', '#140E05']} style={styles.todayCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar name={c.title} size={56} />
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.todayKind}>🎂  HAPPY BIRTHDAY</Text>
                    <H3 style={{ marginTop: 4, fontSize: 18 }}>{c.title}</H3>
                    {c.fellowshipName ? <Caption style={{ marginTop: 2 }}>{c.fellowshipName} Fellowship</Caption> : null}
                  </View>
                </View>
                <Button
                  title={wished(c.id) ? 'Wish sent ✓' : 'Send a wish'}
                  icon={wished(c.id) ? undefined : 'gift-outline'}
                  variant={wished(c.id) ? 'secondary' : 'primary'}
                  size="md"
                  onPress={() => setWish(c)}
                  style={{ marginTop: 14 }}
                />
              </LinearGradient>
            ))}
          </>
        ) : null}

        <SectionHeader eyebrow="Coming up" title={range === 7 ? 'Later this week' : 'Next 30 days'} />
        {later.length ? later.map((c, i) => (
          <View key={c.id} style={[styles.row, i === later.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>{Number(c.date.split('-')[1])}</Text>
              <Text style={styles.dateMon}>{MONTHS[Number(c.date.split('-')[0]) - 1].slice(0, 3).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.rowName}>{c.title}</Text>
              <Caption style={{ marginTop: 2 }}>
                {c.fellowshipName ? `${c.fellowshipName} · ` : ''}{whenLabel(c.in, c.date)}
              </Caption>
            </View>
            <Text style={{ fontSize: 20 }}>🎂</Text>
          </View>
        )) : <Small style={{ marginTop: 4 }}>No other birthdays in this period.</Small>}

        <View style={styles.note}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
          <Caption style={{ flex: 1, marginLeft: 8 }}>Only members can see this list. We show the day and month only — never anyone’s age. To hide or add your date, message the church office.</Caption>
        </View>
      </Screen>
      <WishSheet person={wish} onClose={() => setWish(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { width: 104, marginRight: 10, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center', borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipToday: { borderColor: colors.goldLine, backgroundColor: '#17130B' },
  chipName: { fontFamily: fonts.label, fontSize: 12, lineHeight: 16, color: colors.text, textAlign: 'center', marginTop: 8 },
  chipWhen: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.textMuted, marginTop: 4 },
  ringIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.goldLine, alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, height: 40, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  segText: { fontFamily: fonts.label, fontSize: 13, color: colors.textSecondary },
  todayCard: { padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.goldLine, marginBottom: 12 },
  todayKind: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 1.6, color: colors.goldBright },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  dateBox: { width: 48, height: 52, borderRadius: 14, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontFamily: fonts.heading, fontSize: 18, color: colors.text },
  dateMon: { fontFamily: fonts.label, fontSize: 9, letterSpacing: 1, color: colors.gold },
  rowName: { fontFamily: fonts.label, fontSize: 15, color: colors.text },
  source: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  note: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 26, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.bgRaised, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, borderWidth: 1, borderColor: colors.border, width: '100%', maxWidth: 430, alignSelf: 'center' },
  grab: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontFamily: fonts.heading, fontSize: 22, color: colors.text, marginTop: 6 },
  tpl: { padding: 12, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tplOn: { borderColor: colors.gold, backgroundColor: colors.goldSoft },
  tplText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.text },
  input: { marginTop: 10, minHeight: 70, padding: 12, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, color: colors.text, fontFamily: fonts.body, fontSize: 14, textAlignVertical: 'top' },
});
