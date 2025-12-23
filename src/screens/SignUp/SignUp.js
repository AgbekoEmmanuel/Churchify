import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Animated,
  ImageBackground,
  Dimensions,
  ScrollView,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../theme/colors';

import AuthInput from '../../components/Auth/AuthInput';
import SocialButton from '../../components/Auth/SocialButton';
import { FELLOWSHIPS } from '../../data/fellowships';

const { width } = Dimensions.get('window');

// FELLOWSHIPS imported from data file

export default function SignUp({ navigation }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fellowship State
  const [fellowship, setFellowship] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    }
    StatusBar.setBarStyle("light-content");

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleSignUp = async () => {
    if (!fellowship) {
      alert('Please select a fellowship!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Save user data (Mock backend)
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userFellowship', fellowship);

      // Navigate
      navigation.replace('MainTabs');
    } catch (e) {
      console.log(e);
    }
  };

  const selectFellowship = (item) => {
    setFellowship(item.name);
    setShowModal(false);
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1544427920-299317d446df?q=80&w=2400&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', '#000']}
          style={styles.gradientOverlay}
        />

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom, 20) + 20 }
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }}
            >
              {/* Header Section */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Join Community</Text>
                <Text style={styles.subtitle}>Create an account to start your journey</Text>
              </View>

              {/* Form Section */}
              <View style={styles.formCard}>
                <View style={styles.inputGroup}>
                  <AuthInput
                    icon="person-outline"
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    theme="dark"
                  />
                  <AuthInput
                    icon="mail-outline"
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    theme="dark"
                  />

                  {/* Fellowship Selector */}
                  <TouchableOpacity style={styles.selector} onPress={() => setShowModal(true)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="people-outline" size={20} color={fellowship ? colors.primary : 'rgba(255,255,255,0.4)'} style={{ marginRight: 12 }} />
                      <Text style={[styles.selectorText, !fellowship && { color: 'rgba(255,255,255,0.4)' }]}>
                        {fellowship || 'Select your fellowship'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.4)" />
                  </TouchableOpacity>

                  <AuthInput
                    icon="lock-closed-outline"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    isPassword
                    theme="dark"
                  />
                  <AuthInput
                    icon="lock-closed-outline"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    isPassword
                    theme="dark"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.signUpButton, { shadowColor: colors.primary }]}
                  onPress={handleSignUp}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.buttonText}>Create Account</Text>
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                  <Text style={[styles.footerLink, { color: colors.primary }]}>Sign In</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Fellowship Modal */}
        <Modal visible={showModal} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                  <Text style={styles.modalTitle}>Select Fellowship</Text>

                  <FlatList
                    data={FELLOWSHIPS}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.modalItem} onPress={() => selectFellowship(item)}>
                        <View style={styles.modalIcon}>
                          <Ionicons name={item.icon} size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.modalText}>{item.name}</Text>
                        {fellowship === item.name && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                      </TouchableOpacity>
                    )}
                  />

                  <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                    <Text style={[styles.closeText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },
  formCard: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  inputGroup: { gap: 16, marginBottom: 32 },

  // Custom Selector Style matching AuthInput
  selector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(0,0,0,0.4)', height: 56, paddingHorizontal: 16, marginBottom: 16
  },
  selectorText: { color: '#fff', fontSize: 16 },

  signUpButton: {
    borderRadius: 16, overflow: 'hidden', marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  gradientButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 8,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.6)', fontSize: 15 },
  footerLink: { fontSize: 15, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F7FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  modalText: { flex: 1, fontSize: 16, fontWeight: '600' },
  closeBtn: { marginTop: 20, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 12, alignItems: 'center' },
  closeText: { fontWeight: '700' },
});
