import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import colors from '../theme/colors';

// Screens
import SermonsListScreen from '../screens/sermons/SermonsListScreen';
import SermonDetailsScreen from '../screens/sermons/SermonDetailsScreen';

const Stack = createStackNavigator();

export default function SermonsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.accent,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen 
        name="SermonsList" 
        component={SermonsListScreen} 
        options={{ title: 'Sermon Library' }}
      />
      <Stack.Screen 
        name="SermonDetails" 
        component={SermonDetailsScreen} 
        options={{ title: 'Sermon Details' }}
      />
    </Stack.Navigator>
  );
}
