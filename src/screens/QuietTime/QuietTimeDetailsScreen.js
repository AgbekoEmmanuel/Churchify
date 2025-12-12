import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Share, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function QuietTimeDetailsScreen({ route, navigation }) {
  const { item, isMine } = route.params || {};

  const onShare = async () => {
    try {
      await Share.share({
        message: `${item.title}\n${item.scripture ? item.scripture + '\n' : ''}${item.notes || ''}`,
      });
    } catch {}
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={s.headerRow}>
        <Text style={s.title}>{item.title}</Text>
        <View style={s.actions}>
          {isMine && (
            <TouchableOpacity onPress={() => navigation.navigate('NewQuietTime', { edit: item })} style={s.actionBtn}>
              <Ionicons name="create-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onShare} style={s.actionBtn}>
            <Ionicons name="share-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {!!item.cover && <Image source={{ uri: item.cover }} style={s.cover} />}

      {!!item.scripture && (
        <View style={s.scriptureWrap}>
          <Ionicons name="book-outline" size={16} color={colors.primary} />
          <Text style={s.scriptureText}>{item.scripture}</Text>
        </View>
      )}

      {!!item.notes && <Text style={s.notes}>{item.notes}</Text>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, flex: 1, paddingRight: 10 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 8, borderRadius: 8, backgroundColor: colors.cardSecondary || '#F5F9FC' },
  cover: { width: '100%', height: 200, borderRadius: 12, marginBottom: 14 },
  scriptureWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  scriptureText: { color: colors.primary, fontWeight: '800' },
  notes: { fontSize: 16, color: colors.textSecondary, lineHeight: 24, marginTop: 6 },
});
