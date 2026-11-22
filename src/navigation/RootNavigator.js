import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import RequestAccessScreen from '../screens/auth/RequestAccessScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import WatchScreen from '../screens/WatchScreen';
import SermonScreen from '../screens/SermonScreen';
import GiveScreen from '../screens/GiveScreen';
import FellowshipScreen, { FellowshipDetailScreen } from '../screens/FellowshipScreen';
import AboutScreen, { LeaderScreen } from '../screens/AboutScreen';
import MeScreen from '../screens/MeScreen';
import { CheckInScreen, MemberCardScreen, NoteEditorScreen, NotesScreen, PrayerScreen } from '../screens/MemberScreens';
import { AnnouncementsScreen, EventScreen, EventsScreen, LibraryScreen } from '../screens/ContentScreens';
import { ArticleScreen, NewsScreen } from '../screens/NewsScreens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home',
  Watch: 'play-circle',
  Fellowship: 'people',
  Give: 'wallet',
  Me: 'person-circle',
  Church: 'business',
};

function Tabs() {
  const { isMember } = useAuth();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: 'rgba(10,10,12,0.98)',
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 62 + Math.max(insets.bottom, 8),
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabel: ({ color, focused }) => (
          <Text style={{ fontFamily: focused ? fonts.label : fonts.bodyMedium, fontSize: 11, color, marginTop: 2 }}>{route.name}</Text>
        ),
        tabBarIcon: ({ color, focused }) => (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name={focused ? ICONS[route.name] : `${ICONS[route.name]}-outline`} size={23} color={color} />
          </View>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Watch" component={WatchScreen} />
      {isMember ? <Tab.Screen name="Fellowship" component={FellowshipScreen} /> : null}
      <Tab.Screen name="Give" component={GiveScreen} />
      {isMember ? <Tab.Screen name="Me" component={MeScreen} /> : <Tab.Screen name="Church" component={AboutScreen} />}
    </Tab.Navigator>
  );
}

const navTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, text: colors.text, border: colors.border, primary: colors.gold },
};

export default function RootNavigator() {
  const { status } = useAuth();
  if (status === 'loading') return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  const authScreens = (
    <>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="RequestAccess" component={RequestAccessScreen} />
    </>
  );
  const shared = (
    <>
      <Stack.Screen name="Sermon" component={SermonScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Leader" component={LeaderScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="News" component={NewsScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </>
  );

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
        }}
      >
        {status === 'signedOut' ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            {authScreens}
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : status === 'guest' ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} />
            {shared}
            {authScreens}
          </>
        ) : (
          <>
            <Stack.Screen name="Tabs" component={Tabs} />
            {shared}
            <Stack.Screen name="FellowshipDetail" component={FellowshipDetailScreen} />
            <Stack.Screen name="CheckIn" component={CheckInScreen} />
            <Stack.Screen name="MemberCard" component={MemberCardScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Notes" component={NotesScreen} />
            <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
            <Stack.Screen name="Prayer" component={PrayerScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
