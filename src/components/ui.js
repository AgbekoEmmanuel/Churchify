import React, { useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radius, space, type, GUTTER } from '../theme';

export const tap = (style = 'light') => {
  if (Platform.OS === 'web') return;
  try {
    Haptics.impactAsync(style === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
  } catch (e) {}
};

/* ---------- Typography ---------- */
// Respect the phone's text-size setting, but cap it so layouts don't break on
// phones set to the largest accessibility sizes.
const MAXF = 1.3;
export const Eyebrow = ({ style, ...p }) => <Text maxFontSizeMultiplier={1.15} style={[type.eyebrow, style]} {...p} />;
export const Display = ({ style, ...p }) => <Text maxFontSizeMultiplier={1.15} style={[type.display, style]} {...p} />;
export const H1 = ({ style, ...p }) => <Text maxFontSizeMultiplier={1.2} style={[type.h1, style]} {...p} />;
export const H2 = ({ style, ...p }) => <Text maxFontSizeMultiplier={1.2} style={[type.h2, style]} {...p} />;
export const H3 = ({ style, ...p }) => <Text maxFontSizeMultiplier={MAXF} style={[type.h3, style]} {...p} />;
export const Body = ({ style, ...p }) => <Text maxFontSizeMultiplier={MAXF} style={[type.body, style]} {...p} />;
export const Small = ({ style, ...p }) => <Text maxFontSizeMultiplier={MAXF} style={[type.bodySm, style]} {...p} />;
export const Caption = ({ style, ...p }) => <Text maxFontSizeMultiplier={MAXF} style={[type.caption, style]} {...p} />;
export const Scripture = ({ style, ...p }) => <Text maxFontSizeMultiplier={MAXF} style={[type.scripture, style]} {...p} />;

// Floating round button that sits below the status bar / notch / Dynamic Island
// on every phone (used over full-bleed hero images).
export function BackFab({ onPress, icon = 'chevron-back', right }) {
  const insets = useSafeAreaInsets();
  return (
    <PressScale
      onPress={onPress}
      style={{
        position: 'absolute', top: insets.top + 8, [right ? 'right' : 'left']: 16, width: 42, height: 42, borderRadius: 21,
        backgroundColor: 'rgba(0,0,0,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', zIndex: 10,
      }}
    >
      <Ionicons name={icon} size={20} color={colors.text} />
    </PressScale>
  );
}

/* ---------- Layout ---------- */
export function Screen({ children, scroll = true, padded = true, edges = ['top'], contentStyle, refreshControl, style }) {
  const inner = padded ? { paddingHorizontal: GUTTER } : null;
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {scroll ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={[inner, { paddingBottom: 120 }, contentStyle]}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <View style={[{ flex: 1 }, inner, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Header({ title, onBack, right, transparent, eyebrow }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 6 }, transparent && { backgroundColor: 'transparent', borderBottomWidth: 0 }]}>
      <View style={styles.headerSide}>
        {onBack ? <IconButton icon="chevron-back" onPress={onBack} /> : null}
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {eyebrow ? <Eyebrow style={{ fontSize: 9, marginBottom: 2 }}>{eyebrow}</Eyebrow> : null}
        {title ? <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text> : null}
      </View>
      <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

// Pressable that carries the layout style itself (so %, flex and absolute
// positioning behave) and dips slightly while pressed.
export function PressScale({ children, onPress, style, disabled, haptic = true, scaleTo = 0.97, ...rest }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={(e) => { if (haptic) tap(); onPress && onPress(e); }}
      style={({ pressed }) => [style, pressed && { transform: [{ scale: scaleTo }], opacity: 0.92 }]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

export function Button({ title, onPress, variant = 'primary', icon, iconRight, loading, disabled, style, size = 'lg' }) {
  const v = {
    primary: { bg: colors.gold, fg: '#141008', border: colors.gold },
    light: { bg: colors.text, fg: '#0B0B0C', border: colors.text },
    secondary: { bg: colors.surface2, fg: colors.text, border: colors.borderStrong },
    ghost: { bg: 'transparent', fg: colors.text, border: colors.borderStrong },
    danger: { bg: 'rgba(242,116,116,0.12)', fg: colors.danger, border: 'rgba(242,116,116,0.3)' },
  }[variant];
  const h = size === 'sm' ? 40 : size === 'md' ? 48 : 54;
  return (
    <PressScale
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, { height: h, backgroundColor: v.bg, borderColor: v.border, opacity: disabled ? 0.45 : 1 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={size === 'sm' ? 16 : 18} color={v.fg} style={{ marginRight: 8 }} /> : null}
          <Text style={[styles.btnText, { color: v.fg, fontSize: size === 'sm' ? 13 : 15 }]}>{title}</Text>
          {iconRight ? <Ionicons name={iconRight} size={18} color={v.fg} style={{ marginLeft: 8 }} /> : null}
        </>
      )}
    </PressScale>
  );
}

export function IconButton({ icon, onPress, size = 40, color = colors.text, badge, style, filled = true }) {
  return (
    <PressScale onPress={onPress} style={[{
      width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center',
      backgroundColor: filled ? colors.surface2 : 'transparent', borderWidth: filled ? 1 : 0, borderColor: colors.border,
    }, style]}>
      <Ionicons name={icon} size={size * 0.48} color={color} />
      {badge ? <View style={styles.badge} /> : null}
    </PressScale>
  );
}

export function Card({ children, style, onPress }) {
  if (onPress) return <PressScale onPress={onPress} style={[styles.card, style]}>{children}</PressScale>;
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({ title, eyebrow, action, onAction, style }) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Eyebrow style={{ marginBottom: 6 }}>{eyebrow}</Eyebrow> : null}
        <H2>{title}</H2>
      </View>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.sectionAction}>{action}</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.gold} style={{ marginLeft: 4 }} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function Chip({ label, active, onPress, icon }) {
  return (
    <PressScale onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      {icon ? <Ionicons name={icon} size={13} color={active ? '#141008' : colors.textSecondary} style={{ marginRight: 6 }} /> : null}
      <Text style={[styles.chipText, active && { color: '#141008' }]}>{label}</Text>
    </PressScale>
  );
}

export function Tag({ label, color = colors.gold, style }) {
  return (
    <View style={[styles.tag, { borderColor: color + '55', backgroundColor: color + '1A' }, style]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

export function Field({ label, icon, secure, error, style, inputStyle, multiline, right, ...props }) {
  const [hidden, setHidden] = useState(!!secure);
  const [focus, setFocus] = useState(false);
  return (
    <View style={[{ marginBottom: space.lg }, style]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={[styles.field, multiline && { height: undefined, minHeight: 120, alignItems: 'flex-start', paddingVertical: 14 },
        focus && { borderColor: colors.goldLine }, error && { borderColor: colors.danger }]}>
        {icon ? <Ionicons name={icon} size={18} color={focus ? colors.gold : colors.textMuted} style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }} /> : null}
        <TextInput
          placeholderTextColor={colors.textFaint}
          secureTextEntry={hidden}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          multiline={multiline}
          style={[styles.input, multiline && { textAlignVertical: 'top', minHeight: 92 }, Platform.OS === 'web' && { outlineStyle: 'none' }, inputStyle]}
          {...props}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={18} color={colors.textMuted} />
          </Pressable>
        ) : right}
      </View>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

export function Avatar({ name = '', size = 44, ring = true }) {
  const initials = name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, padding: ring ? 2 : 0, backgroundColor: ring ? colors.goldLine : 'transparent' }}>
      <View style={{ flex: 1, borderRadius: size / 2, backgroundColor: colors.surface3, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.heading, color: colors.goldBright, fontSize: size * 0.36 }}>{initials}</Text>
      </View>
    </View>
  );
}

