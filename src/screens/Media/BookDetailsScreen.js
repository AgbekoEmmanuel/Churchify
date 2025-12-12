import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

export default function BookDetailsScreen({ navigation, route }) {
  const { book } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = () => {
    setIsInCart(true);
    Alert.alert(
      "Added to Cart",
      `${book.title} has been added to your cart!`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { text: "View Cart", onPress: () => navigation.navigate('Cart', { book, quantity }) }
      ]
    );
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Custom Header */}
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Book Image and Basic Info */}
        <View style={styles.bookSection}>
          <Image source={{ uri: book.image }} style={styles.bookImage} />
          
          <View style={styles.bookInfo}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{book.category}</Text>
            </View>
            
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.authorName}>by {book.author}</Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Rating</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.floor(book.rating) ? "star" : star <= book.rating ? "star-half" : "star-outline"}
                    size={16}
                    color="#FFB800"
                  />
                ))}
                <Text style={styles.ratingNumber}>{book.rating}</Text>
              </View>
            </View>
            
            <Text style={styles.price}>{book.price}</Text>
          </View>
        </View>

        {/* Book Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Book Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pages:</Text>
            <Text style={styles.detailValue}>{book.pages}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{book.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Language:</Text>
            <Text style={styles.detailValue}>English</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>

        {/* Author Bio */}
        <View style={styles.authorSection}>
          <Text style={styles.sectionTitle}>About the Author</Text>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitials}>{book.author.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{book.author}</Text>
              <Text style={styles.authorBio}>
                Renowned author and speaker with over 20 years of experience in spiritual guidance and counseling. 
                Has published multiple bestselling books on faith, hope, and personal transformation.
              </Text>
            </View>
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
              <Ionicons name="remove" size={20} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
              <Ionicons name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={[styles.addToCartButton, isInCart && styles.addedToCartButton]} 
          onPress={handleAddToCart}
          disabled={isInCart}
        >
          <LinearGradient
            colors={isInCart ? [colors.success, colors.success] : [colors.primary, colors.primaryDark]}
            style={styles.buttonGradient}
          >
            <Ionicons 
              name={isInCart ? "checkmark-circle" : "cart"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.buttonText}>
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    elevation: 4,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  content: {
    flex: 1,
  },
  
  bookSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.card,
    marginBottom: 12,
  },
  
  bookImage: {
    width: 200,
    height: 280,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  
  bookInfo: {
    alignItems: 'center',
    width: '100%',
  },
  
  categoryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  
  bookTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  
  authorName: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  
  ratingLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  ratingNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  
  detailsSection: {
    backgroundColor: colors.card,
    marginBottom: 12,
    padding: 20,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  
  descriptionSection: {
    backgroundColor: colors.card,
    marginBottom: 12,
    padding: 20,
  },
  
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  
  authorSection: {
    backgroundColor: colors.card,
    marginBottom: 12,
    padding: 20,
  },
  
  authorInfo: {
    flexDirection: 'row',
  },
  
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  authorInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  
  authorDetails: {
    flex: 1,
  },
  
  authorBio: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 4,
  },
  
  quantitySection: {
    backgroundColor: colors.card,
    marginBottom: 12,
    padding: 20,
  },
  
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  quantityText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  
  bottomActions: {
    padding: 20,
    backgroundColor: colors.card,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -4 },
  },
  
  addToCartButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  addedToCartButton: {
    opacity: 0.8,
  },
  
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
