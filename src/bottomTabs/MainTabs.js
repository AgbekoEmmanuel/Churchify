import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {Platform} from "react-native"; 



import HomeStack from './HomeStack';
import BibleStack from './BibleStack';
import MediaStack from './MediaStack';
import MoreStack from './MoreStack';
// import colors from '../theme/colors'; // Not needed for just black/gray

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
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#222',      // Black-ish for active
        tabBarInactiveTintColor: '#9CA3AF', // Gray for inactive
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height:  Platform.OS === "ios" ? 90 : 90,
        },
        tabBarIcon: ({ focused, color, size }) => {
          // Use MaterialCommunityIcons only for "More"
          if (route.name === 'More') {
            return (
              <MaterialCommunityIcons
                name={iconMap[route.name]}
                size={24}
                color={color}
              />
            );
          }
          // Otherwise use Ionicons
          return <Ionicons name={iconMap[route.name]} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Bible" component={BibleStack} />
      <Tab.Screen name="Media" component={MediaStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
