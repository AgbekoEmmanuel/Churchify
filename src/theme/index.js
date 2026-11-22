import { Dimensions } from 'react-native';

// Responsive scale: designs are drawn at 390pt wide (iPhone 12–16). Big type and
// hero sizes scale down on small phones (iPhone SE, compact Androids) and up a
// touch on large ones (Pro Max, big Androids). Web preview is capped at 430.
const SCREEN_W = Math.min(Dimensions.get('window').width || 390, 430);
export const scale = Math.max(0.84, Math.min(1.08, SCREEN_W / 390));
export const rs = (n) => Math.round(n * scale);
export const IS_SMALL = SCREEN_W < 360;

// The Balance Church — design tokens.
// Dark, near-black canvas (the logo lives white-on-black) with a warm gold accent
// taken from the 2026 "Year of Visibility" artwork and the website's accent-gold.

export const colors = {
  bg: '#060607',
  bgRaised: '#0C0C0E',
  surface: '#121215',
  surface2: '#18181C',
  surface3: '#202026',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.14)',

  text: '#F4F2EE',
  textSecondary: '#B4B0A8',
  textMuted: '#77746E',
  textFaint: '#4A4844',

  gold: '#D6AE5E',
  goldBright: '#F0CB7C',
  goldDeep: '#A67C32',
  goldSoft: 'rgba(214,174,94,0.12)',
  goldLine: 'rgba(214,174,94,0.32)',

  live: '#FF4D4D',
  success: '#5BD69B',
  danger: '#F27474',
  info: '#7DB4F5',

  overlay: 'rgba(0,0,0,0.55)',
  white: '#FFFFFF',
  black: '#000000',
};

export const fonts = {
  display: 'Montserrat_800ExtraBold',
  heading: 'Montserrat_700Bold',
  subheading: 'Montserrat_600SemiBold',
  label: 'Montserrat_600SemiBold',
  light: 'Montserrat_300Light',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  serif: 'PlayfairDisplay_600SemiBold',
  serifItalic: 'PlayfairDisplay_400Regular_Italic',
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 };
export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };
export const GUTTER = SCREEN_W < 360 ? 16 : 20;

export const type = {
  display: { fontFamily: fonts.display, fontSize: rs(32), lineHeight: rs(38), color: colors.text, letterSpacing: -0.6 },
  h1: { fontFamily: fonts.heading, fontSize: rs(26), lineHeight: rs(32), color: colors.text, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.heading, fontSize: rs(20), lineHeight: rs(26), color: colors.text, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.subheading, fontSize: 16, lineHeight: 22, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.textSecondary },
  bodySm: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 16, color: colors.textMuted },
  eyebrow: { fontFamily: fonts.label, fontSize: 11, letterSpacing: 2.2, textTransform: 'uppercase', color: colors.gold },
  scripture: { fontFamily: fonts.serifItalic, fontSize: 19, lineHeight: 29, color: colors.text },
};

export default { colors, fonts, space, radius, type, GUTTER };
