import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

// Sample cart data
const SAMPLE_CART_ITEMS = [
  {
    id: '1',
    title: 'A Journey Through Grief, Loss, Hope And Recovery',
    price: 15000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'The Awe of God - The Astounding Way',
    price: 12500,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Jesus Revolution - The Awakening',
    price: 18000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  },
];

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState(SAMPLE_CART_ITEMS);
  const shippingFee = 1200;

  const updateQuantity = (id, change) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => setCartItems(prev => prev.filter(item => item.id !== id))
        }
      ]
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price) => `GHC ${price.toLocaleString()}`;

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
        
        <View style={styles.quantityRow}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, -1)}
          >
            <Ionicons name="remove" size={16} color={colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some books to get started</Text>
          
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{totalItems}</Text>
        </View>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        style={styles.cartList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Order Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total number of item(s) in cart</Text>
          <Text style={styles.summaryValue}>{totalItems}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sub Total</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping fee</Text>
          <Text style={styles.summaryValue}>{formatPrice(shippingFee)}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <View style={styles.checkoutSection}>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout', { cartItems, total })}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.checkoutGradient}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
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
    backgroundColor: colors.card,
    elevation: 2,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  
  cartList: {
    flex: 1,
    padding: 16,
  },
  
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  
  itemImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  
  removeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  summarySection: {
    backgroundColor: colors.card,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 8,
    paddingTop: 16,
  },
  
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  
  checkoutSection: {
    padding: 16,
    backgroundColor: colors.card,
  },
  
  checkoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  checkoutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Empty Cart Styles
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  
  continueShoppingButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  
  continueShoppingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
