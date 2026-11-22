import React, { useState } from 'react';
import { Dimensions, Image, Linking, Share, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { brand, church } from '../data/church';
import { articlesBy, newsCategories } from '../data/news';
import { formatShortDate, formatLongDate } from '../services/schedule';
import { BackFab, Body, Caption, Display, Eyebrow, H1, H2, H3, Header, IconButton, PressScale, Screen, Small } from '../components/ui';
import { colors, fonts, radius } from '../theme';

const W0 = Math.min(Dimensions.get('window').width, 430);

/* ---------- Home block: two segment tiles ---------- */
export function BusinessHealthTiles({ onOpen }) {
  return (
    <View style={styles.tiles}>
      {['business', 'health'].map((k) => {
        const c = newsCategories[k];
        const latest = articlesBy(k)[0];
        return (
          <PressScale key={k} onPress={() => onOpen(k)} style={styles.tile}>
            <Image source={latest.image} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <LinearGradient colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.05)', c.gradient[1] + 'F5']} locations={[0, 0.3, 0.88]} style={StyleSheet.absoluteFill} />
            <View style={[styles.tileIcon, { backgroundColor: c.accent + '22', borderColor: c.accent + '66' }]}>
              <Ionicons name={c.icon} size={18} color={c.accent} />
            </View>
            <View style={{ marginTop: 'auto' }}>
              <Text style={[styles.tileLabel, { color: c.accent }]}>{c.label.toUpperCase()}</Text>
              <Text style={styles.tileHeadline} numberOfLines={3}>{latest.title}</Text>
            </View>
          </PressScale>
        );
      })}
    </View>
  );
}

/* ---------- Article cards ---------- */
function FeatureCard({ a, onPress }) {
  const c = newsCategories[a.category];
  return (
    <PressScale onPress={onPress} style={styles.feature}>
      <Image source={a.image} style={styles.featureImg} resizeMode="cover" />
      <LinearGradient colors={['rgba(6,6,7,0)', 'rgba(6,6,7,0.65)', colors.surface]} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
        <View style={[styles.pill, { borderColor: c.accent + '80', backgroundColor: c.accent + '22' }]}>
          <Ionicons name={c.icon} size={11} color={c.accent} />
          <Text style={[styles.pillText, { color: c.accent }]}>{c.label.toUpperCase()} · LATEST</Text>
        </View>
        <H2 style={{ marginTop: 10 }} numberOfLines={3}>{a.title}</H2>
        <Caption style={{ marginTop: 6, color: colors.textSecondary }}>{formatShortDate(a.date)} · {a.readMins} min read</Caption>
      </View>
    </PressScale>
  );
}

function ArticleRow({ a, onPress }) {
  const c = newsCategories[a.category];
  return (
    <PressScale onPress={onPress} style={styles.row}>
      <Image source={a.image} style={styles.rowImg} resizeMode="cover" />
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={[styles.rowCat, { color: c.accent }]}>{c.label.toUpperCase()}</Text>
        <H3 numberOfLines={2} style={{ fontSize: 15, marginTop: 3 }}>{a.title}</H3>
        <Caption numberOfLines={2} style={{ marginTop: 4 }}>{a.summary}</Caption>
      </View>
    </PressScale>
  );
}

/* ---------- Hub ---------- */
export function NewsScreen({ route, navigation }) {
  const [tab, setTab] = useState((route.params && route.params.tab) || 'business');
  const c = newsCategories[tab];
  const list = articlesBy(tab);
  const open = (a) => navigation.navigate('Article', { id: a.id });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} title="Business & Health" />
      <Screen edges={[]} contentStyle={{ paddingTop: 18 }}>
        <Eyebrow>Every Sunday at {church.short}</Eyebrow>
        <Display style={{ marginTop: 6 }}>Business{'\n'}& Health</Display>
        <Body style={{ marginTop: 8 }}>
          The ambidextrous mandate in practice — spiritual and earthly principles, balanced for dominion.
        </Body>

        {/* segmented switch */}
        <View style={styles.seg}>
          {['business', 'health'].map((k) => {
            const on = tab === k;
            const cc = newsCategories[k];
            return (
              <PressScale key={k} onPress={() => setTab(k)} style={[styles.segBtn, on && { backgroundColor: cc.accent }]}>
                <Ionicons name={cc.icon} size={15} color={on ? '#0B0B0C' : colors.textSecondary} />
                <Text style={[styles.segText, on && { color: '#0B0B0C' }]}>{cc.label}</Text>
              </PressScale>
            );
          })}
        </View>

        {/* category banner */}
        <LinearGradient colors={c.gradient} style={[styles.banner, { borderColor: c.accent + '55' }]}>
          <Image source={brand.mark} style={styles.bannerMark} resizeMode="contain" />
          <View style={[styles.bannerIcon, { backgroundColor: c.accent + '22' }]}>
            <Ionicons name={c.icon} size={22} color={c.accent} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <H3 style={{ color: colors.text }}>{c.title}</H3>
            <Small style={{ marginTop: 3, color: colors.textSecondary }}>{c.tagline}</Small>
          </View>
        </LinearGradient>

        <View style={{ marginTop: 18 }}>
          <FeatureCard a={list[0]} onPress={() => open(list[0])} />
        </View>

        {list.length > 1 ? <Text style={styles.more}>MORE {c.label.toUpperCase()}</Text> : null}
        {list.slice(1).map((a) => <ArticleRow key={a.id} a={a} onPress={() => open(a)} />)}

        {tab === 'health' ? (
          <Caption style={{ marginTop: 18, lineHeight: 18 }}>
            Health content is general wellbeing information, not medical advice. Please see a qualified health
            professional about any personal health concerns.
          </Caption>
        ) : null}
      </Screen>
    </View>
  );
}

