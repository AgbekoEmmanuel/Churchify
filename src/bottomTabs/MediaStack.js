import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import colors from '../theme/colors';
import MediaHubScreen from '../screens/Media/MediaHubScreen';

// If you already have these under src/screens/sermons, keep those imports.
// Otherwise, I add stubs below.
import SermonsListScreen from '../screens/sermons/SermonsListScreen';
import SermonDetailsScreen from '../screens/sermons/SermonDetailsScreen';

import LiveStreamsScreen from '../screens/Media/LiveStreamsScreen';
import GalleryScreen from '../screens/Media/GalleryScreen';
import BookDetailsScreen from '../screens/Media/BookDetailsScreen';
import CartScreen from '../screens/Media/CartScreen';
import CheckoutScreen from '../screens/Media/CheckoutScreen';
import BooksListScreen from '../screens/Media/BooksListScreen';

const Stack = createStackNavigator();

export default function MediaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.accent,
        headerTitleStyle: { fontWeight: '700' },
        headerShown: false,
      }}
    >
      <Stack.Screen name="MediaHub" component={MediaHubScreen} options={{ title: 'Media' }} />
      <Stack.Screen name="SermonsList" component={SermonsListScreen} options={{ title: 'Sermons' }} />
      <Stack.Screen name="SermonDetails" component={SermonDetailsScreen} options={{ title: 'Sermon Details' }} />
      <Stack.Screen name="LiveStreams" component={LiveStreamsScreen} options={{ title: 'Live Streams' }} />
      <Stack.Screen name="Gallery" component={GalleryScreen} options={{ title: 'Gallery' }} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="BooksList" component={BooksListScreen} />
    </Stack.Navigator>
  );
}
