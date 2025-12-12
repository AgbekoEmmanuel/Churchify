import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const STORAGE_KEY = 'quietTimes';

// Replace these covers with your images later
const GENERAL_QT = [
  {
    id: 'g1',
    title: 'Renewing the Mind',
    scripture: 'Romans 12:2',
    notes: 'Be transformed by the renewing of your mind...',
    date: new Date().toISOString(),
    cover: 'https://images.unsplash.com/photo-1520975960483-4f3b1fc5a55b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'g2',
    title: 'Peace in the Storm',
    scripture: 'Mark 4:39',
    notes: 'Jesus calms the storm — invite Him into your waves.',
    date: new Date(Date.now() - 86400000).toISOString(),
    cover: 'https://images.unsplash.com/photo-1501746877-14782f0b4b5a?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function QuietTimeScreen({ navigation }) {
  const [myQT, setMyQT] = useState([]);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setMyQT(raw ? JSON.parse(raw) : []);
    } catch (e) {
      console.warn('Load error', e);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const save = async (list) => {
    setMyQT(list);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Save error', e);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert('Delete', 'Remove this quiet time?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => save(myQT.filter(i => i.id !== id)) },
    ]);
  };

  const formatWhen = (iso) => {
    const d = new Date(iso);
    const today = new Date();
    const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diff = Math.floor((t0 - d0) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const Card = ({ item, isMine }) => (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('QuietTimeDetails', { item, isMine })}
    >
      <View style={s.cardTop}>
        <View style={s.dateChip}>
          <Ionicons name="calendar-outline" size={12} color={colors.primary} />
          <Text style={s.dateChipText}>{formatWhen(item.date)}</Text>
        </View>
        {isMine ? (
          <View style={s.row}>
            <TouchableOpacity
              onPress={() => navigation.navigate('NewQuietTime', { edit: item })}
              style={s.iconBtn}
            >
              <Ionicons name="create-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item.id)} style={s.iconBtn}>
              <Ionicons name="trash-outline" size={18} color={colors.danger || '#DC2626'} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.row}>
            <Ionicons name="open-outline" size={18} color={colors.textMuted} />
          </View>
        )}
      </View>

      {item.cover ? (
        <Image source={{ uri: item.cover }} style={s.cover} />
      ) : (
        <View style={[s.cover, { backgroundColor: colors.accent }]} />
      )}

      <Text style={s.title} numberOfLines={2}>{item.title}</Text>
      {!!item.scripture && <Text style={s.scripture}>{item.scripture}</Text>}
    </TouchableOpacity>
  );

  const listData = [
    { header: 'General Quiet Times' },
    ...GENERAL_QT.map(i => ({ ...i, src: 'general' })),
    { header: 'My Quiet Times' },
    ...myQT.map(i => ({ ...i, src: 'mine' })),
  ];

  const renderItem = ({ item }) => {
    if (item.header) return <Text style={s.sectionHeader}>{item.header}</Text>;
    return <Card item={item} isMine={item.src === 'mine'} />;
  };

  return (
    <View style={s.container}>
      <FlatList
        data={listData}
        keyExtractor={(it, idx) => it.header ? `h-${idx}` : it.id}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate('NewQuietTime')}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 },
  sectionHeader: { marginTop: 16, marginBottom: 8, fontWeight: '800', fontSize: 16, color: colors.primary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 6, marginLeft: 6, borderRadius: 8, backgroundColor: colors.cardSecondary || '#F5F9FC' },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.chip || '#E8F0F7', borderRadius: 999 },
  dateChipText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  cover: { width: '100%', height: 120, borderRadius: 10, marginTop: 4, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 4 },
  scripture: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});
