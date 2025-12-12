// src/bottomTabs/CellsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CellsListScreen from '../screens/Cells/CellsListScreen';
import CellDetailsScreen from '../screens/Cells/CellDetailsScreen';
import CreateCellScreen from '../screens/Cells/CreateCellScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function CellsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.accent,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="CellsList" component={CellsListScreen} options={{ title: 'Cell Groups' }} />
      <Stack.Screen name="CellDetails" component={CellDetailsScreen} options={{ title: 'Cell Details' }} />
      <Stack.Screen name="CreateCell" component={CreateCellScreen} options={{ title: 'Create Cell' }} />
    </Stack.Navigator>
  );
}
