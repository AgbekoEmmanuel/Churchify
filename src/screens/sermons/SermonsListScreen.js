// src/screens/sermons/SermonsListScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import VideoCard from '../../components/Media/VideoCard';

export default function SermonsListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const sermons = [
    {
      id: '1',
      title: 'Faith Over Fear',
      speaker: 'Pastor John Doe',
      date: 'Aug 4, 2025',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
      duration: '45:20',
      views: '1.2K',
      category: 'Sermon',
      description: 'Understanding how faith conquers all fear in our daily lives.'
    },
    {
      id: '2',
      title: 'Walking in Grace',
      speaker: 'Pastor Jane Smith',
      date: 'Aug 11, 2025',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      duration: '38:15',
      views: '850',
      category: 'Grace',
      description: 'A powerful message on the sufficiency of God\'s grace.'
    },
    {
      id: '3',
      title: 'The Power of Prayer',
      speaker: 'Pastor John Doe',
      date: 'July 21, 2025',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      duration: '52:00',
      views: '2.5K',
      category: 'Prayer',
      description: 'Unlock the potential of your prayer life.'
    },
    {
      id: '4',
      title: 'Kingdom Finance',
      speaker: 'Bishop David',
      date: 'July 14, 2025',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      duration: '1:05:00',
      views: '5.1K',
      category: 'Finance',
      description: 'Biblical principles for financial stewardship.'
    }
  ];

  // Filter by search
  const filteredSermons = sermons.filter(
    (sermon) =>
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header Search */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search sermons..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredSermons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <VideoCard
              video={item}
              onPress={() => navigation.navigate('SermonDetails', { video: item })}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
