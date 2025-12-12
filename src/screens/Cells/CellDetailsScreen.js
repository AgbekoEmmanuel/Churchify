import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function CellDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cell Details</Text>
      <Text style={styles.subtitle}>Members, updates, and targets will be shown here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: colors.secondary },
});
