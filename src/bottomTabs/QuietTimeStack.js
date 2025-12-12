import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import QuietTimeScreen from '../screens/QuietTime/QuietTimeScreen';
import NewQuietTimeScreen from '../screens/QuietTime/NewQuietTimeScreen';
import QuietTimeDetailsScreen from '../screens/QuietTime/QuietTimeDetailsScreen';
import colors from '../theme/colors';

const Stack = createStackNavigator();

export default function QuietTimeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="QuietTime"
        component={QuietTimeScreen}
        options={{ title: 'Quiet Time' }}
      />
      <Stack.Screen
        name="NewQuietTime"
        component={NewQuietTimeScreen}
        options={{ title: 'Add / Edit Quiet Time' }}
      />
      <Stack.Screen
        name="QuietTimeDetails"
        component={QuietTimeDetailsScreen}
        options={{ title: 'Quiet Time Details' }}
      />
    </Stack.Navigator>
  );
}
