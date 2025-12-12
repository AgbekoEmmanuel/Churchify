// src/screens/Splash/Splash.js
import React, { useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  ImageBackground,
  Animated,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as NavigationBar from 'expo-navigation-bar'; // Add this import

export default function Splash() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // First useEffect - configure StatusBar & Navigation Bar & loop rotation
  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
      StatusBar.setBarStyle("light-content");
      
      // Set navigation bar transparent with light buttons (for dark background)
      NavigationBar.setBackgroundColorAsync("transparent");
      NavigationBar.setButtonStyleAsync("light");
    } else {
      StatusBar.setBarStyle('light-content');
    }

    // Rotate animation for loading indicator
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  // Second useEffect - fade out and navigate
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace("Onboarding");
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/736x/98/74/76/987476533a322930c6fc6ae972eb2c72.jpg",
          }}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <Animated.View
            style={{
              position: "absolute",
              bottom: 50,
              alignSelf: "center",
              transform: [{ rotate }],
            }}
          >
            <ActivityIndicator size="large" color="#000" />
          </Animated.View>
        </ImageBackground>
      </Animated.View>
    </SafeAreaView>
  );
}
