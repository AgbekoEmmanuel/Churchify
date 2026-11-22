import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fellowships } from '../../data/church';
import { submitAccessRequest } from '../../services/auth';
import { Body, Button, Caption, Chip, Display, Eyebrow, Field, H2, Header, Screen, Small } from '../../components/ui';
import { colors, fonts, radius } from '../../theme';

const DURATIONS = ['Less than 3 months', '3–12 months', '1–3 years', '3+ years'];

export default function RequestAccessScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', fellowship: '', duration: '', note: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const e = {};
    if (form.name.trim().split(' ').length < 2) e.name = 'Please enter your first and last name.';
    if (form.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number.';
    if (!form.duration) e.duration = 'Let us know how long you’ve been attending.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    const res = await submitAccessRequest(form);
    setLoading(false);
    setDone(res);
  };

  if (done) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Header onBack={() => navigation.goBack()} transparent />
        <Screen edges={[]} contentStyle={{ paddingTop: 40, alignItems: 'center' }}>
          <View style={styles.okRing}><Ionicons name="checkmark" size={38} color={colors.gold} /></View>
          <Display style={{ textAlign: 'center', marginTop: 26 }}>Request sent</Display>
          <Body style={{ textAlign: 'center', marginTop: 10 }}>
            Thank you, {done.name.split(' ')[0]}. The church office will confirm your membership and send your Member ID
            and password to {done.phone} by SMS.
          </Body>
          <View style={styles.ref}>
            <Caption>Reference</Caption>
            <Text style={styles.refText}>{done.reference}</Text>
          </View>
          <Button title="Back to start" variant="secondary" onPress={() => navigation.popToTop()} style={{ alignSelf: 'stretch', marginTop: 28 }} />
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} title="Request access" />
      <Screen edges={[]} contentStyle={{ paddingTop: 20 }}>
        <Eyebrow>Join the family online</Eyebrow>
        <H2 style={{ marginTop: 8, fontSize: 24, lineHeight: 30 }}>Already worshipping with us?</H2>
        <Body style={{ marginTop: 8, marginBottom: 24 }}>
          Tell us who you are. Once the church office confirms you’re a member, you’ll receive your login details.
        </Body>

        <Field label="Full name" icon="person-outline" placeholder="First and last name" value={form.name} onChangeText={set('name')} error={errors.name} />
        <Field label="Phone number" icon="call-outline" placeholder="024 000 0000" keyboardType="phone-pad" value={form.phone} onChangeText={set('phone')} error={errors.phone} />
        <Field label="Email (optional)" icon="mail-outline" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={set('email')} />

        <Text style={styles.label}>How long have you been attending?</Text>
        <View style={styles.wrap}>
          {DURATIONS.map((d) => <View key={d} style={{ marginBottom: 8 }}><Chip label={d} active={form.duration === d} onPress={() => set('duration')(d)} /></View>)}
        </View>
        {errors.duration ? <Small style={{ color: colors.danger, marginTop: -2, marginBottom: 10 }}>{errors.duration}</Small> : null}

        <Text style={[styles.label, { marginTop: 10 }]}>Your fellowship (if you have one)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18, marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <Chip label="Not yet" active={form.fellowship === 'none'} onPress={() => set('fellowship')('none')} />
          {fellowships.map((f) => <Chip key={f.id} label={f.name} active={form.fellowship === f.id} onPress={() => set('fellowship')(f.id)} />)}
        </ScrollView>

        <Field label="Anything else? (optional)" placeholder="e.g. I was a first timer in March, invited by…" multiline value={form.note} onChangeText={set('note')} />

        <Button title="Send request" onPress={submit} loading={loading} icon="paper-plane-outline" />
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.label, fontSize: 12, color: colors.textSecondary, marginBottom: 10, letterSpacing: 0.3 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  okRing: { width: 92, height: 92, borderRadius: 46, borderWidth: 1.5, borderColor: colors.goldLine, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  ref: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 22, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  refText: { fontFamily: fonts.heading, color: colors.text, fontSize: 18, letterSpacing: 2, marginTop: 4 },
});
