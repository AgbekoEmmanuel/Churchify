import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function YouTubePlayer({ videoId, style }) {
  return (
    <View style={[{ aspectRatio: 16 / 9, backgroundColor: '#000', overflow: 'hidden' }, style]}>
      <WebView
        source={{ uri: `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1` }}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        style={{ backgroundColor: '#000' }}
      />
    </View>
  );
}
