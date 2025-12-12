// App.js
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainTabs from "./src/bottomTabs/MainTabs";
import Splash from "./src/screens/Splash/Splash";
import Onboarding from "./src/screens/Onboarding/Onboarding";
import SignIn from "./src/screens/SignIn/SignIn";
import SignUp from "./src/screens/SignUp/SignUp";
import WelcomeSplash from './src/screens/WelcomeSplash/WelcomeSplash';


// Global colors used throughout the app
const colors = {
  primary: '#4A90E2',
  secondary: '#6B7280',
  background: '#FFFFFF',
  lightGray: '#F3F4F6',
  accent: '#FFFFFF',
  shadow: 'rgba(74, 144, 226, 0.15)',
};


// Navigation theme to match your blue app colors
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8FBFF',    // Light blue background
    primary: '#4A90E2',       // Blue primary
    text: '#1E1E1E',          // Dark text
    border: '#E5E7EB',        // Light borders
    card: '#FFFFFF',          // White cards
    notification: '#4A90E2',  // Add this
  },
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="WelcomeSplash" component={WelcomeSplash} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
 
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
