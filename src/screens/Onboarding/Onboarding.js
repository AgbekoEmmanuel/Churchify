import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  StatusBar,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';

// High-quality Unsplash images
const SLIDES = [
  {
    id: '1',
    title: 'Welcome to\nChurchify',
    subtitle: 'Faith • Community • Purpose',
    description: 'Experience church like never before. Connect with your spiritual family from anywhere in the world.',
    image: 'https://i.pinimg.com/736x/c6/fa/e1/c6fae11321c48bedd6a173746c66472d.jpg', // Worship/Community
  },
  {
    id: '2',
    title: 'Live Stream\nServices',
    subtitle: 'Worship Without Limits',
    subtitleColor: '#FFD700', // Gold/Amber for premium look against dark usage
    description: 'Join live services, watch sermons on-demand, and immerse yourself in powerful worship sessions.',
    image: 'https://i.pinimg.com/1200x/e5/93/ad/e593ada08c48d1ff13e1574f1a9769a2.jpg', // Tech/Streaming
  },
  {
    id: '3',
    title: 'Grow Together\nIn Faith',
    subtitle: 'Discipleship & Groups',
    subtitleColor: '#64FFDA', // Bright Teal/Mint for contrast
    description: 'Find your people. Join small groups, share prayer requests, and grow in your walk with God.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400&auto=format&fit=crop', // Friends/Group
  },
];

export default function Onboarding({ navigation }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Transparent status bar for immersive feel
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false, listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      }
    }
  );

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('SignIn');
    }
  };

  const SkipButton = () => (
    <TouchableOpacity
      style={[styles.skipButton, { top: insets.top + 10 }]}
      onPress={() => navigation.navigate('SignIn')}
    >
      <Text style={styles.skipText}>Skip</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ width, height }}>
        <Image
          source={{ uri: item.image }}
          style={[styles.image, { width, height }]}
          resizeMode="cover"
        />
        {/* Dark Overlay Gradient for text readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)', '#000']}
          style={styles.gradientOverlay}
          locations={[0, 0.4, 0.7, 1]}
        />

        {/* Content */}
        <View style={[styles.contentContainer, { paddingBottom: 160 }]}>
          <Animated.View style={{
            opacity: scrollX.interpolate({
              inputRange: [(index - 1) * width, index * width, (index + 1) * width],
              outputRange: [0, 1, 0],
            }),
            transform: [{
              translateY: scrollX.interpolate({
                inputRange: [(index - 1) * width, index * width, (index + 1) * width],
                outputRange: [20, 0, 20],
              })
            }]
          }}>
            <Text style={[styles.subtitle, { color: item.subtitleColor || colors.primary }]}>{item.subtitle}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>
        </View>
      </View>
    );
  };

  const Paginator = () => {
    return (
      <View style={styles.paginatorContainer}>
        {SLIDES.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i.toString()}
              style={[
                styles.dot,
                { width: dotWidth, opacity, backgroundColor: colors.primary }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        keyExtractor={(item) => item.id}
      />

      <SkipButton />

      {/* Bottom Controls */}
      <View style={[styles.bottomControls, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
        <Paginator />

        <TouchableOpacity
          style={[styles.mainButton, { shadowColor: colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          {currentIndex === SLIDES.length - 1 ? (
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.mainButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.iconButton}
            >
              <Ionicons name="chevron-forward" size={28} color="#fff" />
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%', // Covers bottom half significantly
  },
  skipButton: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 160, // Leave space for bottom controls
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 48,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: '90%',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  mainButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  gradientButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  }
});
