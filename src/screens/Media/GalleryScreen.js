import React from 'react';
import { View, Image, FlatList, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const W = Dimensions.get('window').width;
const SIZE = (W - 16*2 - 8*2) / 3;

const PHOTOS = [
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
];

export default function GalleryScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={PHOTOS}
        keyExtractor={(u, i) => i.toString()}
        numColumns={3}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ width: SIZE, height: SIZE, borderRadius: 8, marginBottom: 8 }} />
        )}
      />
    </View>
  );
}
