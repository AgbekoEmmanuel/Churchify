import { spotify } from '../data/church';
import { podcastArtwork, podcastSeed } from '../data/podcastSeed';

// Sermon audio from the church podcast on Spotify. Spotify has no public API for
// playback, so the episodes are read from the show's public RSS feed (the same
// feed Spotify uses) and played in the app. "Open in Spotify" links to the show.

export { podcastArtwork };

const decode = (s = '') =>
  s
    .replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .trim();

const pick = (xml, re) => {
  const m = xml.match(re);
  return m ? m[1] : '';
};

export function durationToSeconds(d) {
  if (!d) return 0;
  if (/^\d+$/.test(d)) return Number(d);
  return d.split(':').map(Number).reduce((a, n) => a * 60 + n, 0);
}

export function formatClock(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

export function formatDuration(d) {
  const s = durationToSeconds(d);
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h ? `${h} hr ${m} min` : `${m} min`;
}

export function parseFeed(xml) {
  const show = pick(xml, /<itunes:image href="([^"]+)"/) || podcastArtwork;
  const items = xml.split('<item>').slice(1).map((chunk) => chunk.split('</item>')[0]);
  return items.map((it) => {
    const desc = decode(pick(it, /<description>([\s\S]*?)<\/description>/))
      .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      id: decode(pick(it, /<guid[^>]*>([\s\S]*?)<\/guid>/)),
      title: decode(pick(it, /<title>([\s\S]*?)<\/title>/)),
      description: desc.slice(0, 220),
      published: pick(it, /<pubDate>([\s\S]*?)<\/pubDate>/),
      duration: pick(it, /<itunes:duration>([\s\S]*?)<\/itunes:duration>/),
      audioUrl: decode(pick(it, /<enclosure url="([^"]+)"/)),
      image: pick(it, /<itunes:image href="([^"]+)"/) || show,
    };
  }).filter((e) => e.audioUrl);
}

export async function fetchEpisodes() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(spotify.rss, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error(String(res.status));
    const list = parseFeed(await res.text());
    return list.length ? list : podcastSeed;
  } catch (e) {
    return podcastSeed;
  }
}

export const seedEpisodes = podcastSeed;
