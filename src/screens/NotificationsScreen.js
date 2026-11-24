import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useCelebrations } from '../context/CelebrationsContext';
import {
  DEFAULT_PREFS, SUPPORTED, TOPICS, getPermission, loadNotifyPrefs, onNotificationTap, requestPermission, rescheduleAll, saveNotifyPrefs, sendTest,
} from '../services/notifications';
import { parseRef } from '../services/bible';
import { Body, Button, Caption, Card, Eyebrow, H3, Header, IconButton, PressScale, Screen, Small } from '../components/ui';
import { colors, fonts, radius } from '../theme';

/* ---------- Shared state + scheduling ---------- */

const Ctx = createContext(null);

export function NotificationsProvider({ children, navigationRef }) {
  const { isMember } = useAuth();
  const { rsvps } = useStore();
  const { birthdays } = useCelebrations();
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [permission, setPermission] = useState('undetermined');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([loadNotifyPrefs(), getPermission()]).then(([p, perm]) => { setPrefs(p); setPermission(perm); setReady(true); });
  }, []);

  // Keep the phone's scheduled reminders in step with prefs and RSVPs.
  useEffect(() => {
    if (ready && permission === 'granted') rescheduleAll(prefs, { isMember, rsvps, celebrations: { birthdays } });
  }, [ready, permission, prefs, isMember, rsvps, birthdays]);

  // Tapping a notification opens the right screen.
  useEffect(() => onNotificationTap((data) => {
    const nav = navigationRef && navigationRef.current;
    if (!nav || !data.route) return;
    if (data.route === 'Bible' && data.ref) nav.navigate('Bible', { ...(parseRef(data.ref) || {}), nonce: Date.now() });
    else if (data.route === 'Home') nav.navigate('Tabs', { screen: 'Home' });
    else nav.navigate(data.route);
  }), [navigationRef]);

  const update = useCallback((patch) => {
    setPrefs((p) => { const n = { ...p, ...patch }; saveNotifyPrefs(n); return n; });
  }, []);

  const enable = useCallback(async () => {
    const status = await requestPermission();
    setPermission(status);
    update({ asked: true });
    return status;
  }, [update]);

  return <Ctx.Provider value={{ prefs, permission, ready, update, enable }}>{children}</Ctx.Provider>;
}

export const useNotifications = () => useContext(Ctx) || { prefs: DEFAULT_PREFS, permission: 'unsupported', ready: false, update: () => {}, enable: async () => 'unsupported' };

/* ---------- Soft prompt on Home ---------- */

export function NotificationPrompt() {
  const { prefs, permission, ready, update, enable } = useNotifications();
  if (!SUPPORTED || !ready || permission === 'granted' || prefs.asked) return null;
  return (
    <Card style={styles.prompt}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={styles.promptIcon}><Ionicons name="notifications" size={20} color={colors.gold} /></View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <H3>Never miss service</H3>
          <Small style={{ marginTop: 4 }}>Get a reminder before service, a nudge when we go live, and the Word each morning.</Small>
        </View>
        <IconButton icon="close" size={30} filled={false} color={colors.textMuted} onPress={() => update({ asked: true })} />
      </View>
      <Button title="Turn on notifications" icon="notifications-outline" size="md" onPress={enable} style={{ marginTop: 14 }} />
    </Card>
  );
}

/* ---------- Settings screen ---------- */

export default function NotificationsScreen({ navigation }) {
  const { isMember } = useAuth();
  const { prefs, permission, update, enable } = useNotifications();
  const [tested, setTested] = useState(false);
  const on = permission === 'granted';
  const topics = TOPICS.filter((t) => isMember || !t.membersOnly);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} eyebrow="Settings" title="Notifications" />
      <Screen edges={[]} contentStyle={{ paddingTop: 18 }}>
        {!SUPPORTED ? (
          <Card style={styles.status}>
            <Ionicons name="phone-portrait-outline" size={22} color={colors.gold} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <H3>Available on the phone app</H3>
              <Small style={{ marginTop: 4 }}>Reminders are delivered by your phone. Open the app on iPhone or Android to turn them on.</Small>
            </View>
          </Card>
        ) : on ? (
          <Card style={[styles.status, { borderColor: 'rgba(91,214,155,0.3)' }]}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <H3>Notifications are on</H3>
              <Small style={{ marginTop: 4 }}>Choose what you’d like to hear about.</Small>
            </View>
          </Card>
        ) : (
          <Card style={styles.status}>
            <Ionicons name="notifications-off-outline" size={22} color={colors.gold} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <H3>Notifications are off</H3>
              <Small style={{ marginTop: 4 }}>
                {permission === 'denied' ? 'They’re blocked in your phone settings. Allow them there for “The Balance Church”.' : 'Turn them on so we can remind you before service.'}
              </Small>
              {permission === 'denied' ? (
                <Button title="Open phone settings" size="sm" variant="secondary" onPress={() => Linking.openSettings()} style={{ marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 16 }} />
              ) : (
                <Button title="Turn on" icon="notifications-outline" size="sm" onPress={enable} style={{ marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 18 }} />
              )}
            </View>
          </Card>
        )}

        <Eyebrow style={{ marginTop: 26, marginBottom: 6 }}>Remind me about</Eyebrow>
        {topics.map((t, i) => (
          <View key={t.key} style={[styles.row, i === topics.length - 1 && { borderBottomWidth: 0 }, !on && SUPPORTED && { opacity: 0.5 }]}>
            <View style={styles.rowIcon}><Ionicons name={t.icon} size={18} color={colors.gold} /></View>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Text style={styles.rowTitle}>{t.title}</Text>
              <Caption style={{ marginTop: 2 }}>{t.body}</Caption>
            </View>
            <Switch
              value={!!prefs[t.key]}
              onValueChange={(v) => update({ [t.key]: v })}
              disabled={!on}
              trackColor={{ false: colors.surface3, true: colors.goldDeep }}
              thumbColor={prefs[t.key] ? colors.goldBright : '#888'}
              ios_backgroundColor={colors.surface3}
            />
          </View>
        ))}

        {on ? (
          <PressScale onPress={async () => { await sendTest(); setTested(true); }} style={styles.test}>
            <Ionicons name={tested ? 'checkmark' : 'paper-plane-outline'} size={16} color={colors.text} />
            <Text style={styles.testText}>{tested ? 'Test sent — check in a few seconds' : 'Send me a test notification'}</Text>
          </PressScale>
        ) : null}

        <View style={styles.note}>
          <Ionicons name="megaphone-outline" size={14} color={colors.textMuted} />
          <Caption style={{ flex: 1, marginLeft: 8 }}>
            Church-wide announcements from the office will also arrive here once the app is connected to the church system.
          </Caption>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  prompt: { marginTop: 18, borderColor: colors.goldLine, backgroundColor: '#14110A' },
  promptIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  status: { flexDirection: 'row', alignItems: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  rowIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontFamily: fonts.label, fontSize: 15, color: colors.text },
  test: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, height: 46, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface },
  testText: { fontFamily: fonts.label, fontSize: 13, color: colors.text },
  note: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 24, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
});