/* ---------- Reader ---------- */
export function ArticleScreen({ route, navigation }) {
  const { id } = route.params;
  const all = [...articlesBy('business'), ...articlesBy('health')];
  const a = all.find((x) => x.id === id);
  const c = newsCategories[a.category];
  const [w, setW] = useState(W0);
  const heroH = Math.round(w * 0.72);
  const next = all.filter((x) => x.category === a.category && x.id !== a.id).slice(0, 2);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      <Screen padded={false} edges={[]}>
        <View style={{ height: heroH, overflow: 'hidden', backgroundColor: colors.surface }}>
          <Image source={a.image} style={{ width: w, height: heroH }} resizeMode="cover" />
          <LinearGradient colors={['rgba(6,6,7,0.55)', 'rgba(6,6,7,0)', colors.bg]} locations={[0, 0.3, 1]} style={StyleSheet.absoluteFill} />
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: -28 }}>
          <View style={[styles.pill, { borderColor: c.accent + '80', backgroundColor: c.accent + '22' }]}>
            <Ionicons name={c.icon} size={11} color={c.accent} />
            <Text style={[styles.pillText, { color: c.accent }]}>{c.title.toUpperCase()}</Text>
          </View>
          <H1 style={{ marginTop: 12 }}>{a.title}</H1>
          <Caption style={{ marginTop: 8 }}>{formatLongDate(a.date)} · {a.readMins} min read</Caption>

          <View style={styles.facts}>
            {a.keyFacts.map((f) => (
              <View key={f.label} style={[styles.fact, { borderColor: c.accent + '40' }]}>
                <Text style={[styles.factValue, { color: c.accent }]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.75}>{f.value}</Text>
                <Text style={styles.factLabel} numberOfLines={2}>{f.label}</Text>
              </View>
            ))}
          </View>

          {a.body.map((p, i) => (
            <Body key={i} style={{ marginTop: 14, fontSize: 16, lineHeight: 26, color: i === 0 ? colors.text : colors.textSecondary }}>{p}</Body>
          ))}

          <View style={[styles.takeaways, { borderColor: c.accent + '55' }]}>
            <Text style={[styles.takeTitle, { color: c.accent }]}>{a.category === 'business' ? 'WHAT THIS MEANS FOR YOU' : 'TRY THIS WEEK'}</Text>
            {a.takeaways.map((t) => (
              <View key={t} style={styles.takeRow}>
                <Ionicons name="checkmark-circle" size={18} color={c.accent} style={{ marginTop: 1 }} />
                <Text style={styles.takeText}>{t}</Text>
              </View>
            ))}
          </View>

          <Caption style={{ marginTop: 18 }}>{a.imageCredit}</Caption>
          {a.sources.length ? (
            <View style={{ marginTop: 10 }}>
              <Caption>Sources:</Caption>
              {a.sources.map((s) => (
                <Text key={s.url} style={styles.source} onPress={() => Linking.openURL(s.url)}>{s.name} ↗</Text>
              ))}
            </View>
          ) : (
            <Caption style={{ marginTop: 10, lineHeight: 18 }}>General wellbeing information, not medical advice.</Caption>
          )}

          {next.length ? <Text style={styles.more}>KEEP READING</Text> : null}
          {next.map((x) => <ArticleRow key={x.id} a={x} onPress={() => navigation.push('Article', { id: x.id })} />)}
        </View>
      </Screen>
      <BackFab onPress={() => navigation.goBack()} />
      <BackFab icon="share-outline" right onPress={() => Share.share({ message: `${a.title}\n\n${a.summary}\n\n— ${church.name} Business & Health` })} />
    </View>
  );
}

const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', gap: 12 },
  tile: { flex: 1, height: 200, borderRadius: radius.lg, overflow: 'hidden', padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tileIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  tileLabel: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 1.8 },
  tileHeadline: { fontFamily: fonts.subheading, fontSize: 14, lineHeight: 19, color: colors.text, marginTop: 6 },

  seg: { flexDirection: 'row', padding: 4, marginTop: 22, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  segBtn: { flex: 1, height: 42, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  segText: { fontFamily: fonts.label, fontSize: 14, color: colors.textSecondary },

  banner: { flexDirection: 'row', alignItems: 'center', marginTop: 16, padding: 16, borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  bannerMark: { position: 'absolute', right: -24, top: -18, width: 120, height: 110, opacity: 0.08, tintColor: '#fff' },
  bannerIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

  feature: { height: 300, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  featureImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1 },
  pillText: { fontFamily: fonts.label, fontSize: 9.5, letterSpacing: 1.2 },

  more: { fontFamily: fonts.label, fontSize: 11, letterSpacing: 2, color: colors.textMuted, marginTop: 28, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  rowImg: { width: 96, height: 76, borderRadius: 12, backgroundColor: colors.surface2 },
  rowCat: { fontFamily: fonts.label, fontSize: 9.5, letterSpacing: 1.4 },

  facts: { flexDirection: 'row', gap: 8, marginTop: 18 },
  fact: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, alignItems: 'center' },
  factValue: { fontFamily: fonts.display, fontSize: 15, textAlign: 'center' },
  factLabel: { fontFamily: fonts.bodyMedium, fontSize: 10.5, color: colors.textMuted, marginTop: 4, textAlign: 'center' },

  takeaways: { marginTop: 22, padding: 16, borderRadius: radius.lg, backgroundColor: colors.bgRaised, borderWidth: 1 },
  takeTitle: { fontFamily: fonts.label, fontSize: 11, letterSpacing: 1.8, marginBottom: 6 },
  takeRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  takeText: { flex: 1, fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: colors.text },
  source: { fontFamily: fonts.label, fontSize: 13, color: colors.gold, marginTop: 6 },
});
