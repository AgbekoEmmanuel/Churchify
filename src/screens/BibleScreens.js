import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { bibleBooks, bookById } from '../data/bibleBooks';
import { church } from '../data/church';
import {
  TRANSLATIONS, translationById, getChapter, loadHighlights, loadPrefs, refLabel, saveHighlights, savePrefs, step,
} from '../services/bible';
import { Button, Caption, Eyebrow, IconButton, PressScale, Small, tap } from '../components/ui';
import { colors, fonts, GUTTER, radius } from '../theme';

const SIZES = [16, 18, 20, 23];

/* ---------- Reader ---------- */

export function BibleScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const params = route.params || {};
  const [prefs, setPrefs] = useState(null);
  const [verses, setVerses] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [highlights, setHighlights] = useState({});
  const [toast, setToast] = useState(null);
  const [showVersions, setShowVersions] = useState(false);
  const scroll = useRef(null);
  const ys = useRef({});
  const target = useRef(null);

  // Initial position: route params (e.g. from "Word for today") or last read.
  useEffect(() => {
    loadPrefs().then((p) => setPrefs(params.bookId ? { ...p, bookId: params.bookId, chapter: params.chapter || 1 } : p));
    loadHighlights().then(setHighlights);
  }, []);

  // Jump requested from the picker or another screen.
  useEffect(() => {
    if (!params.bookId || !prefs) return;
    if (params.bookId !== prefs.bookId || (params.chapter || 1) !== prefs.chapter) {
      setPrefs((p) => ({ ...p, bookId: params.bookId, chapter: params.chapter || 1 }));
    }
    target.current = params.verse || null;
    if (params.verse) setSelected(Array.from({ length: (params.verseEnd || params.verse) - params.verse + 1 }, (_, i) => params.verse + i));
  }, [!!prefs, params.bookId, params.chapter, params.verse, params.nonce]);

  const load = useCallback(async () => {
    if (!prefs) return;
    setVerses(null);
    setError(null);
    ys.current = {};
    try {
      const v = await getChapter(prefs.translation, prefs.bookId, prefs.chapter);
      setVerses(v);
    } catch (e) {
      setError(e.message === 'busy' || e.message === 'failed' ? e.message : 'offline');
    }
  }, [prefs && prefs.translation, prefs && prefs.bookId, prefs && prefs.chapter]);

  useEffect(() => {
    if (!prefs) return;
    savePrefs(prefs);
    load();
    if (!target.current) {
      setSelected([]);
      scroll.current && scroll.current.scrollTo({ y: 0, animated: false });
    }
  }, [prefs && prefs.translation, prefs && prefs.bookId, prefs && prefs.chapter]);

  useEffect(() => { if (prefs) savePrefs(prefs); }, [prefs && prefs.fontSize]);

  const onVerseLayout = (n, y) => {
    ys.current[n] = y;
    if (target.current === n && scroll.current) {
      scroll.current.scrollTo({ y: Math.max(0, y - 80), animated: true });
      target.current = null;
    }
  };

  if (!prefs) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  const book = bookById(prefs.bookId);
  const tr = translationById(prefs.translation);
  const hlKey = (n) => `${prefs.bookId}.${prefs.chapter}.${n}`;
  const go = (dir) => {
    const s = step(prefs.bookId, prefs.chapter, dir);
    if (s) { target.current = null; setPrefs((p) => ({ ...p, ...s })); }
  };
  const toggleVerse = (n) => { tap(); setSelected((sel) => (sel.includes(n) ? sel.filter((x) => x !== n) : [...sel, n])); };
  const selectedText = () => {
    const v = [...selected].sort((a, b) => a - b).map((n) => verses.find((x) => x.n === n)).filter(Boolean);
    return `“${v.map((x) => x.text).join(' ')}”\n— ${refLabel(prefs.bookId, prefs.chapter, selected)} (${tr.short})`;
  };
  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 1600); };
  const copy = async () => { await Clipboard.setStringAsync(selectedText()); flash('Copied'); setSelected([]); };
  const share = () => Share.share({ message: `${selectedText()}\n\n${church.name} ${church.hashtag}` });
  const allHighlighted = selected.length && selected.every((n) => highlights[hlKey(n)]);
  const highlight = () => {
    const next = { ...highlights };
    selected.forEach((n) => { if (allHighlighted) delete next[hlKey(n)]; else next[hlKey(n)] = 1; });
    setHighlights(next);
    saveHighlights(next);
    setSelected([]);
  };
  const chooseTranslation = (id) => { setShowVersions(false); target.current = null; setPrefs((p) => ({ ...p, translation: id })); };
  const cycleSize = () => setPrefs((p) => ({ ...p, fontSize: SIZES[(SIZES.indexOf(p.fontSize) + 1) % SIZES.length] }));
  const fs = prefs.fontSize;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Top bar */}
      <View style={[styles.bar, { paddingTop: insets.top + 6 }]}>
        <View style={{ width: 40 }}>
          {navigation.canGoBack() ? <IconButton icon="chevron-back" onPress={() => navigation.goBack()} /> : null}
        </View>
        <PressScale onPress={() => navigation.navigate('BiblePicker', { bookId: prefs.bookId })} style={styles.refBtn}>
          <Text numberOfLines={1} style={styles.refText}>{book.name} {prefs.chapter}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.gold} />
        </PressScale>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <PressScale onPress={() => setShowVersions(true)} style={[styles.pill, { flexDirection: 'row', gap: 4 }]}>
            <Text style={styles.pillText}>{tr.short}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
          </PressScale>
          <PressScale onPress={cycleSize} style={styles.pill}><Text style={[styles.pillText, { fontFamily: fonts.serif }]}>Aa</Text></PressScale>
        </View>
      </View>

      <ScrollView ref={scroll} contentContainerStyle={{ paddingHorizontal: GUTTER + 4, paddingTop: 24, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <Eyebrow>{tr.name}</Eyebrow>
        <Text style={styles.chapterTitle}>{book.name}</Text>
        <Text style={styles.chapterNum}>Chapter {prefs.chapter}</Text>

        {error ? (
          <View style={styles.state}>
            <Ionicons name={error === 'busy' ? 'hourglass-outline' : 'cloud-offline-outline'} size={30} color={colors.gold} />
            <Text style={styles.stateTitle}>{error === 'busy' ? 'One moment…' : error === 'failed' ? 'Couldn’t load this chapter' : 'You’re offline'}</Text>
            <Small style={{ textAlign: 'center', marginTop: 6 }}>
              {error === 'busy' ? 'The Bible service is busy. Try again in a few seconds.' : error === 'failed' ? 'This version isn’t available for this chapter right now. Try again or pick another version.' : 'Chapters you have opened before are saved for offline reading. Connect to the internet to open new ones.'}
            </Small>
            <Button title="Try again" size="sm" variant="secondary" onPress={load} style={{ marginTop: 16, paddingHorizontal: 22 }} />
          </View>
        ) : !verses ? (
          <ActivityIndicator color={colors.gold} style={{ marginTop: 50 }} />
        ) : (
          <View style={{ marginTop: 18 }}>
            {verses.map((v) => {
              const sel = selected.includes(v.n);
              const hl = highlights[hlKey(v.n)];
              return (
                <Pressable key={v.n} onPress={() => toggleVerse(v.n)} onLayout={(e) => onVerseLayout(v.n, e.nativeEvent.layout.y)}
                  style={[styles.verse, hl && styles.verseHl, sel && styles.verseSel]}>
                  <Text maxFontSizeMultiplier={1.4} style={[styles.verseText, { fontSize: fs, lineHeight: Math.round(fs * 1.62) }]}>
                    <Text style={[styles.vnum, { fontSize: Math.round(fs * 0.62) }]}>{v.n}  </Text>
                    {v.text}
                  </Text>
                </Pressable>
              );
            })}
            <View style={styles.nav}>
              <PressScale onPress={() => go(-1)} style={styles.navBtn} disabled={!step(prefs.bookId, prefs.chapter, -1)}>
                <Ionicons name="chevron-back" size={18} color={colors.text} />
                <Text style={styles.navText}>Previous</Text>
              </PressScale>
              <PressScale onPress={() => go(1)} style={[styles.navBtn, { backgroundColor: colors.gold, borderColor: colors.gold }]} disabled={!step(prefs.bookId, prefs.chapter, 1)}>
                <Text style={[styles.navText, { color: '#141008' }]}>Next chapter</Text>
                <Ionicons name="chevron-forward" size={18} color="#141008" />
              </PressScale>
            </View>
            <Caption style={{ textAlign: 'center', marginTop: 18, color: colors.textFaint }}>{tr.name}{tr.pd ? ' · Public domain' : ` · © ${tr.short} copyright holder`}</Caption>
          </View>
        )}
      </ScrollView>

      {/* Verse actions */}
      {selected.length ? (
        <View style={[styles.actions, { bottom: Math.max(insets.bottom, 10) + 10 }]}>
          <Text numberOfLines={1} style={styles.actionsRef}>{refLabel(prefs.bookId, prefs.chapter, selected)}</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Action icon="copy-outline" label="Copy" onPress={copy} />
            <Action icon="share-social-outline" label="Share" onPress={share} />
            <Action icon={allHighlighted ? 'color-wand' : 'color-wand-outline'} label={allHighlighted ? 'Unmark' : 'Highlight'} onPress={highlight} />
            <Action icon="close" label="Clear" onPress={() => setSelected([])} />
          </View>
        </View>
      ) : null}
      <VersionSheet visible={showVersions} current={tr.id} onClose={() => setShowVersions(false)} onChoose={chooseTranslation} bottom={insets.bottom} />
      {toast ? <View style={[styles.toast, { bottom: insets.bottom + 30 }]}><Text style={styles.toastText}>{toast}</Text></View> : null}
    </View>
  );
}

