import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import * as NativeSplash from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Montserrat_300Light, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_400Regular_Italic, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';

import { AuthProvider } from './src/context/AuthContext';
import { StoreProvider } from './src/context/StoreContext';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { colors } from './src/theme';

// Keep the (all-black) native launch screen up until fonts are ready, then hand
// straight over to the animated logo splash — no flash, no icon screen.
NativeSplash.preventAutoHideAsync().catch(() => {});
try { NativeSplash.setOptions({ duration: 0, fade: false }); } catch (e) {}

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_300Light, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
    PlayfairDisplay_400Regular_Italic, PlayfairDisplay_600SemiBold,
  });
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) NativeSplash.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  return (
    <GestureHandlerRootView style={styles.outer}>
      <SafeAreaProvider>
        <View style={styles.device}>
          <StatusBar style="light" />
          {fontsLoaded ? (
            <AuthProvider>
              <StoreProvider>
                <RootNavigator />
              </StoreProvider>
            </AuthProvider>
          ) : null}
          {fontsLoaded && !splashDone ? <SplashScreen onDone={() => setSplashDone(true)} /> : null}
          {!fontsLoaded ? <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} /> : null}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#000' : colors.bg },
  // On web, present the app in a phone-width column so it previews like a device.
  device: Platform.OS === 'web'
    ? { flex: 1, width: '100%', maxWidth: 430, alignSelf: 'center', backgroundColor: colors.bg, overflow: 'hidden',
        borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#151518' }
    : { flex: 1, backgroundColor: colors.bg },
});
