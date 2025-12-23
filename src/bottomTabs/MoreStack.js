import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import colors from '../theme/colors';
import MoreScreen from '../screens/More/MoreScreen';
import CheckInScreen from '../screens/More/CheckInScreen';
import QRScannerScreen from '../screens/More/QRScannerScreen';
import GivingScreen from '../screens/More/GivingScreen';

const Stack = createStackNavigator();

export default function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MoreHome" component={MoreScreen} />
      <Stack.Screen name="CheckIn" component={CheckInScreen} />
      <Stack.Screen name="Giving" component={GivingScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
    </Stack.Navigator>
  );
}
