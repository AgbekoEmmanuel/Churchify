import React, { useMemo, useState } from 'react';
import { Linking, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { church } from '../data/church';
import { formatLongDate } from '../services/schedule';
import YouTubePlayer from '../components/YouTubePlayer';
import { Body, Button, Caption, Field, H1, Header, IconButton, Screen, SectionHeader, Small, Tag } from '../components/ui';
import { SermonRow } from '../components/blocks';
import { colors, fonts, radius } from '../theme';

export default function SermonScreen({ route, navigation }) {
  const { sermon } = route.params;
  const { isMember } = useAuth();
  const { sermons, notes, saveNote } = useStore();
  const existing = useMemo(() => notes.find((n) => n.sermonId === sermon.id), [notes, sermon.id]);
  const [draft, setDraft] = useState(existing ? existing.body : '');
  const [saved, setSaved] = useState(false);
  const more = sermons.filter((s) => s.id !== sermon.id && s.title !== sermon.title).slice(0, 4);

  const save = () => {
    saveNote({ id: existing && existing.id, sermonId: sermon.id, title: sermon.title, body: draft });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header
        onBack={() => navigation.goBack()}
        eyebrow={sermon.kind}
        title="Now playing"
        right={<IconButton icon="share-outline" onPress={() => Share.share({ message: `${sermon.title} — ${sermon.speaker}\n${sermon.url}\n\n${church.name}` })} />}
      />
      <YouTubePlayer videoId={sermon.id} />
      <Screen edges={[]} contentStyle={{ paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Tag label={sermon.kind} />
          {sermon.isFull ? <Tag label="Full service" color={colors.textSecondary} /> : null}
        </View>
        <H1 style={{ marginTop: 12 }}>{sermon.title}</H1>
        <Small style={{ marginTop: 6 }}>{sermon.speaker} · {formatLongDate(sermon.published)}</Small>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
          <Button title="YouTube" icon="logo-youtube" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => Linking.openURL(sermon.url)} />
          <Button title="Give" icon="wallet-outline" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => navigation.navigate('Give')} />
        </View>

        <SectionHeader eyebrow="Your notes" title="Take notes" />
        {isMember ? (
          <View>
            <Field
              placeholder="What is the Holy Spirit saying to you through this message?"
              multiline
              value={draft}
              onChangeText={setDraft}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {saved ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Caption style={{ color: colors.success, marginLeft: 6 }}>Saved to your notes</Caption>
                </View>
              ) : <Caption style={{ flex: 1 }}>Private to you · synced to your Notes</Caption>}
              <Button title="Save note" size="sm" onPress={save} disabled={!draft.trim()} style={{ paddingHorizontal: 18 }} />
            </View>
          </View>
        ) : (
          <View style={styles.locked}>
            <Ionicons name="lock-closed" size={16} color={colors.gold} />
            <Text style={styles.lockedText}>Sign in as a member to keep sermon notes.</Text>
          </View>
        )}

        {more.length ? <SectionHeader eyebrow="Keep watching" title="More messages" /> : null}
        {more.map((s) => <SermonRow key={s.id} sermon={s} onPress={() => navigation.push('Sermon', { sermon: s })} />)}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  locked: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  lockedText: { fontFamily: fonts.body, fontSize: 14, color: colors.textSecondary, flex: 1 },
});
