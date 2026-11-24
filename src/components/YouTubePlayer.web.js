import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

// Web version of the in-app player: a plain YouTube iframe that reports its
// playback position back to the page (for "Watch on YouTube" at the same time).
export default function YouTubePlayer({ videoId, liveChannel, onTime, style }) {
  const ref = useRef(null);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const vars = `rel=0&modestbranding=1&enablejsapi=1&autoplay=1&playsinline=1&origin=${encodeURIComponent(origin)}`;
  const src = liveChannel
    ? `https://www.youtube.com/embed/live_stream?channel=${liveChannel}&${vars}`
    : `https://www.youtube.com/embed/${videoId}?${vars}`;

  useEffect(() => {
    const onMsg = (e) => {
      if (!/^https:\/\/(www\.)?youtube(-nocookie)?\.com$/.test(e.origin || '')) return;
      let d;
      try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (err) { return; }
      if (d && d.event === 'infoDelivery' && d.info && typeof d.info.currentTime === 'number' && onTime) onTime(d.info.currentTime);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [onTime]);

  const hello = () => {
    const w = ref.current && ref.current.contentWindow;
    if (!w) return;
    const send = () => w.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*');
    send();
    setTimeout(send, 800);
  };

  return (
    <View style={[{ aspectRatio: 16 / 9, backgroundColor: '#000', overflow: 'hidden' }, style]}>
      {React.createElement('iframe', {
        key: src,
        ref,
        src,
        onLoad: hello,
        style: { border: 0, width: '100%', height: '100%' },
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
        allowFullScreen: true,
        title: 'Sermon',
      })}
    </View>
  );
}
