// src/screens/Onboarding/Onboarding.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';

export default function Onboarding({ navigation }) {
  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
      StatusBar.setBarStyle("light-content");
      
      // Set navigation bar to match gradient background - transparent with light buttons
      NavigationBar.setBackgroundColorAsync("transparent");
      NavigationBar.setButtonStyleAsync("light");
    } else {
      StatusBar.setBarStyle('light-content');
    }
  }, []);

  const { width, height } = useWindowDimensions();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: '1',
      title: 'Welcome to Churchify',
      subtitle: 'Your Digital Church Experience',
      description: 'Connect with your church community and grow spiritually through our comprehensive platform.',
      icon: 'home',
      gradient: ['#417FC7', '#0E5686'], // Your new blue gradient
    },
    {
      id: '2',
      title: 'Live Stream Services',
      subtitle: 'Never Miss a Service',
      description: 'Watch live services and events from anywhere. Stay connected with your church family.',
      icon: 'videocam',
      gradient: ['#417FC7', '#0E5686'], // Same gradient for consistency
    },
    {
      id: '3',
      title: 'Grow in Community',
      subtitle: 'Connect & Engage',
      description: 'Join small groups, track your spiritual growth, and build meaningful connections.',
      icon: 'people',
      gradient: ['#417FC7', '#0E5686'], // Same gradient for consistency
    },
  ];

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

const renderItem = ({ item, index }) => (
  <View style={{ width, height }}>
    <LinearGradient
      colors={item.gradient}
      style={{ width, height }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Content Container */}
      <View style={styles.slideContent}>
        {/* Text Content - Now centered without phone */}
        <View style={styles.textContainer}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
      </View>
    </LinearGradient>
  </View>
);
  return (
    <View style={styles.container}>
      {/* Full screen gradient background */}
      <LinearGradient
        colors={['#417FC7', '#0E5686']}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            keyExtractor={(item) => item.id}
            snapToInterval={width}
            snapToAlignment="center"
            decelerationRate="fast"
            bounces={false}
          />
          
          {/* Bottom Controls - Better positioned */}
          <View style={styles.bottomContainer}>
            {/* Page Dots - Proper spacing */}
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index ? styles.dotActive : styles.dotInactive
                  ]}
                  onPress={() => flatListRef.current?.scrollToIndex({ index })}
                />
              ))}
            </View>

            {/* Action Buttons - Better spacing */}
            <View style={styles.buttonsContainer}>
              {currentIndex === slides.length - 1 ? (
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => navigation.navigate('SignIn')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.connectButtonText}>Connect to a Church</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => flatListRef.current?.scrollToIndex({ index: slides.length - 1 })}
                  >
                    <Text style={styles.skipButtonText}>Skip</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {
                      if (currentIndex < slides.length - 1) {
                        flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
                      }
                    }}
                  >
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Terms Text - Proper spacing */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating account, you are giving Churchify{'\n'}
                right to use your information and agree to our{'\n'}
                Terms and Conditions.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  },

  backgroundGradient: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },
  
 slideContent: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center', // Changed from 'space-between' to 'center'
  paddingHorizontal: 24,
  paddingTop: Platform.OS === 'android' ? 60 : 40,
  paddingBottom: 200, // Reduced from 280 since no phone container
},

  illustrationContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 20,
  },
  
  phoneContainer: {
    width: 220,
    height: 380,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 28,
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  
  phoneScreen: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  liveIndicator: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A3E5E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  liveDot: {
    width: 8,
    height: 8,
    backgroundColor: '#0E8B86',
    borderRadius: 4,
    marginRight: 6,
  },
  
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
    maxWidth: '100%',
  },
  
  slideTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  
  slideSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  
  slideDescription: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
    letterSpacing: 0.1,
  },
  
 bottomContainer: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  alignItems: 'center',
  paddingBottom: Platform.OS === 'android' ? 100 : 110, // Increased from 50/60 to push up
  paddingHorizontal: 24,
},
  
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    height: 20,
  },
  
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  
  dotInactive: {
    width: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  
  dotActive: {
    width: 25,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  
  buttonsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  
  connectButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  
  connectButtonText: {
    color: '#0A3E5E',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  
  skipButtonText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  
  nextButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
 termsContainer: {
  alignItems: 'center',
  paddingHorizontal: 20,
  marginTop: -10, // Add negative margin to pull it closer to buttons above
},
  
  termsText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
};
