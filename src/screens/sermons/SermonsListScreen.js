// src/screens/sermons/SermonsListScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import colors from '../../theme/colors';


export default function SermonsListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const sermons = [
    {
      id: '1',
      title: 'Faith Over Fear',
      pastor: 'Pastor John Doe',
      date: '2025-08-04',
      youtube: 'https://www.youtube.com/watch?v=abc123XYZ',
      spotify: 'https://open.spotify.com/track/xyz456ABC'
    },
    {
      id: '2',
      title: 'Walking in Grace',
      pastor: 'Pastor Jane Smith',
      date: '2025-08-11',
      youtube: 'https://www.youtube.com/watch?v=def456LMN',
      spotify: 'https://open.spotify.com/track/lmn789DEF'
    },
    {
      id: '3',
      title: 'The Power of Prayer',
      pastor: 'Pastor John Doe',
      date: '2025-07-21',
      youtube: 'https://www.youtube.com/watch?v=ghi789OPQ',
      spotify: 'https://open.spotify.com/track/opq123GHI'
    }
  ];

  // Filter by search
  const filteredSermons = sermons.filter(
    (sermon) =>
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.pastor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sermonItem}
      onPress={() => navigation.navigate('SermonDetails', { sermon: item })}
    >
      <Text style={styles.sermonTitle}>{item.title}</Text>
      <Text style={styles.sermonMeta}>
        {item.pastor} • {new Date(item.date).toDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by title or pastor..."
        placeholderTextColor={colors.secondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredSermons}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16
  },
  searchBar: {
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    color: colors.text
  },
  sermonItem: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8
  },
  sermonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary
  },
  sermonMeta: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 4
  }
});
