// src/navigation/HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import NotesStack from './NotesStack'; // Import NotesStack
import QuietTimeStack from './QuietTimeStack';
import DevotionalDetailsScreen from '../screens/Devotional/DevotionalDetailsScreen';
import DevotionalReadingScreen from '../screens/Devotional/DevotionalReadingScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import EventsScreen from '../screens/Events/EventsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import colors from '../theme/colors';

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

      <Stack.Screen name="Community" component={CommunityScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Events" component={EventsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

      {/* Add other screens here as needed */}
    </Stack.Navigator>
  );
}
