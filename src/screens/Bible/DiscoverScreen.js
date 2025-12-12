// src/screens/Bible/DiscoverScreen.js
import React, { useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation} from '@react-navigation/native';

const actions = [
  { icon: 'book-outline', label: 'Plans' },
  { icon: 'play-circle-outline', label: 'Videos' },
  { icon: 'business-outline', label: 'Churches' },
  { icon: 'people-outline', label: 'Partners' },
];

const topics = [
  { label: 'Love', color: '#2094B9', image: 'https://i.pinimg.com/1200x/9c/17/1f/9c171f1d92592a3ffd64c954d53c9c8f.jpg' },
  { label: 'Anxiety', color: '#E43E8B', image: 'https://i.pinimg.com/736x/23/38/11/233811dc30e3c172ee7aac85e29a129f.jpg' },
  { label: 'Anger', color: '#BAB059', image: 'https://i.pinimg.com/1200x/d9/6c/52/d96c52b420035a01aafc0fed02b63be3.jpg' },
  { label: 'Hope', color: '#83775F', image: 'https://i.pinimg.com/736x/24/55/c3/2455c3da8b63139f110be522f044f68f.jpg' },
  { label: 'Depression', color: '#A4B78B', image: 'https://i.pinimg.com/736x/39/4a/cb/394acbeeca792e53ee1a660fd792f3f1.jpg' },
  { label: 'Peace', color: '#EC832C', image: 'https://i.pinimg.com/736x/3b/94/b2/3b94b20a6bad56cc2d956cd1f918e6b2.jpg' },
  { label: 'Fear', color: '#73B9EA', image: 'https://i.pinimg.com/736x/79/94/15/799415348959c1299c3b24902d2d7864.jpg' },
  { label: 'Stress', color: '#7EC8C9', image: 'https://i.pinimg.com/736x/28/e4/95/28e4952165a994121665a0e8cf1900cd.jpg' },
  { label: 'Patience', color: '#5369BB', image: 'https://i.pinimg.com/736x/e9/ce/ff/e9ceff87eae87309363bfbcc5b08a238.jpg' },
  { label: 'Temptation', color: '#4CAF50', image: 'https://i.pinimg.com/736x/af/5d/c3/af5dc3cfcdbaa8086b641972de1e6b75.jpg' },
];

const colors = {
  background: '#F5F9FC',
  surface: '#fff',
  border: '#D1DAE8',
  text: '#1B2445',
  textMuted: '#8A94B8',
  searchBg: '#F3F4F6',
  shadow: 'rgba(0,0,0,0.08)',
};

export default function DiscoverScreen() {
  const [search, setSearch] = useState('');
  
  const navigation = useNavigation();

  // Remove the useEffect entirely
  
  const handleBackPress = () => {
    console.log('Can go back:', navigation.canGoBack());
    console.log('Navigation state:', navigation.getState());
    navigation.navigate('Bible');
  };



 return (
  <View style={s.container}>
    {/* Header with back button */}
    <View style={s.headerRow}>
      <TouchableOpacity 
        style={s.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={s.header}>Discover</Text>
      <View style={s.placeholder} />
    </View>
    
      {/* Search */}
      <View style={s.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={s.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Actions */}
      <View style={s.actionsWrapper}>
        {actions.map(a => (
          <TouchableOpacity key={a.label} style={s.actionBtn} activeOpacity={0.85}>
            <Ionicons name={a.icon} size={20} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={s.actionBtnText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Topics */}
      <ScrollView style={s.topicsScroll} showsVerticalScrollIndicator={false}>
        <View style={s.topicGrid}>
          {topics.map(t => (
            <TouchableOpacity key={t.label} style={[s.topicItem, { backgroundColor: t.color }]} activeOpacity={0.9}>
              <Text style={s.topicLabel}>{t.label}</Text>
              <Image source={{ uri: t.image }} style={s.topicImage} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.searchBg,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  actionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 18,
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 10,
    flexBasis: '48%',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  actionBtnText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  topicsScroll: { flex: 1 },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 10,
  },
  topicItem: {
    width: '48%',
    minHeight: 90,
    borderRadius: 14,
    marginBottom: 14,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: colors.shadow,
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  topicLabel: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 10 },
  topicImage: { width: 54, height: 40, borderRadius: 5, alignSelf: 'flex-end', resizeMode: 'cover' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  placeholder: {
    width: 40,
  },
});