// Dropdown of Bible versions.
function VersionSheet({ visible, current, onChoose, onClose, bottom }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.vBackdrop} onPress={onClose} />
      <View style={[styles.vSheet, { paddingBottom: bottom + 16 }]} pointerEvents="box-none">
        <View style={styles.vCard}>
          <Text style={styles.vTitle}>Bible version</Text>
          <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
            {TRANSLATIONS.map((t) => {
              const on = t.id === current;
              return (
                <PressScale key={t.id} disabled={!!t.unavailable} onPress={() => onChoose(t.id)} style={[styles.vRow, on && styles.vRowOn, t.unavailable && { opacity: 0.45 }]}>
                  <View style={[styles.vBadge, on && { backgroundColor: colors.gold, borderColor: colors.gold }]}>
                    <Text style={[styles.vBadgeText, on && { color: '#141008' }]}>{t.short}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.vName}>{t.name}</Text>
                    {t.unavailable ? <Caption style={{ marginTop: 2 }}>{t.unavailable}</Caption> : null}
                  </View>
                  {on ? <Ionicons name="checkmark" size={20} color={colors.gold} /> : null}
                </PressScale>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Action({ icon, label, onPress }) {
  return (
    <PressScale onPress={onPress} style={{ flex: 1, alignItems: 'center' }}>
      <Ionicons name={icon} size={20} color={colors.text} />
      <Text style={styles.actionLabel}>{label}</Text>
    </PressScale>
  );
}

/* ---------- Book & chapter picker ---------- */

export function BiblePickerScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [testament, setTestament] = useState(() => ((bookById(route.params && route.params.bookId) || {}).testament || 'OT'));
  const [open, setOpen] = useState(route.params && route.params.bookId);
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? bibleBooks.filter((b) => b.name.toLowerCase().includes(s)) : bibleBooks.filter((b) => b.testament === testament);
  }, [q, testament]);
  const choose = (bookId, chapter) => navigation.navigate('Bible', { bookId, chapter, nonce: Date.now() });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.pickHead, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.pickTitle}>Books</Text>
        <IconButton icon="close" onPress={() => navigation.goBack()} />
      </View>
      <View style={{ paddingHorizontal: GUTTER }}>
        <View style={styles.search}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Find a book" placeholderTextColor={colors.textMuted} style={styles.searchInput} autoCorrect={false} />
        </View>
        {!q ? (
          <View style={styles.seg}>
            {[['OT', 'Old Testament'], ['NT', 'New Testament']].map(([id, label]) => (
              <PressScale key={id} onPress={() => setTestament(id)} style={[styles.segBtn, testament === id && styles.segOn]}>
                <Text style={[styles.segText, testament === id && { color: '#141008' }]}>{label}</Text>
              </PressScale>
            ))}
          </View>
        ) : null}
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: GUTTER, paddingBottom: insets.bottom + 40 }} keyboardShouldPersistTaps="handled">
        {list.map((b) => (
          <View key={b.id}>
            <PressScale onPress={() => (b.chapters === 1 ? choose(b.id, 1) : setOpen(open === b.id ? null : b.id))} style={styles.bookRow}>
              <Text style={[styles.bookName, open === b.id && { color: colors.gold }]}>{b.name}</Text>
              <Caption>{b.chapters} {b.chapters === 1 ? 'chapter' : 'chapters'}</Caption>
              <Ionicons name={open === b.id ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} style={{ marginLeft: 8 }} />
            </PressScale>
            {open === b.id && b.chapters > 1 ? (
              <View style={styles.grid}>
                {Array.from({ length: b.chapters }, (_, i) => i + 1).map((c) => (
                  <PressScale key={c} onPress={() => choose(b.id, c)} style={styles.cell}>
                    <Text style={styles.cellText}>{c}</Text>
                  </PressScale>
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingBottom: 10, backgroundColor: colors.bg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  refBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 38, borderRadius: radius.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.borderStrong, maxWidth: 190 },
  refText: { fontFamily: fonts.label, fontSize: 14, color: colors.text, flexShrink: 1 },
  pill: { minWidth: 42, height: 34, paddingHorizontal: 10, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  pillText: { fontFamily: fonts.label, fontSize: 12, color: colors.textSecondary },
  chapterTitle: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 42, color: colors.text, marginTop: 8 },
  chapterNum: { fontFamily: fonts.label, fontSize: 13, color: colors.textMuted, marginTop: 2, letterSpacing: 0.5 },
  verse: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3, marginHorizontal: -6 },
  verseHl: { backgroundColor: 'rgba(214,174,94,0.16)' },
  verseSel: { backgroundColor: 'rgba(255,255,255,0.07)', borderLeftWidth: 2, borderLeftColor: colors.gold },
  verseText: { fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }), color: colors.text },
  // Only the web preview needs a tight line-height on the verse number; on Android a
  // nested lineHeight shrinks the whole verse and the lines overlap.
  vnum: { fontFamily: fonts.label, color: colors.gold, ...(Platform.OS === 'web' ? { lineHeight: 10 } : null) },
  nav: { flexDirection: 'row', gap: 10, marginTop: 30 },
  navBtn: { flex: 1, height: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  navText: { fontFamily: fonts.label, fontSize: 14, color: colors.text },
  state: { alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
  stateTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.text, marginTop: 12 },
  actions: { position: 'absolute', left: 14, right: 14, padding: 14, borderRadius: 20, backgroundColor: '#1A1712', borderWidth: 1, borderColor: colors.goldLine },
  actionsRef: { fontFamily: fonts.label, fontSize: 13, color: colors.gold, textAlign: 'center' },
  actionLabel: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  vBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  vSheet: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12, alignItems: 'center' },
  vCard: { width: '100%', maxWidth: 420, borderRadius: 24, backgroundColor: colors.bgRaised, borderWidth: 1, borderColor: colors.borderStrong, padding: 10 },
  vTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 },
  vRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 14 },
  vRowOn: { backgroundColor: colors.goldSoft },
  vBadge: { minWidth: 52, height: 30, paddingHorizontal: 8, borderRadius: 9, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  vBadgeText: { fontFamily: fonts.label, fontSize: 12, color: colors.textSecondary },
  vName: { fontFamily: fonts.subheading, fontSize: 15, color: colors.text },
  toast: { position: 'absolute', alignSelf: 'center', paddingHorizontal: 18, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.text },
  toastText: { fontFamily: fonts.label, fontSize: 13, color: '#0B0B0C' },
  pickHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: GUTTER, paddingBottom: 10 },
  pickTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.text },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.text, outlineStyle: 'none' },
  seg: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 6 },
  segBtn: { flex: 1, height: 38, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  segText: { fontFamily: fonts.label, fontSize: 13, color: colors.textSecondary },
  bookRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  bookName: { flex: 1, fontFamily: fonts.subheading, fontSize: 16, color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 14 },
  cell: { width: 52, height: 46, borderRadius: 12, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  cellText: { fontFamily: fonts.label, fontSize: 15, color: colors.text },
});
