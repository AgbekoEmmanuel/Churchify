// src/navigation/HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import NotesStack from './NotesStack'; // Import NotesStack
import colors from '../theme/colors';
import QuietTimeStack from './QuietTimeStack';
import DevotionalDetailsScreen from '../screens/Devotional/DevotionalDetailsScreen';
import DevotionalReadingScreen from '../screens/Devotional/DevotionalReadingScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.accent,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Notes" 
        component={NotesStack}
        options={{ headerShown: false }} // NotesStack handles its own headers
      />

      <Stack.Screen 
        name="QuietTimeStack" 
        component={QuietTimeStack}
        options={{ headerShown: false }} // NotesStack handles its own headers
      />

      <Stack.Screen
  name="DevotionalDetails"
  component={DevotionalDetailsScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen
  name="DevotionalReading"
  component={DevotionalReadingScreen}
  options={{ headerShown: false }}
/>
      {/* Add other screens here as needed */}
    </Stack.Navigator>
  );
}
