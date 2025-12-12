import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import colors from '../src/theme/colors';

const { width, height } = Dimensions.get('window');

export default function BirthdayCelebrationModal({ 
  visible, 
  onClose, 
  celebrant, 
  onSendWish 
}) {
  const [wishMessage, setWishMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowConfetti(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      setShowConfetti(false);
    }
  }, [visible]);

  const handleSendWish = () => {
    if (wishMessage.trim()) {
      onSendWish(celebrant.id, wishMessage.trim());
      setWishMessage('');
      Alert.alert(
        'Wish Sent! 🎉',
        `Your birthday wish has been sent to ${celebrant.name}!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } else {
      Alert.alert('Please enter a message', 'Write a beautiful birthday wish!');
    }
  };

  const blessings = [
    "May God's blessings shine upon you today and always! 🌟",
    "Wishing you a year filled with God's love and abundant joy! 🙏",
    "May this new year of life bring you closer to His purpose! ✨",
    "God has amazing plans for your life - Happy Birthday! 🎂",
    "May His grace and mercy follow you all the days of your life! 💝"
  ];

  if (!celebrant) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* Confetti Animation */}
        {showConfetti && (
          <ConfettiCannon
            count={200}
            origin={{x: width / 2, y: 0}}
            fadeOut={true}
            autoStart={true}
            colors={['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD']}
          />
        )}

        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Birthday Header */}
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E', '#FFB6B6']}
              style={styles.birthdayHeader}
            >
              <MaterialCommunityIcons name="cake-variant" size={50} color="#fff" />
              <Text style={styles.birthdayTitle}>🎉 Happy Birthday! 🎉</Text>
              <Text style={styles.celebrantName}>{celebrant.name}</Text>
            </LinearGradient>

            {/* Celebrant Info */}
            <View style={styles.celebrantInfo}>
              <View style={styles.infoCard}>
                <Ionicons name="home-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  Cell Group: {celebrant.cellGroup || 'Victory Cell'}
                </Text>
              </View>
              
              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="church" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  Ministry: {celebrant.ministry || 'Worship Ministry'}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  Member since: {celebrant.memberSince || '2020'}
                </Text>
              </View>
            </View>

            {/* Blessing Message */}
            <View style={styles.blessingSection}>
              <Text style={styles.blessingTitle}>God's Blessing for You:</Text>
              <View style={styles.blessingCard}>
                <Text style={styles.blessingText}>
                  {blessings[Math.floor(Math.random() * blessings.length)]}
                </Text>
              </View>
            </View>

            {/* Send Wish Section */}
            <View style={styles.wishSection}>
              <Text style={styles.wishTitle}>Send Birthday Wishes 💌</Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.wishInput}
                  placeholder="Write your birthday message here..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  value={wishMessage}
                  onChangeText={setWishMessage}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendWish}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.sendButtonGradient}
                >
                  <MaterialCommunityIcons name="send" size={20} color="#fff" />
                  <Text style={styles.sendButtonText}>Send Birthday Wish</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Quick Wish Buttons */}
            <View style={styles.quickWishSection}>
              <Text style={styles.quickWishTitle}>Quick Wishes:</Text>
              <View style={styles.quickWishButtons}>
                {[
                  "🎂 Happy Birthday! God bless you!",
                  "🎉 Many more years of God's blessings!",
                  "✨ Wishing you joy and peace today!",
                  "🙏 Praying for an amazing year ahead!"
                ].map((wish, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickWishButton}
                    onPress={() => setWishMessage(wish)}
                  >
                    <Text style={styles.quickWishButtonText}>{wish}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },

  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },

  birthdayHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  birthdayTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },

  celebrantName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },

  celebrantInfo: {
    padding: 20,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.chip,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
    fontWeight: '600',
  },

  blessingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  blessingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },

  blessingCard: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  blessingText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },

  wishSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  wishTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 16,
  },

  wishInput: {
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 80,
  },

  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  quickWishSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  quickWishTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },

  quickWishButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  quickWishButton: {
    backgroundColor: colors.chip,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },

  quickWishButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});
