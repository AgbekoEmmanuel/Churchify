import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { fetchSermons, seedSermons } from '../services/youtube';

// Per-member local data: sermon notes, prayer requests, RSVPs, check-ins and a
// giving log. Persisted on device; ready to be synced to the backend later.
const StoreContext = createContext(null);
const empty = { notes: [], prayers: [], rsvps: [], checkins: [], gifts: [] };

export function StoreProvider({ children }) {
  const { member } = useAuth();
  const key = member ? `tbc.store.${member.id}` : null;
  const [data, setData] = useState(empty);
  const [sermons, setSermons] = useState(seedSermons);
  const [sermonsLoading, setSermonsLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!key) { setData(empty); return; }
    AsyncStorage.getItem(key)
      .then((raw) => alive && setData(raw ? { ...empty, ...JSON.parse(raw) } : empty))
      .catch(() => {});
    return () => { alive = false; };
  }, [key]);

  const refreshSermons = useCallback(async () => {
    setSermonsLoading(true);
    const list = await fetchSermons();
    setSermons(list);
    setSermonsLoading(false);
  }, []);

  useEffect(() => { refreshSermons(); }, [refreshSermons]);

  const update = useCallback((fn) => {
    setData((prev) => {
      const next = fn(prev);
      if (key) AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [key]);

  const api = useMemo(() => ({
    ...data,
    sermons,
    sermonsLoading,
    refreshSermons,
    saveNote: (note) => update((d) => {
      const now = new Date().toISOString();
      if (note.id) return { ...d, notes: d.notes.map((n) => (n.id === note.id ? { ...n, ...note, updatedAt: now } : n)) };
      return { ...d, notes: [{ ...note, id: `n${Date.now()}`, createdAt: now, updatedAt: now }, ...d.notes] };
    }),
    deleteNote: (id) => update((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) })),
    addPrayer: (p) => update((d) => ({ ...d, prayers: [{ ...p, id: `p${Date.now()}`, createdAt: new Date().toISOString(), status: 'Received' }, ...d.prayers] })),
    toggleRsvp: (eventId) => update((d) => ({ ...d, rsvps: d.rsvps.includes(eventId) ? d.rsvps.filter((x) => x !== eventId) : [...d.rsvps, eventId] })),
    addCheckin: (c) => update((d) => ({ ...d, checkins: [{ ...c, id: `c${Date.now()}`, at: new Date().toISOString() }, ...d.checkins] })),
    logGift: (g) => update((d) => ({ ...d, gifts: [{ ...g, id: `g${Date.now()}`, at: new Date().toISOString() }, ...d.gifts] })),
  }), [data, sermons, sermonsLoading, refreshSermons, update]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