export function Divider({ style }) {
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.borderStrong }, style]} />;
}

export function ListRow({ icon, title, subtitle, onPress, right, danger, last }) {
  return (
    <Pressable onPress={() => { tap(); onPress && onPress(); }} style={({ pressed }) => [styles.row, !last && styles.rowBorder, pressed && { opacity: 0.6 }]}>
      {icon ? (
        <View style={[styles.rowIcon, danger && { backgroundColor: 'rgba(242,116,116,0.12)' }]}>
          <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.gold} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, danger && { color: colors.danger }]}>{title}</Text>
        {subtitle ? <Caption style={{ marginTop: 2 }}>{subtitle}</Caption> : null}
      </View>
      {right !== undefined ? right : <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />}
    </Pressable>
  );
}

// Confirmation pop-up in the app's own style (instead of the phone's grey alert).
//   <ConfirmDialog visible title="Sign out?" message="…" confirmLabel="Sign out" danger
//     icon="log-out-outline" onConfirm={…} onCancel={…} />
export function ConfirmDialog({ visible, title, message, icon = 'help-circle-outline', confirmLabel = 'OK', cancelLabel = 'Cancel', danger, onConfirm, onCancel }) {
  const tint = danger ? colors.danger : colors.gold;
  return (
    <Modal visible={!!visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.dlgWrap}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.dlg}>
          <View style={[styles.dlgIcon, { backgroundColor: danger ? 'rgba(242,116,116,0.12)' : colors.goldSoft, borderColor: danger ? 'rgba(242,116,116,0.3)' : colors.goldLine }]}>
            <Ionicons name={icon} size={24} color={tint} />
          </View>
          <Text style={styles.dlgTitle}>{title}</Text>
          {message ? <Text style={styles.dlgMsg}>{message}</Text> : null}
          <View style={styles.dlgBtns}>
            <Button title={cancelLabel} variant="secondary" size="md" onPress={onCancel} style={{ flex: 1 }} />
            <Button title={confirmLabel} variant={danger ? 'danger' : 'primary'} size="md" onPress={onConfirm} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function EmptyState({ icon = 'sparkles-outline', title, body, action, onAction }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
      <View style={styles.emptyIcon}><Ionicons name={icon} size={26} color={colors.gold} /></View>
      <H3 style={{ textAlign: 'center', marginTop: 16 }}>{title}</H3>
      {body ? <Small style={{ textAlign: 'center', marginTop: 6 }}>{body}</Small> : null}
      {action ? <Button title={action} onPress={onAction} size="md" variant="secondary" style={{ marginTop: 20, paddingHorizontal: 22 }} /> : null}
    </View>
  );
}

