// src/screens/Bible/BibleScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';

const OLD_TESTAMENT = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah",
  "Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah",
  "Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah",
  "Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
];

const NEW_TESTAMENT = [
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians",
  "Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians",
  "1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter",
  "1 John","2 John","3 John","Jude","Revelation"
];

const topButtons = [
  { label: 'Bible', key: 'bible' },
  { label: 'Discover', key: 'discover' },
  { label: 'Saved', key: 'saved' },
  { label: 'Completed', key: 'completed' },
];

const colors = {
  primary: '#0E5686',
  background: '#F5F9FC',
  surface: '#FFFFFF',
  border: '#D1DAE8',
  text: '#1B2445',
  textMuted: '#8A94B8',
};

export default function BibleScreen({ navigation }) {
  const [selected, setSelected] = useState('bible');

  const onSelect = (key) => {
    if (key === 'discover') {
      navigation.navigate('Discover');
      return;
    }
    setSelected(key);
  };

  return (
    <View style={s.container}>
    

      {/* Top buttons */}
      <View style={s.topButtonsRow}>
        {topButtons.map(btn => (
          <TouchableOpacity
            key={btn.key}
            style={[s.topButton, selected === btn.key && s.topButtonActive]}
            onPress={() => onSelect(btn.key)}
            activeOpacity={0.85}
          >
            <Text style={[s.topButtonText, selected === btn.key && s.topButtonActiveText]}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Books list */}
      {selected === 'bible' && (
        <ScrollView
          style={s.booksScroll}
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.sectionHeader}>Old Testament</Text>
          {OLD_TESTAMENT.map(book => (
            <TouchableOpacity key={book} style={s.bookRow} activeOpacity={0.85}>
              <Text style={s.bookText}>{book}</Text>
            </TouchableOpacity>
          ))}

          <Text style={s.sectionHeader}>New Testament</Text>
          {NEW_TESTAMENT.map(book => (
            <TouchableOpacity key={book} style={s.bookRow} activeOpacity={0.85}>
              <Text style={s.bookText}>{book}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {selected === 'saved' && (
        <View style={s.placeholder}><Text style={s.placeholderText}>Saved coming soon…</Text></View>
      )}
      {selected === 'completed' && (
        <View style={s.placeholder}><Text style={s.placeholderText}>Completed coming soon…</Text></View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 8,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginLeft: 16,
    marginBottom: 12,
  },
  topButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  topButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  topButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  topButtonText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  topButtonActiveText: {
    color: '#fff',
  },
  booksScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  bookRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  placeholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textMuted, fontSize: 16,
  },
});
