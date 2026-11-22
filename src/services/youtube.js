import { youtube } from '../data/church';
import { sermonSeed } from '../data/content';

// Titles look like: "Buying Dominion || 18th November 2026 || Midweek Service || Apostle Michael Dadzie ||TBC"
export function parseSermon({ id, raw, published }) {
  const parts = raw.split(/\|+/).map((p) => p.trim()).filter(Boolean);
  const title = parts[0] || raw;
  const typePart = parts.find((p) => /service|prayer|intense|edition|conference/i.test(p));
  let kind = 'Message';
  if (/sunday/i.test(typePart || '')) kind = 'Sunday Service';
  else if (/midweek/i.test(typePart || '')) kind = 'Midweek';
  else if (/prayer/i.test(typePart || '')) kind = 'Prayer';
  else if (/edition|conference/i.test(typePart || '')) kind = 'Special';
  const isFull = /service|prayer/i.test(typePart || '');
  return {
    id,
    title,
    kind,
    isFull,
    speaker: 'Apostle Michael Dadzie',
    published,
    thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    thumbMax: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${id}`,
  };
}

export const seedSermons = sermonSeed.map(parseSermon);

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// Pulls the channel's public RSS feed. Browsers block this cross-origin, so on
// web (and when offline) we fall back to the bundled seed list.
export async function fetchSermons() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtube.channelId}`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error('feed ' + res.status);
    const xml = await res.text();
    const items = [];
    const re = /<entry>[\s\S]*?<yt:videoId>(.*?)<\/yt:videoId>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<published>(.*?)<\/published>/g;
    let m;
    while ((m = re.exec(xml))) items.push(parseSermon({ id: m[1], raw: decode(m[2]), published: m[3].slice(0, 10) }));
    return items.length ? items : seedSermons;
  } catch (e) {
    return seedSermons;
  }
}
