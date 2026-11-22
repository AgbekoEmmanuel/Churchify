import { services } from '../data/church';

// Accra is UTC+0 with no DST, so UTC maths == local church time.
function occurrence(service, from) {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), service.hour, service.minute));
  const diff = (service.day - d.getUTCDay() + 7) % 7;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

export function getServiceStatus(now = new Date()) {
  let live = null;
  let next = null;
  for (const s of services) {
    // check this week's occurrence (may be in the past) and the previous one for overlap
    for (const offset of [-7, 0, 7]) {
      const start = occurrence(s, now);
      start.setUTCDate(start.getUTCDate() + offset);
      const end = new Date(start.getTime() + s.durationMin * 60000);
      if (now >= start && now < end) live = { service: s, start, end };
      if (start > now && (!next || start < next.start)) next = { service: s, start };
    }
  }
  return { live, next };
}

export function countdownParts(target, now = new Date()) {
  let ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86400000); ms -= days * 86400000;
  const hours = Math.floor(ms / 3600000); ms -= hours * 3600000;
  const mins = Math.floor(ms / 60000); ms -= mins * 60000;
  const secs = Math.floor(ms / 1000);
  return { days, hours, mins, secs };
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatTime(date) {
  const d = new Date(date);
  let h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}
export const formatDay = (date) => DAYS[new Date(date).getUTCDay()];
export const formatShortDate = (date) => {
  const d = new Date(date);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
};
export const formatLongDate = (date) => {
  const d = new Date(date);
  return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};
export const monthShort = (date) => MONTHS[new Date(date).getUTCMonth()].toUpperCase();
export const dayNum = (date) => new Date(date).getUTCDate();

export function timeAgo(date) {
  const s = (Date.now() - new Date(date).getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  const d = Math.round(s / 86400);
  if (d < 7) return `${d}d ago`;
  return formatShortDate(date);
}

export function greeting(now = new Date()) {
  const h = now.getUTCHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
