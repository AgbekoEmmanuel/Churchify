// src/screens/SermonDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import colors from '../../theme/colors';

import { FontAwesome } from '@expo/vector-icons';

export default function SermonDetailsScreen({ route }) {
  const { sermon } = route.params;

  // Example links — these can be dynamically passed via sermon object
  const youtubeLink = sermon.youtube || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const spotifyLink = sermon.spotify || 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb';

  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sermon.title}</Text>
      <Text style={styles.meta}>{sermon.pastor} • {sermon.date}</Text>

      {/* Action Icons */}
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openLink(youtubeLink)}>
          <FontAwesome name="youtube-play" size={32} color="#FF0000" />
          <Text style={styles.iconLabel}>Watch</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => openLink(spotifyLink)}>
          <FontAwesome name="spotify" size={32} color="#1DB954" />
          <Text style={styles.iconLabel}>Listen</Text>
        </TouchableOpacity>
      </View>

      {/* Sermon Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sermon Notes:</Text>
        <Text style={styles.sectionText}>
          Here are the detailed sermon notes. This can be expanded with more structured content later.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5
  },
  meta: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 20
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20
  },
  iconButton: {
    alignItems: 'center',
    marginRight: 25
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.secondary
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 5
  },
  sectionText: {
    fontSize: 16,
    color: colors.text
  }
});
