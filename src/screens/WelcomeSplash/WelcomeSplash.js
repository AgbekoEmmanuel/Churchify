// WelcomeSplash.js
import React, { useEffect, useRef } from 'react';
import { View, ImageBackground, StyleSheet, Platform, Text, Animated, ActivityIndicator } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

export default function WelcomeSplash({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === "android") {
      // Set navigation bar transparent with light buttons (for dark background)
      NavigationBar.setBackgroundColorAsync("transparent");
      NavigationBar.setButtonStyleAsync("light");
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

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
      >
        <LinearGradient
          colors={['transparent', 'rgba(14, 86, 134, 0.8)']}
          style={styles.overlay}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Welcome Home</Text>
            <Text style={styles.subtitle}>Preparing your personalized experience...</Text>
            <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: '100%' },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 80,
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
    textAlign: 'center',
  },
  loader: {
    marginTop: 10,
  },
});
