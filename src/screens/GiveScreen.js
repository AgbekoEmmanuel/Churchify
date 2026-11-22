import React, { useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { giving, givingAbroad } from '../data/church';
import { formatShortDate } from '../services/schedule';
import {
  Body, Button, Caption, Card, Chip, Display, Eyebrow, Field, H2, H3, PressScale, Screen, Scripture, SectionHeader, Small, tap,
} from '../components/ui';
import { colors, fonts, radius } from '../theme';

const spaced = (n) => n.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');

function CopyLine({ label, value, display }) {
  const [copied, setCopied] = useState(false);
  return (
    <Pressable
      onPress={async () => { await Clipboard.setStringAsync(value); tap(); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={styles.copyLine}
    >
      <View style={{ flex: 1 }}>
        <Caption>{label}</Caption>
        <Text style={styles.copyValue}>{display || value}</Text>
      </View>
      <View style={[styles.copyBtn, copied && { backgroundColor: 'rgba(91,214,155,0.15)', borderColor: 'rgba(91,214,155,0.4)' }]}>
        <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={14} color={copied ? colors.success : colors.gold} />
        <Text style={[styles.copyText, copied && { color: colors.success }]}>{copied ? 'Copied' : 'Copy'}</Text>
      </View>
    </Pressable>
  );
}

export default function GiveScreen() {
  const { isMember } = useAuth();
  const { gifts, logGift } = useStore();
  const [logOpen, setLogOpen] = useState(false);
  const [kind, setKind] = useState('Tithe');
  const [amount, setAmount] = useState('');

  const dial = () => {
    if (Platform.OS === 'web') return;
    Linking.openURL('tel:*170%23');
  };
  const record = () => {
    const n = parseFloat(amount);
    if (!n) return;
    logGift({ kind, amount: n });
    setAmount(''); setLogOpen(false);
  };
  const total = gifts.reduce((s, g) => s + g.amount, 0);

  return (
    <Screen>
      <View style={{ marginTop: 14 }}>
        <Eyebrow>Generosity in motion</Eyebrow>
        <Display style={{ marginTop: 6 }}>Stewardship</Display>
        <Body style={{ marginTop: 10 }}>
          Giving is an act of worship and a commitment to the flourishing of our church family. Your stewardship fuels the
          vision of The Balance Church.
        </Body>
      </View>

      <Card style={styles.verse}>
        <Scripture style={{ fontSize: 17, lineHeight: 26 }}>
          “Every man according as he purposeth in his heart, so let him give… for God loveth a cheerful giver.”
        </Scripture>
        <Text style={styles.ref}>— 2 Corinthians 9:7</Text>
      </Card>

      {giving.map((g) => (
        <View key={g.id} style={styles.giveCard}>
          <View style={styles.giveTop}>
            <View style={styles.giveIcon}><Ionicons name={g.icon} size={22} color={colors.gold} /></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <H2>{g.title}</H2>
              <Small style={{ marginTop: 2 }}>{g.blurb}</Small>
            </View>
          </View>
          <View style={styles.momoBadge}>
            <View style={styles.mtn}><Text style={styles.mtnText}>MTN</Text></View>
            <Caption style={{ color: colors.textSecondary }}>Mobile Money · {g.accountName}</Caption>
          </View>
          <CopyLine label="MoMo number" value={g.number} display={spaced(g.number)} />
          {g.merchantId ? <CopyLine label="Merchant ID (MoMoPay)" value={g.merchantId} /> : null}
          {g.merchantId ? (
            <Small style={{ marginTop: 12 }}>Dial *170#, choose MoMoPay and enter Merchant ID {g.merchantId}.</Small>
          ) : (
            <Small style={{ marginTop: 12 }}>Send to {spaced(g.number)} — reference “Offering”.</Small>
          )}
          {Platform.OS !== 'web' ? (
            <Button title="Open MoMo (*170#)" icon="keypad-outline" size="md" onPress={dial} style={{ marginTop: 14 }} />
          ) : null}
        </View>
      ))}

      <Card style={{ marginTop: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="globe-outline" size={20} color={colors.gold} />
          <H3 style={{ marginLeft: 10 }}>Giving from abroad</H3>
        </View>
        <Small style={{ marginTop: 8 }}>
          Use {givingAbroad.join(' or ')} to send to the MoMo numbers above (recipient: The Balance Church).
        </Small>
      </Card>

      {isMember ? (
        <>
          <SectionHeader eyebrow="Private to you" title="My giving record" action={logOpen ? 'Close' : 'Add'} onAction={() => setLogOpen((o) => !o)} />
          {logOpen ? (
            <Card style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', marginBottom: 14 }}>
                {['Tithe', 'Offering', 'Seed', 'Project'].map((k) => <Chip key={k} label={k} active={kind === k} onPress={() => setKind(k)} />)}
              </View>
              <Field label="Amount (GH₵)" icon="cash-outline" keyboardType="decimal-pad" placeholder="0.00" value={amount} onChangeText={setAmount} />
              <Button title="Record gift" size="md" onPress={record} disabled={!parseFloat(amount)} />
              <Caption style={{ marginTop: 10, textAlign: 'center' }}>For your own records — this does not move money.</Caption>
            </Card>
          ) : null}
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                <Caption>Total recorded</Caption>
                <Text style={styles.total}>GH₵ {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>
              <Caption>{gifts.length} gift{gifts.length === 1 ? '' : 's'}</Caption>
            </View>
            {gifts.slice(0, 6).map((g) => (
              <View key={g.id} style={styles.giftRow}>
                <Text style={styles.giftKind}>{g.kind}</Text>
                <Caption style={{ flex: 1, marginLeft: 10 }}>{formatShortDate(g.at)}</Caption>
                <Text style={styles.giftAmt}>GH₵ {g.amount.toFixed(2)}</Text>
              </View>
            ))}
            {!gifts.length ? <Small style={{ marginTop: 12 }}>Tap “Add” after giving to keep a personal record.</Small> : null}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  verse: { marginTop: 22, padding: 20, backgroundColor: colors.bgRaised, borderColor: colors.goldLine },
  ref: { fontFamily: fonts.label, fontSize: 12, color: colors.gold, marginTop: 10 },
  giveCard: { marginTop: 18, padding: 18, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  giveTop: { flexDirection: 'row', alignItems: 'center' },
  giveIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.goldLine, alignItems: 'center', justifyContent: 'center' },
  momoBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 6 },
  mtn: { backgroundColor: '#FFCC00', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  mtnText: { fontFamily: fonts.display, fontSize: 10, color: '#00468C' },
  copyLine: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong },
  copyValue: { fontFamily: fonts.display, fontSize: 22, color: colors.text, letterSpacing: 0.5, marginTop: 2 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, height: 32, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.goldLine, backgroundColor: colors.goldSoft },
  copyText: { fontFamily: fonts.label, fontSize: 12, color: colors.gold },
  total: { fontFamily: fonts.display, fontSize: 26, color: colors.text, marginTop: 4 },
  giftRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong, marginTop: 4 },
  giftKind: { fontFamily: fonts.label, fontSize: 13, color: colors.text },
  giftAmt: { fontFamily: fonts.subheading, fontSize: 14, color: colors.goldBright },
});
