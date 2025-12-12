import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import colors from '../../theme/colors';

export default function CheckInScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleQRScan = () => {
    navigation.navigate('QRScanner');
  };

  const handleLocationCheckIn = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable location access to check in using your location.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      // Simulate check-in process
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Check-in Successful!',
          'You have been successfully checked in to the service.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }, 2000);
      
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Unable to get your location. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check In</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <View style={styles.content}>
        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeIcon}>
            <MaterialCommunityIcons name="church" size={40} color={colors.primary} />
          </View>
          <Text style={styles.welcomeTitle}>Welcome to Sunday Service!</Text>
          <Text style={styles.welcomeSubtitle}>How would you like to check in?</Text>
        </View>

        {/* Check-in Options */}
        <View style={styles.optionsContainer}>
          {/* QR Code Option */}
          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={handleQRScan}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.primaryDark, '#1A4B6B']}
              style={styles.optionGradient}
            >
              <View style={styles.optionIconContainer}>
                <MaterialCommunityIcons name="qrcode-scan" size={32} color="#fff" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Scan a QR code</Text>
                <Text style={styles.optionSubtitle}>Use your camera to scan the check-in QR code</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Location Based Option */}
          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={handleLocationCheckIn}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.optionGradient}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="location" size={32} color="#fff" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Location Based</Text>
                <Text style={styles.optionSubtitle}>
                  {isLoading ? 'Checking your location...' : 'Automatically check in using your current location'}
                </Text>
              </View>
              {isLoading ? (
                <View style={styles.loadingSpinner}>
                  <MaterialCommunityIcons name="loading" size={20} color="#fff" />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Check-in helps us know you're here and ensures you receive important updates about today's service.
            </Text>
          </View>
        </View>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  
  content: {
    flex: 1,
    padding: 20,
  },
  
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  optionsContainer: {
    marginBottom: 30,
  },
  
  optionCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  optionContent: {
    flex: 1,
  },
  
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  
  optionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  
  loadingSpinner: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  infoSection: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
    marginLeft: 12,
  },
});
