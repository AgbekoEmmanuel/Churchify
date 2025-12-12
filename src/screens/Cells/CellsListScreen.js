import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';


export default function CellsListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cell Groups</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CellDetails')}
      >
        <Text style={styles.buttonText}>Go to Cell Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateCell')}
      >
        <Text style={styles.buttonText}>Create New Cell</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.primary, 
    marginBottom: 40 
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    width: '50%',
    alignItems: 'center'
  },
  buttonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600'
  }
});
