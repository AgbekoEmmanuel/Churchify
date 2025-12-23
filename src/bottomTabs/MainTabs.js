import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from "react-native";
import colors from '../theme/colors';

import HomeStack from './HomeStack';
import BibleStack from './BibleStack';
import MediaStack from './MediaStack';
import MoreStack from './MoreStack';

const Tab = createBottomTabNavigator();

// Use only outline icons here (hollow)
const iconMap = {
  Home: 'home-outline',
  Bible: 'book-outline',
  Media: 'play-outline',
  More: 'menu', // Use MaterialCommunityIcons for that 3-line menu/hamburger
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground || '#FFF',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: Platform.OS === "ios" ? 90 : 70, // Slightly reduced for Android if needed
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
          elevation: 8,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = iconMap[route.name];
          const iconSize = 24;

          if (route.name === 'More') {
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={iconSize}
                color={color}
              />
            );
          }

          // Switch to filled icon if focused for better visual state
          const finalIconName = focused ? iconName.replace('-outline', '') : iconName;
          // Note: 'home' exists, 'book' exists, 'play' exists. 'menu' doesn't change.
          // Adjust logic if needed based on available icons.
          // Ionicons map: home-outline -> home, book-outline -> book, play-outline -> play

          return <Ionicons name={focused ? finalIconName : iconName} size={iconSize} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Bible" component={BibleStack} />
      <Tab.Screen name="Media" component={MediaStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
