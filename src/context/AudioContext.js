import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { fetchEpisodes, seedEpisodes } from '../services/podcast';
import { spotify } from '../data/church';

// One sermon-audio player for the whole app, so a message keeps playing while
// members move between screens (and, on phones, with the screen locked).
//
// Two contexts: `useAudio()` is stable (episodes + controls) and `useAudioStatus()`
// ticks while playing, so only the player UI re-renders every half second.
const AudioCtx = createContext(null);
const StatusCtx = createContext(null);

export function AudioProvider({ children }) {
  const player = useAudioPlayer(null, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);
  const [current, setCurrent] = useState(null);
  const [episodes, setEpisodes] = useState(seedEpisodes);
  const [loading, setLoading] = useState(false);
  const [rate, setRateState] = useState(1);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' }).catch(() => {});
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setEpisodes(await fetchEpisodes());
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const play = useCallback((ep) => {
    if (current && current.id === ep.id) { player.play(); return; }
    setCurrent(ep);
    player.replace({ uri: ep.audioUrl });
    player.play();
    try {
      if (player.setActiveForLockScreen) {
        player.setActiveForLockScreen(true, { title: ep.title, artist: 'Apostle Michael Dadzie', albumTitle: spotify.title, artworkUrl: ep.image });
      }
    } catch (e) {}
  }, [current, player]);

  const api = useMemo(() => ({
    episodes,
    loading,
    refresh,
    current,
    rate,
    play,
    pause: () => player.pause(),
    resume: () => player.play(),
    toggle: () => (player.playing ? player.pause() : player.play()),
    seekTo: (sec) => player.seekTo(Math.max(0, sec)),
    skip: (delta) => player.seekTo(Math.max(0, (player.currentTime || 0) + delta)),
    setRate: (r) => { setRateState(r); try { player.setPlaybackRate(r); } catch (e) {} },
    stop: () => {
      player.pause();
      try { player.clearLockScreenControls && player.clearLockScreenControls(); } catch (e) {}
      setCurrent(null);
    },
  }), [episodes, loading, refresh, current, rate, play, player]);

  return (
    <AudioCtx.Provider value={api}>
      <StatusCtx.Provider value={status}>{children}</StatusCtx.Provider>
    </AudioCtx.Provider>
  );
}

export const useAudio = () => useContext(AudioCtx);
export const useAudioStatus = () => useContext(StatusCtx) || {};
