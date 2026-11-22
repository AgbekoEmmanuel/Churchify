import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInMember } from '../services/auth';

const KEY = 'tbc.session.v1';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // status: 'loading' | 'signedOut' | 'guest' | 'member'
  const [status, setStatus] = useState('loading');
  const [member, setMember] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s.mode === 'member' && s.profile) {
            setMember(s.profile);
            setStatus('member');
            return;
          }
        }
      } catch (e) {}
      setStatus('signedOut');
    })();
  }, []);

  const signIn = useCallback(async (identifier, password) => {
    const { token, profile } = await signInMember(identifier, password);
    await AsyncStorage.setItem(KEY, JSON.stringify({ mode: 'member', token, profile })).catch(() => {});
    setMember(profile);
    setStatus('member');
    return profile;
  }, []);

  const continueAsGuest = useCallback(() => {
    setMember(null);
    setStatus('guest');
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(KEY).catch(() => {});
    setMember(null);
    setStatus('signedOut');
  }, []);

  const value = useMemo(
    () => ({ status, member, isMember: status === 'member', isGuest: status === 'guest', signIn, signOut, continueAsGuest }),
    [status, member, signIn, signOut, continueAsGuest]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
