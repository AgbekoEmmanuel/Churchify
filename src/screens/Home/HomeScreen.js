// src/screens/Home/HomeScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  TextInput,
  Platform,
  Animated,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../theme/colors";
import * as NavigationBar from 'expo-navigation-bar';
import BirthdayCelebrationModal from '../../../components/BirthdayCelebrationModal';

const { width } = Dimensions.get("window");

// Brand palette - Updated to match #0E5686 theme
const palette = {
  bg: "#F5F9FC",            // Very light blue background
  primary: "#0E5686",       // Your main blue
  primaryTint: "#0A3E5E",   // Darker blue
  accent: "#417FC7",        // Light blue accent
  text: "#1B2445",          // Dark blue text
  muted: "#57668E",         // Muted blue-gray
  card: "#FFFFFF",          // White cards
  border: "#D1DAE8",        // Soft blue borders
  chip: "#E8F0F7",          // Light blue chip background
};

// Demo events with beautiful images
const EVENTS = [
  { 
    id: "1", 
    title: "Youth Conference", 
    date: "Sun, 25 Aug • 9:00 AM", 
    color: "#0E5686",
    image: "https://i.pinimg.com/1200x/0d/cd/1f/0dcd1fa0df2b52f2d956d7310ffa7548.jpg"
  },
  { 
    id: "2", 
    title: "Prayer Night", 
    date: "Wed, 28 Aug • 7:00 PM", 
    color: "#0E8B86",
    image: "https://i.pinimg.com/736x/e8/d3/94/e8d3948ffe66a99df6ebb89a9ebc7a93.jpg"
  },
  { 
    id: "3", 
    title: "Bible Study", 
    date: "Mon, 02 Sep • 6:30 PM", 
    color: "#86560B",
    image: "https://i.pinimg.com/1200x/fb/7f/c4/fb7fc49d266b14f186202eba81cc9360.jpg"
  },
  { 
    id: "4", 
    title: "Worship Sunday", 
    date: "Sun, 08 Sep • 10:00 AM", 
    color: "#417FC7",
    image: "https://i.pinimg.com/1200x/b0/9b/c0/b09bc0ca48eaa56c908f2493cc457d14.jpg"
  },
];

// Add this data after your EVENTS array
const BIRTHDAY_CELEBRANTS = [
  {
    id: '1',
    name: 'Gary K.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    cellGroup: 'Victory Cell',
    ministry: 'Youth Ministry',
    memberSince: '2019',
  },
  {
    id: '2',
    name: 'Joshua S.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    cellGroup: 'Faith Cell',
    ministry: 'Worship Ministry',
    memberSince: '2020',
  },
  {
    id: '3',
    name: 'Pastor BJ',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    cellGroup: 'Leaders Circle',
    ministry: 'Teaching Ministry',
    memberSince: '2015',
  },
  {
    id: '4',
    name: 'Julia One',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b137?w=150&h=150&fit=crop&crop=face',
    cellGroup: 'Grace Cell',
    ministry: 'Children Ministry',
    memberSince: '2021',
  },
];


// Trending messages data
const TRENDING_MESSAGES = [
  {
    id: "1",
    title: "Faith Over Fear",
    speaker: "Pastor John",
    date: "Aug 25, 2025",
    duration: "12:30",
    category: "Inspiration",
    image: "https://i.pinimg.com/736x/5c/92/40/5c9240698cb89d2836854076ac58f5af.jpg",
    plays: "2.5K"
  },
  {
    id: "2", 
    title: "Walking in Purpose",
    speaker: "Pastor Sarah",
    date: "Aug 22, 2025",
    duration: "18:45",
    category: "Purpose",
    image: "https://i.pinimg.com/736x/34/38/68/34386836f9b1f2dc9ce644919776f29b.jpg",
    plays: "1.8K"
  },
  {
    id: "3",
    title: "God's Love Endures",
    speaker: "Elder Mark",
    date: "Aug 20, 2025", 
    duration: "15:20",
    category: "Love",
    image: "https://i.pinimg.com/1200x/f6/28/ca/f628ca4c7ea82a03955ac0e8bb5b3ed8.jpg",
    plays: "3.1K"
  },
  {
    id: "4",
    title: "Breakthrough Prayer",
    speaker: "Pastor Ruth",
    date: "Aug 18, 2025",
    duration: "22:10", 
    category: "Prayer",
    image: "https://i.pinimg.com/1200x/bb/d6/72/bbd672eec46783343f7a842842312e09.jpg",
    plays: "4.2K"
  },
];

