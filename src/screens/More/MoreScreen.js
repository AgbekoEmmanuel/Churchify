import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const SECTIONS = [
  {
    header: 'Account',
    items: [
      { id: 'profile', label: 'View Profile', icon: 'person-outline' },
      { id: 'check-in', label: 'Check-In', icon: 'location-outline' },
      { id: 'saved', label: 'Saved Items', icon: 'bookmark-outline' },
      { id: 'friends', label: 'Friends', icon: 'people-outline' },
    ]
  },
  {
    header: 'Community & Faith',
    items: [
      { id: 'prayer', label: 'Prayer Requests', icon: 'heart-outline' },
      { id: 'groups', label: 'Groups', icon: 'people-circle-outline' },
      { id: 'tithes', label: 'Tithes & Giving', icon: 'wallet-outline' },
      { id: 'events', label: 'Events', icon: 'calendar-outline' },
    ]
  },
  {
    header: 'App Settings',
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings-outline' },
      { id: 'help', label: 'Help & Support', icon: 'help-circle-outline' },
      { id: 'about', label: 'About', icon: 'information-circle-outline' },
      { id: 'logout', label: 'Log Out', icon: 'log-out-outline', color: '#DC2626' },
    ]
  }
];

export default function MoreScreen({ navigation }) {
  const onPressItem = (id) => {
    switch (id) {
      case 'check-in':
        navigation.navigate('CheckIn');
        break;
      case 'profile':
        console.log('Profile clicked');
        break;
      case 'settings':
        console.log('Settings clicked');
        break;
      case 'tithes':
        navigation.navigate('Giving');
        break;
      case 'logout':
        navigation.replace('SignIn');
        break;
      default:
        console.log('Pressed', id);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={s.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={s.profileCard}>
          <View style={s.avatarContainer}>
            <Image
              source={{ uri: 'https://i. Pravatar.cc/150?img=68' }} // Placeholder
              style={s.avatar}
            />
            <View style={s.onlineBadge} />
          </View>
          <View style={s.profileInfo}>
            <Text style={s.userName}>Emmanuel Agbeko</Text>
            <Text style={s.userHandle}>@emmanuel_a</Text>
          </View>
          <TouchableOpacity style={s.editButton}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {SECTIONS.map((section, index) => (
          <View key={index} style={s.section}>
            <Text style={s.sectionHeader}>{section.header}</Text>
            <View style={s.sectionContent}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    s.item,
                    idx < section.items.length - 1 && s.itemBorder
                  ]}
                  onPress={() => onPressItem(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[s.iconContainer, { backgroundColor: item.color ? `${item.color}10` : '#F0F7FF' }]}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={item.color || colors.primary}
                    />
                  </View>
                  <Text style={[s.label, item.color && { color: item.color }]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={s.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.borderLight,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.card,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F0F7FF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 20,
  }
});
