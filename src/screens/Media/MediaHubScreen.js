import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

// Sample data for books
const BEST_SELLERS = [
  {
    id: '1',
    title: 'A Journey Through Grief, Loss, Hope And Recovery',
    author: 'Dr. Sarah Johnson',
    price: 'GHC 15,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
    description: 'A comprehensive guide to healing and finding hope through life\'s most challenging moments. This book offers practical wisdom and spiritual insights.',
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
    description: 'Discover the transformative power of experiencing God\'s awesome presence in your daily life.',
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
    description: 'Experience the revolutionary impact of Jesus in modern society and personal transformation.',
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
    description: '365 days of inspiring devotions to strengthen your faith and deepen your relationship with God.',
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
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore Media</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Main Categories Grid */}
        <View style={styles.grid}>
          <Card
            title="Sermons"
            subtitle="Watch or listen"
            icon="mic"
            color="#2F66E0"
            onPress={() => navigation.navigate('SermonsList')}
            img="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop"
          />
          <Card
            title="Live Streams"
            subtitle="YouTube · Facebook · TikTok"
            icon="radio-outline"
            color="#C0362C"
            onPress={() => navigation.navigate('LiveStreams')}
            img="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop"
          />
          <Card
            title="Gallery"
            subtitle="Photos & videos"
            icon="images"
            color="#0E7C61"
            onPress={() => navigation.navigate('Gallery')}
            img="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
          />
          <Card
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
      </ScrollView>
    </SafeAreaView>
  );
}

// Enhanced Card Component
function Card({ title, subtitle, icon, color, onPress, img }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: img }} style={styles.cover} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.cardRow}>
        <View style={[styles.iconWrap, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
      </View>
    </TouchableOpacity>
  );
}

// Book Card Component
function BookCard({ book, onPress }) {
  return (
    <TouchableOpacity style={styles.bookCard} onPress={onPress} activeOpacity={0.9}>
      {book.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      
      <Image source={{ uri: book.image }} style={styles.bookCover} />
      
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#FFB800" />
          <Text style={styles.ratingText}>{book.rating}</Text>
        </View>
        
        <Text style={styles.bookPrice}>{book.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Video Card Component
function VideoCard({ video, onPress }) {
  return (
    <TouchableOpacity style={styles.videoCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.videoImageContainer}>
        <Image source={{ uri: video.image }} style={styles.videoCover} />
        
        {video.isLive && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        )}
        
        <View style={styles.playButton}>
          <Ionicons name="play" size={20} color="#fff" />
        </View>
        
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
        <Text style={styles.videoSpeaker}>{video.speaker}</Text>
        
        <View style={styles.videoMeta}>
          <Ionicons name="eye-outline" size={12} color={colors.secondary} />
          <Text style={styles.viewsText}>{video.views} views</Text>
          <Text style={styles.categoryText}>• {video.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: colors.text,
  },
  
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  
  grid: { 
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  
  card: { 
    backgroundColor: colors.card, 
    borderRadius: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: colors.borderLight, 
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  
  cover: { 
    width: '100%', 
    height: 140,
  },
  
  cardRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16,
  },
  
  iconWrap: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12,
  },
  
  cardTitle: { 
    fontWeight: '800', 
    color: colors.text, 
    fontSize: 18,
    marginBottom: 2,
  },
  
  cardSub: { 
    color: colors.textSecondary, 
    fontSize: 14,
  },
  
  sectionContainer: {
    marginBottom: 24,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  
  // Book Card Styles
  bookCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  
  bookCover: {
    width: '100%',
    height: 200,
  },
  
  bookInfo: {
    padding: 12,
  },
  
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  
  bookAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  ratingText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '600',
  },
  
  bookPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  
  // Video Card Styles
  videoCard: {
    width: 240,
    marginRight: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  
  videoImageContainer: {
    position: 'relative',
  },
  
  videoCover: {
    width: '100%',
    height: 135,
  },
  
  liveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  
  liveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  
  videoInfo: {
    padding: 12,
  },
  
  videoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  
  videoSpeaker: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  viewsText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  
  categoryText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
