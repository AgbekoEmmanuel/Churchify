import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CREDENTIALS } from '../../services/auth';
import { brand } from '../../data/church';
import { Body, Button, Caption, Display, Eyebrow, Field, Header, Screen, Small, tap } from '../../components/ui';
import { colors, fonts, radius } from '../../theme';

export default function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!identifier.trim() || !password) { setError('Enter your Member ID (or phone number) and password.'); return; }
    setLoading(true);
    try {
      await signIn(identifier, password);
      tap('medium');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} transparent />
        <Screen edges={[]} contentStyle={{ paddingTop: 8 }}>
          <Image source={brand.mark} style={styles.mark} resizeMode="contain" />
          <Eyebrow style={{ marginTop: 22 }}>Members only</Eyebrow>
          <Display style={{ marginTop: 8 }}>Welcome back.</Display>
          <Body style={{ marginTop: 8, marginBottom: 28 }}>
            Sign in with the Member ID or phone number registered with the church office.
          </Body>

          <Field
            label="Member ID or phone number"
            icon="person-outline"
            placeholder="e.g. TBC-0427 or 024 123 4567"
            autoCapitalize="characters"
            autoCorrect={false}
            value={identifier}
            onChangeText={setIdentifier}
            returnKeyType="next"
          />
          <Field
            label="Password"
            icon="key-outline"
            placeholder="Your password"
            secure
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={submit}
            returnKeyType="go"
          />

          <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginTop: -4, marginBottom: 22 }} hitSlop={8}>
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>

          {error ? (
            <View style={styles.error}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Small style={{ color: colors.danger, flex: 1, marginLeft: 10 }}>{error}</Small>
            </View>
          ) : null}

          <Button title="Sign in" onPress={submit} loading={loading} iconRight="arrow-forward" />

          <View style={styles.info}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.gold} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Why can’t I sign up?</Text>
              <Caption style={{ lineHeight: 18, marginTop: 4 }}>
                This app is for members of The Balance Church. Accounts are created by the church office once your
                membership is confirmed, so what’s shared here stays within the family.
              </Caption>
              <Pressable onPress={() => navigation.navigate('RequestAccess')} hitSlop={8} style={{ marginTop: 10 }}>
                <Text style={styles.link}>Request member access →</Text>
              </Pressable>
            </View>
          </View>

          {__DEV__ ? (
            <Pressable
              onPress={() => { setIdentifier(DEMO_CREDENTIALS.identifier); setPassword(DEMO_CREDENTIALS.password); }}
              style={styles.demo}
            >
              <Ionicons name="flask-outline" size={16} color={colors.info} />
              <Caption style={{ color: colors.info, marginLeft: 8, flex: 1 }}>
                Preview build · tap to fill demo member {DEMO_CREDENTIALS.identifier} / {DEMO_CREDENTIALS.password}
              </Caption>
            </Pressable>
          ) : null}
        </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: { width: 54, height: 50, tintColor: colors.white },
  link: { fontFamily: fonts.label, fontSize: 13, color: colors.gold },
  error: {
    flexDirection: 'row', alignItems: 'flex-start', padding: 14, borderRadius: radius.md, marginBottom: 18,
    backgroundColor: 'rgba(242,116,116,0.08)', borderWidth: 1, borderColor: 'rgba(242,116,116,0.25)',
  },
  info: {
    flexDirection: 'row', marginTop: 28, padding: 16, borderRadius: radius.lg,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  infoTitle: { fontFamily: fonts.subheading, fontSize: 14, color: colors.text },
  demo: {
    flexDirection: 'row', alignItems: 'center', marginTop: 16, padding: 12, borderRadius: radius.md,
    borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(125,180,245,0.4)',
  },
});
