import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const STORAGE_KEY = 'quietTimes';

export default function NewQuietTimeScreen({ navigation, route }) {
  const edit = route?.params?.edit || null;

  const [title, setTitle] = useState(edit?.title || '');
  const [scripture, setScripture] = useState(edit?.scripture || '');
  const [notes, setNotes] = useState(edit?.notes || '');
  const [cover, setCover] = useState(edit?.cover || '');

  useEffect(() => {
    navigation.setOptions({ title: edit ? 'Edit Quiet Time' : 'Add Quiet Time' });
  }, [navigation, edit]);

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a title');
      return;
    }
    const newItem = {
      id: edit?.id || Date.now().toString(),
      title: title.trim(),
      scripture: scripture.trim(),
      notes: notes.trim(),
      cover: cover.trim(),
      date: edit?.date || new Date().toISOString(),
    };
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      let next;
      if (edit) {
        next = list.map(it => (it.id === edit.id ? newItem : it));
      } else {
        next = [newItem, ...list];
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save quiet time');
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <Text style={s.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Quiet Time Title"
        placeholderTextColor={colors.textMuted}
        style={s.input}
      />

      <Text style={s.label}>Scripture</Text>
      <TextInput
        value={scripture}
        onChangeText={setScripture}
        placeholder="e.g., Psalm 23:1-6"
        placeholderTextColor={colors.textMuted}
        style={s.input}
      />

      <Text style={s.label}>Notes</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Write your devotional thoughts, prayers, key points…"
        placeholderTextColor={colors.textMuted}
        multiline
        textAlignVertical="top"
        style={[s.input, { height: 160 }]}
      />

      <Text style={s.label}>Cover Image (URL)</Text>
      <TextInput
        value={cover}
        onChangeText={setCover}
        placeholder="https://example.com/cover.jpg"
        placeholderTextColor={colors.textMuted}
        style={s.input}
      />

      <TouchableOpacity style={s.saveBtn} onPress={onSave} activeOpacity={0.9}>
        <Ionicons name="save-outline" color="#fff" size={18} />
        <Text style={s.saveText}>{edit ? 'Save Changes' : 'Save Quiet Time'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  label: { color: colors.text, fontWeight: '700', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 6,
  },
  saveBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
