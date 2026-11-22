import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BalanceMark from '../components/BalanceMark';
import { brand, church } from '../data/church';
import { colors, fonts } from '../theme';

const ND = Platform.OS !== 'web';
const MARK = 150;

// Opening clip: the mark is drawn stroke-by-stroke (ring, ground line, then the
// stones stacking up), the real logo resolves over the drawing, and the
// wordmark "The Balance Church" rises in beneath it.
export default function SplashScreen({ onDone }) {
  const draw = useRef(new Animated.Value(0)).current;
  const solid = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const word = useRef(new Animated.Value(0)).current;
  const line = useRef(new Animated.Value(0)).current;
  const tag = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;
  const [glow, setGlow] = useState(0);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    Animated.timing(out, { toValue: 0, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: ND }).start(() => onDone && onDone());
  };

  useEffect(() => {
    const id = draw.addListener(({ value }) => setGlow(value));
    Animated.sequence([
      Animated.delay(250),
      Animated.timing(draw, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }),
      Animated.timing(solid, { toValue: 1, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: ND }),
      Animated.parallel([
        Animated.timing(lift, { toValue: 1, duration: 750, easing: Easing.out(Easing.cubic), useNativeDriver: ND }),
        Animated.timing(word, { toValue: 1, duration: 850, easing: Easing.out(Easing.cubic), useNativeDriver: ND }),
        Animated.timing(line, { toValue: 1, duration: 900, delay: 250, easing: Easing.out(Easing.cubic), useNativeDriver: ND }),
      ]),
      Animated.timing(tag, { toValue: 1, duration: 500, useNativeDriver: ND }),
      Animated.delay(900),
    ]).start(finish);
    return () => draw.removeListener(id);
  }, []);

  const markShift = lift.interpolate({ inputRange: [0, 1], outputRange: [36, 0] });
  const wordShift = word.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <Animated.View style={[styles.root, { opacity: out }]}>
      <StatusBar style="light" />
      <Pressable style={StyleSheet.absoluteFill} onPress={finish} />
      <View pointerEvents="none" style={styles.center}>
        <Animated.View style={{ transform: [{ translateY: markShift }], alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={{ opacity: solid.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
            <BalanceMark progress={draw} size={MARK * 1.12} glow={glow} />
          </Animated.View>
          <Animated.Image
            source={brand.mark}
            resizeMode="contain"
            style={[styles.solidMark, { opacity: solid, transform: [{ scale: solid.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] }]}
          />
        </Animated.View>

        <Animated.View style={{ opacity: word, transform: [{ translateY: wordShift }], alignItems: 'center', marginTop: 26 }}>
          <Image source={brand.wordmark} style={styles.wordmark} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={[styles.rule, { transform: [{ scaleX: line }] }]} />

        <Animated.Text style={[styles.tag, { opacity: tag }]}>{church.hashtag}</Animated.Text>
      </View>

      <Animated.Text style={[styles.foot, { opacity: tag }]}>
        {church.yearTheme.year} · OUR YEAR OF {church.yearTheme.title.toUpperCase()}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.black, zIndex: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  solidMark: { position: 'absolute', width: MARK, height: MARK * (149 / 162), tintColor: colors.white },
  wordmark: { width: 236, height: 236 * (119 / 602) },
  rule: { width: 120, height: 1.5, backgroundColor: colors.gold, marginTop: 22, opacity: 0.85 },
  tag: { fontFamily: fonts.serifItalic, color: colors.textSecondary, fontSize: 16, marginTop: 14 },
  foot: {
    position: 'absolute', bottom: 48, alignSelf: 'center', fontFamily: fonts.label, fontSize: 10,
    letterSpacing: 3, color: colors.textMuted,
  },
});
