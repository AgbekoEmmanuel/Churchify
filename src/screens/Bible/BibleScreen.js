// src/screens/Bible/BibleScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const OLD_TESTAMENT = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

const NEW_TESTAMENT = [
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const topButtons = [
  { label: 'Bible', key: 'bible' },
  { label: 'Discover', key: 'discover' },
  { label: 'Saved', key: 'saved' },
  { label: 'Plans', key: 'completed' },
];

export default function BibleScreen({ navigation }) {
  const [selected, setSelected] = useState('bible');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const onSelect = (key) => {
    if (key === 'discover') {
      navigation.navigate('Discover');
      return;
    }
    setSelected(key);
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={s.headerContainer}>
        <Text style={s.headerTitle}>Bible</Text>
        <TouchableOpacity style={s.searchButton}>
          <Ionicons name="search" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Top buttons */}
      <View style={s.topButtonsRow}>
        {topButtons.map(btn => (
          <TouchableOpacity
            key={btn.key}
            style={[s.topButton, selected === btn.key && s.topButtonActive]}
            onPress={() => onSelect(btn.key)}
            activeOpacity={0.8}
          >
            <Text style={[s.topButtonText, selected === btn.key && s.topButtonActiveText]}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Books list */}
        {selected === 'bible' && (
          <ScrollView
            style={s.booksScroll}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.sectionHeader}>Old Testament</Text>
            {OLD_TESTAMENT.map(book => (
              <TouchableOpacity key={book} style={s.bookRow} activeOpacity={0.7} onPress={() => navigation.navigate('BibleReader', { book })}>
                <View style={s.bookIcon}>
                  <Text style={s.bookIconText}>{book.substring(0, 2)}</Text>
                </View>
                <Text style={s.bookText}>{book}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.border} />
              </TouchableOpacity>
            ))}

            <Text style={s.sectionHeader}>New Testament</Text>
            {NEW_TESTAMENT.map(book => (
              <TouchableOpacity key={book} style={s.bookRow} activeOpacity={0.7} onPress={() => navigation.navigate('BibleReader', { book })}>
                <View style={[s.bookIcon, { backgroundColor: '#E0F2F1' }]}>
                  <Text style={[s.bookIconText, { color: '#00695C' }]}>{book.substring(0, 2)}</Text>
                </View>
                <Text style={s.bookText}>{book}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.border} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {selected === 'saved' && (
          <EmptyState icon="bookmark-outline" message="Your saved verses will appear here." />
        )}
        {selected === 'completed' && (
          <EmptyState icon="calendar-outline" message="Reading plans coming soon." />
        )}
      </Animated.View>
    </View>
  );
}

const EmptyState = ({ icon, message }) => (
  <View style={s.placeholder}>
    <View style={s.placeholderIcon}>
      <Ionicons name={icon} size={32} color={colors.textMuted} />
    </View>
    <Text style={s.placeholderText}>{message}</Text>
  </View>
);

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  topButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  topButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  topButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  topButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  topButtonActiveText: {
    color: '#fff',
  },
  booksScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  bookRow: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bookIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bookIconText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  bookText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  placeholderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
