import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function CreateCellScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Cell</Text>
      <Text style={styles.subtitle}>Form for creating a cell will go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: colors.secondary },
});
