// WelcomeSplash.js
import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar'; // Add this import

export default function WelcomeSplash({ navigation }) {
  useEffect(() => {
    if (Platform.OS === "android") {
      // Set navigation bar transparent with light buttons (for dark background)
      NavigationBar.setBackgroundColorAsync("transparent");
      NavigationBar.setButtonStyleAsync("light");
    }

    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/736x/ac/2a/72/ac2a72034b9e449453b5f91a4dc6dece.jpg' }}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: '100%' },
});
