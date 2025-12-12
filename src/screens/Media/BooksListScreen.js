import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

// Extended book data
const ALL_BOOKS = [
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
    isNew: true,
    isBestSeller: true,
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
    isNew: false,
    isBestSeller: true,
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
    isNew: true,
    isBestSeller: true,
  },
  {
    id: '4',
    title: 'Faith in Action - Daily Devotions',
    author: 'Pastor Ruth Adams',
    price: 'GHC 9,500',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop',
    description: '365 days of inspiring devotions to strengthen your faith.',
    category: 'Devotional',
    pages: 400,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: '5',
    title: 'Healing Hearts - A Guide to Emotional Wellness',
    author: 'Dr. Grace Thompson',
    price: 'GHC 13,500',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
    description: 'Professional guidance on emotional healing and mental wellness from a Christian perspective.',
    category: 'Self Help',
    pages: 298,
    isNew: true,
    isBestSeller: false,
  },
  {
    id: '6',
    title: 'The Power of Prayer in Modern Times',
    author: 'Pastor James Mitchell',
    price: 'GHC 11,000',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    description: 'Understanding the relevance and power of prayer in today\'s world.',
    category: 'Spiritual',
    pages: 224,
    isNew: false,
    isBestSeller: false,
  },
];

const CATEGORIES = ['All', 'Best Sellers', 'New', 'Self Help', 'Spiritual', 'Biography', 'Devotional'];

export default function BooksListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [books, setBooks] = useState(ALL_BOOKS);

  const filterBooks = () => {
    let filtered = ALL_BOOKS;

    // Filter by category
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Best Sellers') {
        filtered = filtered.filter(book => book.isBestSeller);
      } else if (selectedCategory === 'New') {
        filtered = filtered.filter(book => book.isNew);
      } else {
        filtered = filtered.filter(book => book.category === selectedCategory);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setBooks(filtered);
  };

  React.useEffect(() => {
    filterBooks();
  }, [searchQuery, selectedCategory]);

  const renderBook = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetails', { book: item })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      
      <View style={styles.bookDetails}>
        <View style={styles.bookHeader}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.badges}>
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {item.isBestSeller && (
              <View style={styles.bestSellerBadge}>
                <Text style={styles.badgeText}>BEST</Text>
              </View>
            )}
          </View>
        </View>
        
        <Text style={styles.bookAuthor}>by {item.author}</Text>
        
        <View style={styles.bookMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFB800" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.pagesText}>{item.pages} pages</Text>
        </View>
        
        <View style={styles.bookFooter}>
          <Text style={styles.bookPrice}>{item.price}</Text>
          
          <TouchableOpacity 
            style={styles.addToCartBtn}
            onPress={() => navigation.navigate('BookDetails', { book: item })}
          >
            <Ionicons name="cart-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item && styles.selectedCategoryChip
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.selectedCategoryText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {books.length} book{books.length !== 1 ? 's' : ''} found
        </Text>
        
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Sort by</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Books List */}
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={item => item.id}
        style={styles.booksList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    elevation: 2,
  },
  
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
  },
  
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  
  categoriesContainer: {
    backgroundColor: colors.card,
    paddingBottom: 12,
  },
  
  categoriesList: {
    paddingHorizontal: 16,
  },
  
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  
  selectedCategoryChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  
  selectedCategoryText: {
    color: '#fff',
  },
  
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  resultsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  sortText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
  
  booksList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  bookItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  
  bookImage: {
    width: 80,
    height: 110,
    borderRadius: 8,
    marginRight: 12,
  },
  
  bookDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
    flex: 1,
    marginRight: 8,
  },
  
  badges: {
    flexDirection: 'row',
  },
  
  newBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  
  bestSellerBadge: {
    backgroundColor: '#FFB800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  
  bookAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  
  ratingText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '600',
  },
  
  pagesText: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 8,
  },
  
  bookFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  
  bookPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  
  addToCartBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
