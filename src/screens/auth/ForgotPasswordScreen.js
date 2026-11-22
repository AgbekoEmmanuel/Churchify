import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { requestPasswordReset } from '../../services/auth';
import { church } from '../../data/church';
import { Body, Button, Display, Eyebrow, Field, Header, Screen } from '../../components/ui';
import { colors } from '../../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!id.trim()) return;
    setLoading(true);
    await requestPasswordReset(id);
    setLoading(false);
    setSent(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header onBack={() => navigation.goBack()} transparent />
      <Screen edges={[]} contentStyle={{ paddingTop: 12 }}>
        <Eyebrow>Account help</Eyebrow>
        <Display style={{ marginTop: 8 }}>{sent ? 'Check your phone' : 'Reset password'}</Display>
        <Body style={{ marginTop: 8, marginBottom: 26 }}>
          {sent
            ? 'If that account exists, we’ve sent a reset code by SMS to the phone number on your member record.'
            : 'Enter your Member ID or phone number. We’ll text a reset code to the number registered with the church office.'}
        </Body>
        {!sent ? (
          <>
            <Field label="Member ID or phone number" icon="person-outline" value={id} onChangeText={setId} autoCapitalize="characters" />
            <Button title="Send reset code" onPress={submit} loading={loading} />
          </>
        ) : (
          <Button title="Back to sign in" onPress={() => navigation.goBack()} />
        )}
        <Button
          title="Call the church office"
          variant="ghost"
          icon="call-outline"
          onPress={() => Linking.openURL(`tel:${church.phoneRaw}`)}
          style={{ marginTop: 12 }}
        />
      </Screen>
    </View>
  );
}
