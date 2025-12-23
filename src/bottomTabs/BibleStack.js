// src/navigation/BibleStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BibleScreen from '../screens/Bible/BibleScreen';
import DiscoverScreen from '../screens/Bible/DiscoverScreen';
import BibleReaderScreen from '../screens/Bible/BibleReaderScreen';

const Stack = createStackNavigator();

export default function BibleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8FBFF' } }}>
      <Stack.Screen name="BibleHome" component={BibleScreen} />
      <Stack.Screen name="Discover" component={DiscoverScreen} />
      <Stack.Screen name="BibleReader" component={BibleReaderScreen} />
    </Stack.Navigator>
  );
}
