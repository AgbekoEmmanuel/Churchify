import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { services } from '../data/church';
import { dailyWords, events } from '../data/content';
import { upcomingCelebrations } from '../screens/CelebrationsScreen';

// Reminders the app schedules on the phone itself (they work offline and need no
// server): service reminders, "we're live", the daily word, birthdays in the
// church family and reminders for events a member has RSVP'd to.
//
// Church-wide announcements sent by the office ("remote" push) need the backend
// and a store build of the app. The seam for that is registerForRemotePush below.

export const SUPPORTED = Platform.OS !== 'web';
const PREFS = 'tbc.notify.v1';

export const DEFAULT_PREFS = { services: true, live: true, dailyWord: true, celebrations: true, events: true, asked: false };

export const TOPICS = [
  { key: 'services', icon: 'time-outline', title: 'Service reminders', body: '30 minutes before Sunday and midweek service.' },
  { key: 'live', icon: 'radio-outline', title: 'We’re live', body: 'When the livestream starts.' },
  { key: 'dailyWord', icon: 'book-outline', title: 'Word for today', body: 'A scripture every morning at 6:30.' },
  { key: 'celebrations', icon: 'gift-outline', title: 'Birthdays', body: 'When someone in the church family has a birthday.', membersOnly: true },
  { key: 'events', icon: 'calendar-outline', title: 'Events you’re attending', body: 'A day before and on the day.', membersOnly: true },
];

if (SUPPORTED) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
  });
}

export async function loadNotifyPrefs() {
  try { return { ...DEFAULT_PREFS, ...JSON.parse((await AsyncStorage.getItem(PREFS)) || '{}') }; } catch (e) { return DEFAULT_PREFS; }
}
export const saveNotifyPrefs = (p) => AsyncStorage.setItem(PREFS, JSON.stringify(p)).catch(() => {});

export async function getPermission() {
  if (!SUPPORTED) return 'unsupported';
  try { return (await Notifications.getPermissionsAsync()).status; } catch (e) { return 'undetermined'; }
}

export async function requestPermission() {
  if (!SUPPORTED) return 'unsupported';
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Church reminders',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#D6AE5E',
      vibrationPattern: [0, 200, 120, 200],
    }).catch(() => {});
  }
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status;
  } catch (e) {
    return 'denied';
  }
}

// Church time is GMT (Accra). Convert a service's UTC day/time to the phone's
// local weekday (1 = Sunday … 7 = Saturday, as expo-notifications expects).
function localWeekly(day, hour, minute, offsetMin = 0) {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, minute));
  d.setUTCDate(d.getUTCDate() + ((day - d.getUTCDay() + 7) % 7));
  d.setTime(d.getTime() + offsetMin * 60000);
  return { weekday: d.getDay() + 1, hour: d.getHours(), minute: d.getMinutes() };
}

const at = (date, h, m) => { const d = new Date(date); d.setHours(h, m, 0, 0); return d; };

// Cancel everything and schedule from the member's current preferences.
export async function rescheduleAll(prefs, { isMember = false, rsvps = [], celebrations } = {}) {
  if (!SUPPORTED) return 0;
  if ((await getPermission()) !== 'granted') return 0;
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
  const jobs = [];
  const T = Notifications.SchedulableTriggerInputTypes;
  const now = Date.now();

  for (const s of services) {
    if (prefs.services) {
      jobs.push({
        content: { title: `${s.name} in 30 minutes`, body: 'Get ready, invite someone, and come expecting. See you at the Dome of Excellence!', data: { route: 'Live' } },
        trigger: { type: T.WEEKLY, ...localWeekly(s.day, s.hour, s.minute, -30) },
      });
    }
    if (prefs.live) {
      jobs.push({
        content: { title: `🔴 ${s.name} is live`, body: 'Tap to join the livestream in the app.', data: { route: 'Live' } },
        trigger: { type: T.WEEKLY, ...localWeekly(s.day, s.hour, s.minute, 2) },
      });
    }
  }

  // Next 14 mornings, each with that day's scripture.
  if (prefs.dailyWord) {
    for (let i = 0; i < 14; i++) {
      const day = new Date(now + i * 86400000);
      const when = at(day, 6, 30);
      if (when.getTime() <= now) continue;
      const w = dailyWords[when.getUTCDate() % dailyWords.length];
      jobs.push({
        content: { title: 'Word for today', body: `“${w.text}” — ${w.ref}`, data: { route: 'Bible', ref: w.ref } },
        trigger: { type: T.DATE, date: when },
      });
    }
  }

  if (isMember && prefs.celebrations) {
    const byDay = {};
    upcomingCelebrations(30, celebrations).forEach((c) => { (byDay[c.in] = byDay[c.in] || []).push(c); });
    Object.entries(byDay).forEach(([inDays, list]) => {
      const when = at(new Date(now + Number(inDays) * 86400000), 8, 0);
      if (when.getTime() <= now) return;
      const names = list.map((c) => c.title);
      const label = names.length > 2 ? `${names.slice(0, 2).join(', ')} and ${names.length - 2} more` : names.join(' and ');
      jobs.push({
        content: { title: '🎉 Celebrating today', body: `${label} — send a wish in the app.`, data: { route: 'Celebrations' } },
        trigger: { type: T.DATE, date: when },
      });
    });
  }

  if (isMember && prefs.events) {
    events.filter((e) => rsvps.includes(e.id)).forEach((e) => {
      const start = new Date(e.date);
      const dayBefore = at(new Date(start.getTime() - 86400000), 18, 0);
      const twoHours = new Date(start.getTime() - 2 * 3600000);
      [[dayBefore, `Tomorrow: ${e.title}`], [twoHours, `Starting soon: ${e.title}`]].forEach(([when, title]) => {
        if (when.getTime() > now) jobs.push({ content: { title, body: `${e.venue || 'The Balance Church'} · tap for details.`, data: { route: 'Events' } }, trigger: { type: T.DATE, date: when } });
      });
    });
  }

  // iOS keeps at most 64 pending notifications.
  const list = jobs.slice(0, 60);
  for (const j of list) {
    await Notifications.scheduleNotificationAsync({ content: { sound: 'default', ...j.content }, trigger: Platform.OS === 'android' ? { ...j.trigger, channelId: 'default' } : j.trigger }).catch(() => {});
  }
  return list.length;
}

export async function sendTest() {
  if (!SUPPORTED) return;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'The Balance Church', body: 'Notifications are on. We’ll remind you before service. #whereGodlives', data: { route: 'Home' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3, ...(Platform.OS === 'android' ? { channelId: 'default' } : {}) },
  });
}

export function onNotificationTap(handler) {
  if (!SUPPORTED) return () => {};
  const sub = Notifications.addNotificationResponseReceivedListener((r) => handler(r.notification.request.content.data || {}));
  return () => sub.remove();
}

// Remote push for announcements from the church office. Needs a development /
// store build with an EAS projectId and the backend storing each member's token.
export async function registerForRemotePush(projectId) {
  if (!SUPPORTED || !projectId) return null;
  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data; // → save against the member in the backend
  } catch (e) {
    return null;
  }
}
