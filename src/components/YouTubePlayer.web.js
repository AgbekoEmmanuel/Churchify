import React from 'react';
import { View } from 'react-native';

export default function YouTubePlayer({ videoId, style }) {
  return (
    <View style={[{ aspectRatio: 16 / 9, backgroundColor: '#000', overflow: 'hidden' }, style]}>
      {React.createElement('iframe', {
        src: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
        style: { border: 0, width: '100%', height: '100%' },
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
        allowFullScreen: true,
        title: 'Sermon',
      })}
    </View>
  );
}
