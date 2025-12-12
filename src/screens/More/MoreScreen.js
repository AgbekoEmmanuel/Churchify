import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: 'person-circle-outline' },
  { id: 'check-in', label: 'Check-In', icon: 'location-outline' },
  { id: 'votd', label: 'Verse of the Day', icon: 'sparkles-outline' },
  { id: 'videos', label: 'Videos', icon: 'videocam-outline' },
  { id: 'saved', label: 'Saved', icon: 'bookmark-outline' },
  { id: 'following', label: 'Following', icon: 'people-outline' },
  { id: 'prayer', label: 'Prayer', icon: 'hand-left-outline' },
  { id: 'tithes', label: 'Tithes and Offerings', icon: 'cash-outline' },
  { id: 'friends', label: 'Friends', icon: 'person-add-outline' },
  { id: 'about', label: 'About', icon: 'information-circle-outline' },
  { id: 'language', label: 'Language', icon: 'language-outline' },
  { id: 'help', label: 'Help', icon: 'help-circle-outline' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline' },
];

export default function MoreScreen({ navigation }) {
  const onPressItem = (id) => {
    // Handle navigation based on item id
    switch(id) {
      case 'check-in':
        navigation.navigate('CheckIn');
        break;
      case 'profile':
        console.log('Profile clicked');
        break;
      case 'settings':
        console.log('Settings clicked');
        break;
      case 'help':
        console.log('Help clicked');
        break;
      default:
        console.log('Pressed', id);
    }
  };

  // Add profile as first item in the scrollable list
  const flatListData = [
    { type: 'profile', id: 'user-profile', name: 'Emmanuel Agbeko' },
    ...SECTIONS.map(section => ({ ...section, type: 'item' })),
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'profile') {
      return (
        <View style={s.profileSection}>
          <View style={s.avatarContainer}>
            <Text style={s.avatarText}>E</Text>
          </View>
          <Text style={s.userName}>{item.name}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={s.item}
        onPress={() => onPressItem(item.id)}
        activeOpacity={0.6}
      >
        <Ionicons name={item.icon} size={22} color="#222" style={s.itemIcon} />
        <Text style={s.label}>{item.label}</Text>
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <FlatList
        data={flatListData}
        keyExtractor={item => item.id}
        contentContainerStyle={s.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ItemSeparatorComponent={({ leadingItem }) =>
          leadingItem?.type !== 'profile' ? <View style={s.separator} /> : null
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },

  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },

  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  listContainer: {
    paddingBottom: 100, // Space for tab bar
    backgroundColor: '#fff',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },

  itemIcon: {
    marginRight: 18,
    width: 22,
  },

  label: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '400',
  },

  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 60,
  },
});
