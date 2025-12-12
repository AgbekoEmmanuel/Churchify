import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

export default function CheckoutScreen({ navigation, route }) {
  const { cartItems, total } = route.params;
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const paymentMethods = [
    { id: 'card', name: 'Debit/Credit Card', icon: 'card-outline' },
    { id: 'transfer', name: 'Bank Transfer', icon: 'cash-outline' },
    { id: 'paystack', name: 'Paystack', icon: 'wallet-outline' },
  ];

  const handleCheckout = () => {
    if (!deliveryAddress || !phoneNumber || !email) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Order Confirmation',
      'Are you sure you want to place this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm Order', 
          onPress: () => {
            // Simulate order processing
            Alert.alert(
              'Order Placed!',
              'Your order has been placed successfully. You will receive a confirmation email shortly.',
              [{ text: 'OK', onPress: () => navigation.navigate('MediaHub') }]
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({cartItems.length})</Text>
              <Text style={styles.summaryValue}>GHC {(total - 1200).toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>GHC 1,200</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>GHC {total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textMuted}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Delivery Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your full address"
              placeholderTextColor={colors.textMuted}
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.selectedPayment
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentLeft}>
                <Ionicons 
                  name={method.icon} 
                  size={24} 
                  color={selectedPayment === method.id ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  styles.paymentText,
                  selectedPayment === method.id && styles.selectedPaymentText
                ]}>
                  {method.name}
                </Text>
              </View>
              
              <View style={[
                styles.radioButton,
                selectedPayment === method.id && styles.selectedRadio
              ]}>
                {selectedPayment === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any special instructions for delivery"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomSection}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: GHC {total.toLocaleString()}</Text>
        </View>
        
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.checkoutGradient}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.checkoutText}>Place Order</Text>
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
  
  content: {
    flex: 1,
  },
  
  section: {
    backgroundColor: colors.card,
    marginBottom: 12,
    padding: 20,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  
  summaryCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
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
  
  inputContainer: {
    marginBottom: 16,
  },
  
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
  },
  
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  
  selectedPayment: {
    borderColor: colors.primary,
    backgroundColor: colors.chip,
  },
  
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  paymentText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  
  selectedPaymentText: {
    color: colors.primary,
    fontWeight: '600',
  },
  
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  selectedRadio: {
    borderColor: colors.primary,
  },
  
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  
  bottomSection: {
    backgroundColor: colors.card,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -4 },
  },
  
  totalContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  
  totalText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  
  checkoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
