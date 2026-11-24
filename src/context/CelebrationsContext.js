import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { fetchUpcomingBirthdays } from '../services/churchDb';
import { birthdays as sampleBirthdays } from '../data/celebrations';
import { getFellowship } from '../data/church';

// Birthdays for the members app, read from the church database (the tracker's
// birthday list). Members only: nothing is fetched for guests.
//
// source: 'church'  – live from the church database (cached for offline)
//         'sample'  – the database function isn't set up yet, so sample names show
const CACHE = 'tbc.celebrations.v1';
const Ctx = createContext(null);

const mmdd = (m, d) => `${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const fromDb = (rows) => rows.map((r) => ({
  id: r.id,
  name: r.name,
  fellowshipName: r.fellowship || '',
  date: mmdd(r.birth_month, r.birth_day),
}));

const samples = () => ({
  birthdays: sampleBirthdays.map((b) => ({ ...b, fellowshipName: (getFellowship(b.fellowshipId) || {}).name || '' })),
});

export function CelebrationsProvider({ children }) {
  const { isMember } = useAuth();
  const [state, setState] = useState({ ...samples(), source: 'sample', loading: false, updatedAt: null });

  const refresh = useCallback(async () => {
    if (!isMember) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      const rows = await fetchUpcomingBirthdays(31);
      const next = { birthdays: fromDb(rows), source: 'church', updatedAt: new Date().toISOString() };
      setState({ ...next, loading: false });
      AsyncStorage.setItem(CACHE, JSON.stringify(next)).catch(() => {});
    } catch (e) {
      // Offline or not set up yet: keep the last church copy if we have one.
      let cached = null;
      try { cached = JSON.parse((await AsyncStorage.getItem(CACHE)) || 'null'); } catch (err) {}
      if (cached && cached.source === 'church') setState({ ...cached, loading: false, stale: true });
      else setState({ ...samples(), source: 'sample', loading: false, reason: e.message });
    }
  }, [isMember]);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo(() => ({ ...state, refresh }), [state, refresh]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCelebrations = () => useContext(Ctx) || { ...samples(), source: 'sample', refresh: () => {} };