export default function HomeScreen({ navigation }) {
  const [initial] = useState("U");
  const [displayName, setDisplayName] = useState("Emmanuel");
  const [streak] = useState(0);
  const [query, setQuery] = useState("");
  const greetFade = useRef(new Animated.Value(0)).current;
  const [birthdayModalVisible, setBirthdayModalVisible] = useState(false);
  const [selectedCelebrant, setSelectedCelebrant] = useState(null);
const closeBirthdayModal = () => {
  setBirthdayModalVisible(false);
  setSelectedCelebrant(null);
};
const handleSendBirthdayWish = (celebrantId, message) => {
  // You can connect this to your backend to actually send the wish.
  // For now, just log the action:
  console.log(`Birthday Wish sent to Celebrant ID ${celebrantId}: ${message}`);
  // Optionally, you could show a confirmation, clear a form, etc.
};
const openBirthdayModal = (celebrant) => {
  setSelectedCelebrant(celebrant);
  setBirthdayModalVisible(true);
};


  useEffect(() => {
    // Configure status bar
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);

      // Set navigation bar for light blue background (dark buttons)
      NavigationBar.setBackgroundColorAsync("#F5F9FC"); // Match your new palette.bg
      NavigationBar.setButtonStyleAsync("dark");
    }

    Animated.timing(greetFade, { toValue: 1, duration: 700, useNativeDriver: true }).start();

    // Pull name from local profile if available
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("userProfile");
        if (raw) {
          const p = JSON.parse(raw);
          if (p?.name && typeof p.name === "string") {
            const clean = p.name.trim();
            if (clean.length > 0) setDisplayName(clean.split(" ")[0]);
          }
        }
      } catch {}
    })();
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* FIXED HEADER - Won't scroll */}
      <View style={s.fixedHeader}>
        <SafeAreaView>
          <Animated.View style={[s.headerContent, { opacity: greetFade }]}>
            {/* Left side - Greeting */}
            <View style={s.greetingSection}>
              <Text style={s.greeting}>👋 Welcome back, {displayName}</Text>
              <Text style={s.subGreeting}>Here's what's happening today</Text>
            </View>

            {/* Right side - Icons */}
            <View style={s.iconsSection}>
              <View style={s.iconBadge}>
                <MaterialCommunityIcons name="fire" size={22} color={colors.warning} />
                <View style={s.badgeBubble}>
                  <Text style={s.badgeText}>{streak}</Text>
                </View>
              </View>
              <TouchableOpacity style={s.iconButton}>
                <Ionicons name="notifications-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{initial}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Search Bar */}
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={18} color={palette.muted} />
            <TextInput
              style={s.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search sermons, events, notes…"
              placeholderTextColor={palette.muted}
              returnKeyType="search"
            />
            <TouchableOpacity style={s.filterPill} onPress={() => console.log('Filter tapped')}>
              <Ionicons name="options-outline" size={16} color={palette.primary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView 
        style={s.scrollView}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={s.scrollContent}
        bounces={true}
      >
        {/* Quick Actions */}
        <View style={s.quickRow}>
         <QuickAction
          icon="book-outline"
          label="Notes"
        onPress={() => navigation.navigate('Notes')}
         />
          <QuickAction
            icon="time-outline"
            label="Quiet Time"
            onPress={() => navigation.navigate("QuietTimeStack")}
          />
          <QuickAction
            icon="people-outline"
            label="Community"
            onPress={() => console.log('Community coming soon')}
          />
          <QuickAction
            icon="calendar-outline"
            label="Events"
            onPress={() => console.log('Events coming soon')}
          />
        </View>

        {/* Sermon Highlight */}
        <TouchableOpacity
          style={s.sermonCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Media', { screen: 'SermonsList' })}
        >
          <ImageBackground
            source={{ uri: "https://i.pinimg.com/1200x/34/2a/d1/342ad15a074fa1a4cf24afe25c499c4b.jpg" }}
            style={s.sermonImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={["rgba(14,86,134,0.9)", "rgba(10,62,94,0.35)", "transparent"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={s.sermonContent}>
              <Text style={s.sermonKicker}>Your Sermons</Text>
              <Text style={s.sermonTitle}>"Walking In Faith"</Text>
              <View style={s.sermonMetaRow}>
                <Ionicons name="time-outline" size={14} color={"#FFFFFF"} />
                <Text style={s.sermonMeta}>Next • 12:30 PM • 3h left</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Devotional for the Day card */}
        <DevotionalCard
          onPress={() => navigation.navigate('DevotionalDetails')}
        />
        {/* Quick Financial Actions - Add this after events and before What's New */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Quick Financial Actions</Text>
        </View>

        <View style={s.financialActionsRow}>
          <FinancialAction
            icon="wallet-outline"
            label="Offertory"
            onPress={() => console.log('Offertory clicked')}
            color={palette.primary}
          />
          <FinancialAction
            icon="card-outline"
            label="Tithe"
            onPress={() => console.log('Tithe clicked')}
            color="#0E8B86"
          />
          <FinancialAction
            icon="heart-outline"
            label="Giving"
            onPress={() => console.log('Giving clicked')}
            color="#86560B"
          />
          <FinancialAction
            icon="ribbon-outline"
            label="Pledges"
            onPress={() => console.log('Pledges clicked')}
            color="#8B5A2B"
          />
          <FinancialAction
            icon="gift-outline"
            label="Donations"
            onPress={() => console.log('Donations clicked')}
            color="#0E7C61"
          />
        </View>

        {/* Upcoming Events */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => console.log('See all events coming soon')}>
            <Text style={s.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {EVENTS.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {EVENTS.map((e) => (
              <EventCard 
                key={e.id} 
                title={e.title} 
                date={e.date} 
                bgColor={e.color}
                image={e.image}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={s.emptyState}>
            <Text style={s.emptyStateText}>No upcoming events</Text>
            <Text style={s.emptyStateSub}>Check back later for new events</Text>
          </View>
        )}

        {/* What's New / Announcement */}
        <TouchableOpacity style={s.announce} activeOpacity={0.85} onPress={() => console.log('Community coming soon')}>
          <View style={{ flex: 1 }}>
            <Text style={s.announceTitle}>What's New</Text>
            <Text style={s.announceSub}>Community outreach this weekend • Join a small group</Text>
          </View>
          <View style={s.announceBadge}>
            <Ionicons name="chevron-forward" size={18} color={palette.primary} />
          </View>
        </TouchableOpacity>

        {/* Trending Messages */}
        <View style={[s.sectionHeader, { marginTop: 20}]}>
          <Text style={s.sectionTitle}>Trending Messages</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Media', { screen: 'SermonsList' })}>
            <Text style={s.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {TRENDING_MESSAGES.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {TRENDING_MESSAGES.map((message) => (
              <TrendingMessageCard 
                key={message.id}
                title={message.title}
                speaker={message.speaker}
                date={message.date}
                duration={message.duration}
                category={message.category}
                image={message.image}
                plays={message.plays}
                onPress={() => navigation.navigate('Media', { 
                  screen: 'SermonDetails', 
                  params: { messageId: message.id }
                })}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={s.emptyState}>
            <Text style={s.emptyStateText}>No trending messages</Text>
            <Text style={s.emptyStateSub}>Check back later for popular content</Text>
          </View>
        )}

        {/* Birthday Celebrations - Add this after Trending Messages */}
        <View style={[s.sectionHeader, { marginTop: 24 }]}>
          <Text style={s.sectionTitle}>Today's Celebrations</Text>
          <TouchableOpacity onPress={() => console.log('See all birthdays')}>
            <Text style={s.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {BIRTHDAY_CELEBRANTS.map((celebrant) => (
            <BirthdayCard 
              key={celebrant.id}
              celebrant={celebrant}
              onPress={() => openBirthdayModal(celebrant)}
            />
          ))}
        </ScrollView>

        {/* Birthday Modal */}
        <BirthdayCelebrationModal
          visible={birthdayModalVisible}
          celebrant={selectedCelebrant}
          onClose={closeBirthdayModal}
          onSendWish={handleSendBirthdayWish}
        />


        {/* Bottom spacing for FAB and tab bar */}
        <View style={{ height: 40}} />
      </ScrollView>

      {/* Floating Action Button - OUTSIDE ScrollView */}
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate("QuietTime")}>
        <LinearGradient
          colors={[palette.primary, palette.primaryTint]}
          style={s.fabGrad}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- Components ---------- */
function DevotionalCard({ onPress }) {
  return (
    <TouchableOpacity style={d.card} activeOpacity={0.9} onPress={onPress}>
      {/* Top blue accent line */}
      <View style={d.accent} />

      {/* Header row */}
      <View style={d.headerRow}>
        <View style={d.leftWrap}>
          <View style={d.iconWrap}>
            <Ionicons name="leaf-outline" size={18} color="#0E5686" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={d.title}>Devotional for the Day</Text>
            <View style={d.subRow}>
              <Text numberOfLines={1} style={d.subtitle}>
                Growing Daily in faith daily by listening to the word of God…
              </Text>
              <Text style={d.readMore}> Read More</Text>
            </View>
          </View>
        </View>

        <Text style={d.dateText}>
          {new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function TrendingMessageCard({ title, speaker, date, duration, category, image, plays, onPress }) {
  return (
    <TouchableOpacity style={s.trendingCard} activeOpacity={0.9} onPress={onPress}>
      <ImageBackground
        source={{ uri: image }}
        style={s.trendingCardBackground}
        imageStyle={{ borderRadius: 18 }}
      >
        <LinearGradient
          colors={['rgba(14,86,134,0.2)', 'rgba(0,0,0,0.8)']}
          style={s.trendingCardGradient}
        >
          {/* Category pill at top */}
          <View style={s.trendingCategoryPill}>
            <Text style={s.trendingCategory}>{category}</Text>
          </View>
          
          {/* Content at bottom */}
          <View style={s.trendingCardContent}>
            <Text style={s.trendingTitle} numberOfLines={2}>
              {title}
            </Text>
            
            <Text style={s.trendingSpeaker} numberOfLines={1}>
              by {speaker}
            </Text>
            
            <View style={s.trendingFooter}>
              <View style={s.trendingMetaItem}>
                <Ionicons name="time-outline" size={12} color="#fff" />
                <Text style={s.trendingMetaText}>{duration}</Text>
              </View>
              
              <View style={s.trendingMetaItem}>
                <Ionicons name="play-outline" size={12} color="#fff" />
                <Text style={s.trendingMetaText}>{plays}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

function QuickAction({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={s.quickItem} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={[palette.primary, palette.primaryTint]}
        style={s.quickIcon}
      >
        <Ionicons name={icon} size={22} color="#fff" />
      </LinearGradient>
      <Text style={s.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function EventCard({ title, date, bgColor, image }) {
  return (
    <TouchableOpacity style={s.eventCard} activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: image }}
        style={s.eventCardBackground}
        imageStyle={{ borderRadius: 18 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={s.eventCardGradient}
        >
          <View style={s.eventDatePill}>
            <Text style={s.eventDate}>{date.split('•')[0]}</Text>
          </View>
          
          <View style={s.eventCardContent}>
            <Text style={s.eventTitle} numberOfLines={2}>
              {title}
            </Text>
            <View style={s.eventFooter}>
              <Ionicons name="time-outline" size={12} color="#fff" />
              <Text style={s.eventPlace}>{date.split('•')[1] || 'Main Hall'}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

function FinancialAction({ icon, label, onPress, color }) {
  return (
    <TouchableOpacity style={s.financialActionItem} onPress={onPress} activeOpacity={0.85}>
      <View style={[s.financialActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <Text style={s.financialActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

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
      >
        {/* Floating Icons */}
        <View style={s.birthdayIcons}>
          <Text style={s.birthdayIcon}>🎂</Text>
          <Text style={s.birthdayIcon}>🎉</Text>
          <Text style={s.birthdayIcon}>✨</Text>
        </View>

        <View style={s.birthdayAvatarContainer}>
          <Image 
            source={{ uri: celebrant.image }} 
            style={s.birthdayAvatar} 
          />
          <View style={s.birthdayBadge}>
            <MaterialCommunityIcons name="cake" size={16} color="#fff" />
          </View>
        </View>

        <Text style={s.birthdayName} numberOfLines={1}>
          {celebrant.name}
        </Text>
        
        <Text style={s.birthdayWish}>
          🎈 Tap to celebrate! 🎈
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}


const d = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5EEF7',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  accent: {
    height: 3,
    backgroundColor: '#0E5686',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  leftWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#E8F0F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1B2445',
    marginBottom: 2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'nowrap',
  },
  subtitle: {
    fontSize: 12,
    color: '#57668E',
    flexShrink: 1,
  },
  readMore: {
    fontSize: 12,
    color: '#0E5686',
    fontWeight: '800',
  },
  dateText: {
    fontSize: 11.5,
    color: '#8A94B8',
    fontWeight: '700',
  },
});

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },

  /* FIXED HEADER */
  fixedHeader: {
    backgroundColor: palette.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 0 : 0,
    zIndex: 1000,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  greetingSection: {
    flex: 1,
  },

  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: palette.text,
    marginBottom: 4,
  },

  subGreeting: {
    fontSize: 13,
    color: palette.muted,
  },

  iconsSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconButton: {
    padding: 2,
  },

  iconBadge: { 
    position: "relative",
  },

  badgeBubble: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },

  badgeText: { 
    color: colors.accent, 
    fontSize: 10, 
    fontWeight: "700" 
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: { 
    color: colors.accent, 
    fontWeight: "800" 
  },

  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  searchInput: {
    flex: 1,
    color: palette.text,
    paddingVertical: 4,
    fontSize: 16,
  },

  filterPill: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: palette.chip,
    alignItems: "center",
    justifyContent: "center",
  },

  /* SCROLLABLE CONTENT */
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  /* Quick Actions */
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  quickItem: {
    alignItems: "center",
    flex: 1,
  },

  quickIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  quickLabel: {
    fontSize: 12,
    color: palette.text,
    fontWeight: "600",
    marginTop: 8,
  },

  /* Sermon Highlight */
  sermonCard: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 18,
  },

  sermonImage: {
    width: width - 32,
    height: 190,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  sermonContent: {
    padding: 16,
  },

  sermonKicker: {
    fontSize: 12,
    color: "#E9FDF2",
    marginBottom: 2,
    letterSpacing: 0.3,
  },

  sermonTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  sermonMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },

  sermonMeta: { 
    color: "#FFFFFF", 
    fontWeight: "700", 
    fontSize: 12 
  },

  /* Upcoming Events */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.text,
  },

  seeAll: {
    fontSize: 12,
    color: palette.primary,
    fontWeight: "700",
  },

  /* Updated Event Cards with Images */
  eventCard: {
    width: 160,
    height: 140,
    marginRight: 12,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  eventCardBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  eventCardGradient: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },

  eventCardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  eventDatePill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },

  eventDate: {
    color: "#333",
    fontWeight: "700",
    fontSize: 10,
  },

  eventTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  eventFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  eventPlace: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  /* Empty State */
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },

  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.muted,
    marginBottom: 4,
  },

  emptyStateSub: {
    fontSize: 14,
    color: palette.muted,
    opacity: 0.7,
  },

  /* Announcement / What's New */
  announce: {
    backgroundColor: palette.card,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  announceTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: palette.text,
  },

  announceSub: {
    fontSize: 13,
    color: palette.muted,
    marginTop: 2,
  },

  announceBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: palette.chip,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Trending Messages Styles */
  trendingCard: {
    width: 180,
    height: 160,
    marginRight: 12,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  trendingCardBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  trendingCardGradient: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },

  trendingCategoryPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(65, 127, 199, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },

  trendingCategory: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  trendingCardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  trendingTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  trendingSpeaker: {
    color: "#E8F0F7",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  trendingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  trendingMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  trendingMetaText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  /* FAB */
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    borderRadius: 30,
    width: 60,
    height: 60,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },  

  fabGrad: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

    /* Quick Financial Actions */
  financialActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  financialActionItem: {
    alignItems: "center",
    width: "18%",
    marginBottom: 8,
  },

  financialActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  financialActionLabel: {
    fontSize: 11,
    color: palette.text,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },

  /* Birthday Celebrations */
birthdayCard: {
  width: 140,
  height: 180,
  marginRight: 12,
  borderRadius: 20,
  overflow: 'hidden',
  elevation: 6,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
},

birthdayCardGradient: {
  flex: 1,
  padding: 16,
  alignItems: 'center',
  justifyContent: 'space-between',
},

birthdayIcons: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%',
  marginBottom: 8,
},

birthdayIcon: {
  fontSize: 16,
},

birthdayAvatarContainer: {
  position: 'relative',
  marginBottom: 8,
},

birthdayAvatar: {
  width: 60,
  height: 60,
  borderRadius: 30,
  borderWidth: 3,
  borderColor: '#fff',
},

birthdayBadge: {
  position: 'absolute',
  bottom: -4,
  right: -4,
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#FFD700',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderColor: '#fff',
},

birthdayName: {
  fontSize: 14,
  fontWeight: '700',
  color: '#fff',
  textAlign: 'center',
  marginBottom: 4,
},

birthdayWish: {
  fontSize: 10,
  color: '#fff',
  textAlign: 'center',
  fontWeight: '600',
  opacity: 0.9,
},

});
