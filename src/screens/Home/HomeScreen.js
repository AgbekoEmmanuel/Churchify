// src/screens/Home/HomeScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from 'expo-navigation-bar';
import colors from '../../theme/colors';

// Components
import HomeHeader from "../../components/Home/HomeHeader";
import QuickActionRow from "../../components/Home/QuickActionRow";
import SermonHighlightCard from "../../components/Home/SermonHighlightCard";
import DevotionalCard from "../../components/Home/DevotionalCard";
import FinancialActionsRow from "../../components/Home/FinancialActionsRow";
import UpcomingEventsSection from "../../components/Home/UpcomingEventsSection";
import TrendingSection from "../../components/Home/TrendingSection";

// ... data ...

export default function HomeScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('Guest');
  const [streak, setStreak] = useState(0);
  const [initial, setInitial] = useState('G');
  const listFade = useRef(new Animated.Value(0)).current;

  // Mock Data
  const BIRTHDAY_CELEBRANTS = [
    { id: '1', name: 'Sister Sarah', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200' },
    { id: '2', name: 'Brother Mike', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' },
    { id: '3', name: 'Pastor John', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200' },
  ];

  const openBirthdayModal = (person) => {
    console.log("Birthday clicked", person);
  };

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
      NavigationBar.setBackgroundColorAsync(colors.background);
      NavigationBar.setButtonStyleAsync("dark");
    }

    // Simulate loading profile
    const loadProfile = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
          setDisplayName(name.split(' ')[0]);
          setInitial(name.charAt(0).toUpperCase());
          setStreak(5); // Mock streak
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadProfile();

    // Start Animation
    Animated.timing(listFade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: 200,
    }).start();

  }, []);

  // ... animations ...

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      {/* Sticky Header */}
      <HomeHeader
        displayName={displayName}
        streak={streak}
        initial={initial}
        onAvatarPress={() => navigation.navigate('Profile')}
        onNotificationPress={() => console.log('Notifications')}
        colors={colors}
      />

      {/* Main Content */}
      <ScrollView
        style={s.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        bounces={true}
      >
        <Animated.View style={{ opacity: listFade, transform: [{ translateY: listFade.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>

          <QuickActionRow navigation={navigation} colors={colors} />

          <SermonHighlightCard navigation={navigation} colors={colors} />

          <DevotionalCard onPress={() => navigation.navigate('DevotionalDetails')} colors={colors} />

          <UpcomingEventsSection colors={colors} />

          <FinancialActionsRow colors={colors} />

          {/* Detailed Sections */}
          <View style={{ gap: 24 }}>

            {/* What's New */}
            <TouchableOpacity style={[s.announce, { shadowColor: colors.shadow }]} activeOpacity={0.9} onPress={() => console.log('Community coming soon')}>
              <LinearGradient
                colors={[colors.inputBackground, colors.backgroundSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={s.announceContent}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Ionicons name="sparkles" size={12} color={colors.primary} />
                    <Text style={s.announceTitle}>What's New</Text>
                  </View>
                  <Text style={[s.announceSub, { color: colors.textSecondary }]}>Community outreach this weekend • Join a small group today!</Text>
                </View>
                <View style={[s.announceBadge, { backgroundColor: colors.surface }]}>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </View>
              </View>
            </TouchableOpacity>

            <TrendingSection navigation={navigation} colors={colors} />

            {/* Birthdays */}
            <View>
              <View style={[s.sectionHeader, { paddingHorizontal: 20 }]}>
                <Text style={[s.sectionTitle, { color: colors.text }]}>Today's Celebrations</Text>
                <TouchableOpacity onPress={() => console.log('See all birthdays')}>
                  <Text style={[s.seeAll, { color: colors.primary }]}>See All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}
              >
                {BIRTHDAY_CELEBRANTS.map((celebrant) => (
                  <BirthdayCard
                    key={celebrant.id}
                    celebrant={celebrant}
                    onPress={() => openBirthdayModal(celebrant)}
                  />
                ))}
              </ScrollView>
            </View>

          </View>

          {/* Bottom Padding */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate("QuietTimeStack")}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={s.fabGrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={30} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
}

// Inline Components (Small enough to keep here or extract later if needed)

function BirthdayCard({ celebrant, onPress }) {
  return (
    <TouchableOpacity
      style={s.birthdayCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E']}
        style={s.birthdayCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={s.birthdayIcons}>
          <Text style={{ fontSize: 12 }}>🎂</Text>
        </View>

        <View style={s.birthdayAvatarContainer}>
          <Image
            source={{ uri: celebrant.image }}
            style={s.birthdayAvatar}
          />
          <View style={s.birthdayBadge}>
            <MaterialCommunityIcons name="cake" size={12} color="#fff" />
          </View>
        </View>

        <Text style={s.birthdayName} numberOfLines={1}>
          {celebrant.name}
        </Text>

        <Text style={s.birthdayWish}>
          Tap to wish!
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  // Announcements
  announce: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 0,
  },
  announceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  announceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: -0.2,
  },
  announceSub: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  announceBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  // Birthday Card
  birthdayCard: {
    width: 110,
    height: 150,
    marginRight: 12,
    borderRadius: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  birthdayCardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  birthdayIcons: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 4,
  },
  birthdayAvatarContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  birthdayAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  birthdayBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.secondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF8E8E',
  },
  birthdayName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    marginTop: 4,
  },
  birthdayWish: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 30, // Above bottom tabs
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  fabGrad: {
    flex: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