export function MarkWatermark({ source, size = 220, style }) {
  return <Image source={source} style={[{ position: 'absolute', width: size, height: size * 0.92, opacity: 0.05, tintColor: colors.white }, style]} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 10,
    backgroundColor: colors.bg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  headerSide: { width: 56 },
  headerTitle: { fontFamily: fonts.subheading, fontSize: 16, color: colors.text },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, borderWidth: 1, paddingHorizontal: 20 },
  btnText: { fontFamily: fonts.label, letterSpacing: 0.2 },
  badge: { position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold, borderWidth: 1.5, borderColor: colors.surface2 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 34, marginBottom: 14 },
  sectionAction: { fontFamily: fonts.label, fontSize: 13, color: colors.gold },
  chip: {
    flexDirection: 'row', alignItems: 'center', height: 36, paddingHorizontal: 16, borderRadius: radius.pill,
    backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, marginRight: 8,
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { fontFamily: fonts.label, fontSize: 13, color: colors.textSecondary },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1 },
  tagText: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  fieldLabel: { fontFamily: fonts.label, fontSize: 12, color: colors.textSecondary, marginBottom: 8, letterSpacing: 0.3 },
  field: {
    flexDirection: 'row', alignItems: 'center', height: 54, paddingHorizontal: 16, borderRadius: radius.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  input: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 15, height: '100%' },
  fieldError: { color: colors.danger, fontFamily: fonts.body, fontSize: 12, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  rowIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  dlgWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  dlg: { width: '100%', maxWidth: 360, borderRadius: 26, backgroundColor: colors.bgRaised, borderWidth: 1, borderColor: colors.borderStrong, padding: 22, alignItems: 'center' },
  dlgIcon: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dlgTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.text, marginTop: 14, textAlign: 'center' },
  dlgMsg: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
  dlgBtns: { flexDirection: 'row', gap: 10, marginTop: 22, alignSelf: 'stretch' },
});
