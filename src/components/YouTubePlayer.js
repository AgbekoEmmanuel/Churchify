import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, fonts } from '../theme';

// In-app YouTube player (iOS / Android).
//
// The player runs inside a small HTML page that we give a real https origin
// (`baseUrl`). Without an origin/referrer, YouTube refuses to play embeds in a
// WebView ("Error 153"), which is why videos used to bounce people to YouTube.
//
// Props:
//   videoId     – a YouTube video id, or
//   liveChannel – a channel id, to show that channel's current livestream
//   onTime(sec) – called about once a second with the playback position, so the
//                 screen can offer "Watch on YouTube" from the same moment
const ORIGIN = 'https://thebalancechurch.app';

function buildHtml({ videoId, liveChannel }) {
  const vars = 'playsinline=1&rel=0&modestbranding=1&enablejsapi=1&autoplay=1';
  const src = liveChannel
    ? `https://www.youtube.com/embed/live_stream?channel=${liveChannel}&${vars}&origin=${ORIGIN}`
    : `https://www.youtube.com/embed/${videoId}?${vars}&origin=${ORIGIN}`;
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="referrer" content="strict-origin-when-cross-origin">
<style>html,body{margin:0;padding:0;background:#000;height:100%;overflow:hidden}iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}</style>
</head><body>
<iframe id="yt" src="${src}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
<script>
  var f = document.getElementById('yt');
  function post(m){ try { window.ReactNativeWebView.postMessage(JSON.stringify(m)); } catch(e){} }
  // Ask the embedded player to stream its state (current time, errors) to us.
  f.addEventListener('load', function(){
    var hello = function(){ f.contentWindow.postMessage(JSON.stringify({event:'listening', id:1, channel:'widget'}), '*'); };
    hello(); setTimeout(hello, 800);
  });
  window.addEventListener('message', function(e){
    var d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch(err) { return; }
    if (!d) return;
    if (d.event === 'infoDelivery' && d.info && typeof d.info.currentTime === 'number') post({type:'time', t:d.info.currentTime});
    if (d.event === 'onError') post({type:'error', code:d.info});
  });
</script>
</body></html>`;
}

export default function YouTubePlayer({ videoId, liveChannel, onTime, style }) {
  const [error, setError] = useState(null);
  const html = useMemo(() => buildHtml({ videoId, liveChannel }), [videoId, liveChannel]);

  const onMessage = (e) => {
    let m;
    try { m = JSON.parse(e.nativeEvent.data); } catch (err) { return; }
    if (m.type === 'time' && onTime) onTime(m.t);
    if (m.type === 'error') setError(m.code);
  };

  return (
    <View style={[{ aspectRatio: 16 / 9, backgroundColor: '#000', overflow: 'hidden' }, style]}>
      <WebView
        key={videoId || liveChannel}
        source={{ html, baseUrl: ORIGIN }}
        originWhitelist={['*']}
        onMessage={onMessage}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        bounces={false}
        scrollEnabled={false}
        style={{ backgroundColor: '#000' }}
      />
      {error ? (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.86)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontFamily: fonts.label, fontSize: 14, color: colors.text, textAlign: 'center' }}>This video can’t play inside the app.</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary, marginTop: 6, textAlign: 'center' }}>Use “Watch on YouTube” below.</Text>
        </View>
      ) : null}
    </View>
  );
}
