import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

// Replace with live links from your church backend later
const LINKS = [
  { id: 'yt', label: 'YouTube Live', url: 'https://www.youtube.com/' },
  { id: 'fb', label: 'Facebook Live', url: 'https://www.facebook.com/live' },
  { id: 'tk', label: 'TikTok Live', url: 'https://www.tiktok.com/live' },
];

export default function LiveStreamsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={LINKS}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.item} onPress={() => Linking.openURL(item.url)}>
            <Ionicons name="play" size={20} color={colors.primary} />
            <Text style={s.text}>{item.label}</Text>
            <Ionicons name="open-outline" size={18} color={colors.secondary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  item: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 10
  },
  text: { flex: 1, color: colors.text, fontWeight: '700' },
});
