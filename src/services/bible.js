import AsyncStorage from '@react-native-async-storage/async-storage';
import { bibleBooks, bookById } from '../data/bibleBooks';

// Bible text for the reader.
//  - Public-domain versions (KJV, WEB, BBE) come from bible-api.com.
//  - Modern versions (AMP, ESV, NKJV, MSG, NLT, NASB, GNT, RSV) come from bolls.life.
//    These translations are copyrighted by their publishers. Before the app is
//    published in the stores, the church should license them (e.g. through
//    API.Bible / the publishers) and switch `bolls` below to that provider.
//  - NIV is not offered: its publisher (Biblica) has not licensed it for this use.
// Every chapter a member opens is cached on the phone, so it reads offline next
// time. Reading position, font size, version and highlights are kept on device.

export const TRANSLATIONS = [
  { id: 'kjv', short: 'KJV', name: 'King James Version', provider: 'bibleapi', pd: true },
  { id: 'nkjv', short: 'NKJV', name: 'New King James Version', provider: 'bolls', code: 'NKJV' },
  { id: 'amp', short: 'AMP', name: 'Amplified Bible', provider: 'bolls', code: 'AMP' },
  { id: 'esv', short: 'ESV', name: 'English Standard Version', provider: 'bolls', code: 'ESV' },
  { id: 'msg', short: 'MSG', name: 'The Message', provider: 'bolls', code: 'MSG' },
  { id: 'nlt', short: 'NLT', name: 'New Living Translation', provider: 'bolls', code: 'NLT' },
  { id: 'nasb', short: 'NASB', name: 'New American Standard Bible', provider: 'bolls', code: 'NASB' },
  { id: 'gnt', short: 'GNT', name: 'Good News Translation', provider: 'bolls', code: 'GNT' },
  { id: 'rsv', short: 'RSV', name: 'Revised Standard Version', provider: 'bolls', code: 'RSV' },
  { id: 'web', short: 'WEB', name: 'World English Bible', provider: 'bibleapi', pd: true },
  { id: 'bbe', short: 'BBE', name: 'Bible in Basic English', provider: 'bibleapi', pd: true },
];

export const translationById = (id) => TRANSLATIONS.find((t) => t.id === id) || TRANSLATIONS[0];

const CACHE = 'tbc.bible.ch.';
const PREFS = 'tbc.bible.prefs.v1';
const HIGHLIGHTS = 'tbc.bible.hl.v1';

const memory = {};

// Strip Strong's numbers, footnotes and formatting tags some sources include.
const clean = (t) => String(t || '')
  .replace(/<S>\d+<\/S>/g, '')
  .replace(/<sup>[\s\S]*?<\/sup>/g, '')
  .replace(/<br\s*\/?>/g, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();

async function fetchJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(res.status === 429 ? 'busy' : 'failed');
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

export async function getChapter(translation, bookId, chapter) {
  const tr = translationById(translation);
  if (tr.unavailable) throw new Error('unavailable');
  const key = `${tr.id}.${bookId}.${chapter}`;
  if (memory[key]) return memory[key];
  try {
    const cached = await AsyncStorage.getItem(CACHE + key);
    if (cached) return (memory[key] = JSON.parse(cached));
  } catch (e) {}
  let verses;
  if (tr.provider === 'bolls') {
    const bookNo = bibleBooks.findIndex((b) => b.id === bookId) + 1;
    const json = await fetchJson(`https://bolls.life/get-text/${tr.code}/${bookNo}/${chapter}/`);
    verses = (Array.isArray(json) ? json : []).map((v) => ({ n: v.verse, text: clean(v.text) })).filter((v) => v.text);
  } else {
    const json = await fetchJson(`https://bible-api.com/data/${tr.id}/${bookId}/${chapter}`);
    verses = (json.verses || []).map((v) => ({ n: v.verse, text: clean(v.text) }));
  }
  if (!verses.length) throw new Error('failed');
  memory[key] = verses;
  AsyncStorage.setItem(CACHE + key, JSON.stringify(verses)).catch(() => {});
  return verses;
}

export async function loadPrefs() {
  try {
    const raw = await AsyncStorage.getItem(PREFS);
    if (raw) return { translation: 'kjv', bookId: 'JHN', chapter: 1, fontSize: 18, ...JSON.parse(raw) };
  } catch (e) {}
  return { translation: 'kjv', bookId: 'JHN', chapter: 1, fontSize: 18 };
}
export const savePrefs = (p) => AsyncStorage.setItem(PREFS, JSON.stringify(p)).catch(() => {});

export async function loadHighlights() {
  try { return JSON.parse((await AsyncStorage.getItem(HIGHLIGHTS)) || '{}'); } catch (e) { return {}; }
}
export const saveHighlights = (h) => AsyncStorage.setItem(HIGHLIGHTS, JSON.stringify(h)).catch(() => {});

// Next / previous chapter, crossing book boundaries.
export function step(bookId, chapter, dir) {
  const i = bibleBooks.findIndex((b) => b.id === bookId);
  const book = bibleBooks[i];
  if (dir > 0) {
    if (chapter < book.chapters) return { bookId, chapter: chapter + 1 };
    if (i < bibleBooks.length - 1) return { bookId: bibleBooks[i + 1].id, chapter: 1 };
  } else {
    if (chapter > 1) return { bookId, chapter: chapter - 1 };
    if (i > 0) return { bookId: bibleBooks[i - 1].id, chapter: bibleBooks[i - 1].chapters };
  }
  return null;
}

// "Nehemiah 4:17", "1 John 3:1-3", "Psalm 23" → { bookId, chapter, verse, verseEnd }
export function parseRef(ref = '') {
  const m = String(ref).trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:\s*[-–]\s*(\d+))?)?$/);
  if (!m) return null;
  const name = m[1].toLowerCase().replace(/^psalm$/, 'psalms').replace(/^song of songs$/, 'song of solomon');
  const book = bibleBooks.find((b) => b.name.toLowerCase() === name || b.id.toLowerCase() === name);
  if (!book) return null;
  return { bookId: book.id, chapter: Number(m[2]), verse: m[3] ? Number(m[3]) : null, verseEnd: m[4] ? Number(m[4]) : null };
}

export const refLabel = (bookId, chapter, verses) => {
  const name = (bookById(bookId) || {}).name || bookId;
  if (!verses || !verses.length) return `${name} ${chapter}`;
  const v = [...verses].sort((a, b) => a - b);
  const contiguous = v.every((n, i) => i === 0 || n === v[i - 1] + 1);
  return `${name} ${chapter}:${contiguous && v.length > 1 ? `${v[0]}-${v[v.length - 1]}` : v.join(',')}`;
};
