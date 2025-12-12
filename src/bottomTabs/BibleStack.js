// src/navigation/BibleStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BibleScreen from '../screens/Bible/BibleScreen';
import DiscoverScreen from '../screens/Bible/DiscoverScreen';

const Stack = createStackNavigator();

export default function BibleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8FBFF' } // Add background color
    }}>
      <Stack.Screen name="BibleHome" component={BibleScreen} />
      <Stack.Screen name="Discover" component={DiscoverScreen} />
    </Stack.Navigator>
  );
}
