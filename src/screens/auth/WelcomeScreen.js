import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brand, church, photos } from '../../data/church';
import { useAuth } from '../../context/AuthContext';
import { Button, Caption, Eyebrow } from '../../components/ui';
import { colors, fonts, GUTTER, rs } from '../../theme';

// Portrait photos, shown whole (never cropped) across the top of the screen.
const SLIDES = [
  { image: require('../../../assets/church/welcome/welcome_congregation.jpg'), ratio: 1500 / 1200, line: 'Welcome home.' },
  { image: require('../../../assets/church/welcome/worship.jpg'), ratio: 1080 / 720, line: 'Worship. Word. Wisdom.' },
  { image: require('../../../assets/church/welcome/dominion.jpg'), ratio: 1280 / 853, line: 'Balanced for dominion.' },
];
const ND = Platform.OS !== 'web';

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { continueAsGuest } = useAuth();
  const [i, setI] = useState(0);
  const [w, setW] = useState(Dimensions.get('window').width);
  const fade = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 900, useNativeDriver: ND }).start();
    const t = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: 500, useNativeDriver: ND }).start(() => {
        setI((x) => (x + 1) % SLIDES.length);
        Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: ND }).start();
      });
    }, 4800);
    return () => clearInterval(t);
  }, []);

  const rise = enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <View style={styles.root} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      <Animated.View style={[styles.photoWrap, { height: w * SLIDES[i].ratio, opacity: fade }]}>
        <Image source={SLIDES[i].image} style={{ width: w, height: w * SLIDES[i].ratio }} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(6,6,7,0.7)', 'rgba(6,6,7,0)', 'rgba(6,6,7,0)', colors.bg]}
          locations={[0, 0.22, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={[styles.top, { paddingTop: insets.top + 18 }]}>
        <Image source={brand.logoFull} style={styles.logo} resizeMode="contain" />
      </View>

      <Animated.View style={[styles.bottom, { paddingBottom: insets.bottom + 26, opacity: enter, transform: [{ translateY: rise }] }]}>
        <Eyebrow>Members app · {church.hashtag}</Eyebrow>
        <Animated.Text style={[styles.headline, { opacity: fade }]}>{SLIDES[i].line}</Animated.Text>
        <Text style={styles.sub}>
          The home of The Balance Church family — your services, fellowship, giving and the Word, all in one place.
        </Text>

        <View style={styles.dots}>
          {SLIDES.map((_, k) => <View key={k} style={[styles.dot, k === i && styles.dotOn]} />)}
        </View>

        <Button title="Member sign in" icon="lock-closed" onPress={() => navigation.navigate('SignIn')} />
        <Button title="Explore as a guest" variant="ghost" onPress={continueAsGuest} style={{ marginTop: 12 }} />

        <Pressable onPress={() => navigation.navigate('RequestAccess')} style={styles.request} hitSlop={8}>
          <Caption style={{ color: colors.textSecondary }}>Part of the church but no account yet? </Caption>
          <Text style={styles.requestLink}>Request access</Text>
          <Ionicons name="arrow-forward" size={12} color={colors.gold} style={{ marginLeft: 3 }} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const W = Dimensions.get('window').width;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  photoWrap: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
  top: { alignItems: 'center' },
  logo: { width: Math.min(W * 0.52, 220), height: Math.min(W * 0.52, 220) * (148 / 761) },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: GUTTER + 4 },
  headline: { fontFamily: fonts.display, fontSize: rs(40), lineHeight: rs(46), color: colors.text, letterSpacing: -1, marginTop: 12 },
  sub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.textSecondary, marginTop: 12, maxWidth: 360 },
  dots: { flexDirection: 'row', gap: 6, marginTop: 22, marginBottom: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotOn: { width: 22, backgroundColor: colors.gold },
  request: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' },
  requestLink: { fontFamily: fonts.label, fontSize: 12, color: colors.gold },
});
