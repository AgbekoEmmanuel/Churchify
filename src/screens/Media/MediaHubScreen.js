import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

import CategoryCard from '../../components/Media/CategoryCard';
import BookCard from '../../components/Media/BookCard';
import VideoCard from '../../components/Media/VideoCard';

// Sample data for books
const BEST_SELLERS = [
  {
    id: '1',
    title: 'A Journey Through Grief, Loss, Hope And Recovery',
    author: 'Dr. Sarah Johnson',
    price: 'GHC 15,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
    description: 'A comprehensive guide to healing and finding hope through life\'s most challenging moments.',
    category: 'Self Help',
    pages: 284,
    isNew: true
  },
  {
    id: '2',
    title: 'The Awe of God - The Astounding Way',
    author: 'Pastor Michael Brown',
    price: 'GHC 12,500',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&auto=format&fit=crop',
    description: 'Discover the transformative power of experiencing God\'s awesome presence.',
    category: 'Spiritual',
    pages: 256,
    isNew: false
  },
  {
    id: '3',
    title: 'Jesus Revolution - The Awakening',
    author: 'Elder David Wilson',
    price: 'GHC 18,000',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    description: 'Experience the revolutionary impact of Jesus in modern society.',
    category: 'Biography',
    pages: 312,
    isNew: true
  },
  {
    id: '4',
    title: 'Faith in Action - Daily Devotions',
    author: 'Pastor Ruth Adams',
    price: 'GHC 9,500',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop',
    description: '365 days of inspiring devotions.',
    category: 'Devotional',
    pages: 400,
    isNew: false
  },
];

// Sample data for trending videos
const TRENDING_VIDEOS = [
  {
    id: '1',
    title: 'Walking in Divine Purpose',
    speaker: 'Pastor John Smith',
    duration: '45:30',
    views: '12.5K',
    category: 'Sermon',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    isLive: false
  },
  {
    id: '2',
    title: 'Breakthrough Prayer Session',
    speaker: 'Elder Sarah Wilson',
    duration: '32:15',
    views: '8.9K',
    category: 'Prayer',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
    isLive: true
  },
  {
    id: '3',
    title: 'Youth Conference 2025',
    speaker: 'Pastor Mike Johnson',
    duration: '1:12:45',
    views: '25.3K',
    category: 'Conference',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',
    isLive: false
  },
];

export default function MediaHubScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Explore Media</Text>
              <Text style={styles.subtitle}>Sermons, books & more</Text>
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Main Categories Grid */}
          <View style={styles.grid}>
            <CategoryCard
              title="Sermons"
              subtitle="Watch or listen"
              icon="mic"
              color="#2F66E0"
              onPress={() => navigation.navigate('SermonsList')}
              img="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop"
            />
            <CategoryCard
              title="Live Streams"
              subtitle="YouTube · Facebook · TikTok"
              icon="radio-outline"
              color="#C0362C"
              onPress={() => navigation.navigate('LiveStreams')}
              img="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop"
            />
            <CategoryCard
              title="Gallery"
              subtitle="Photos & videos"
              icon="images"
              color="#0E7C61"
              onPress={() => navigation.navigate('Gallery')}
              img="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
            />
            <CategoryCard
              title="Library"
              subtitle="Books & Resources"
              icon="library-outline"
              color="#8B5A2B"
              onPress={() => navigation.navigate('BooksList')}
              img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
            />
          </View>

          {/* Best Sellers Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Best Sellers</Text>
              <TouchableOpacity onPress={() => navigation.navigate('BooksList')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {BEST_SELLERS.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onPress={() => navigation.navigate('BookDetails', { book })}
                />
              ))}
            </ScrollView>
          </View>

          {/* Trending in Video Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending in Video</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SermonsList')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {TRENDING_VIDEOS.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPress={() => navigation.navigate('VideoPlayer', { video })}
                />
              ))}
            </ScrollView>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 30 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  grid: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 4,
  },
});
