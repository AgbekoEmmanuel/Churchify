import React, { useEffect, useMemo, useState } from 'react';
import { Animated } from 'react-native';
import Svg, { Defs, Path, RadialGradient, Stop, Circle } from 'react-native-svg';

// Vector trace of The Balance Church mark (viewBox 648×596): an open ring in two
// arcs, four stacked stones and the ground line. Each stroke is drawn on with a
// dash offset driven by `progress` (0 → 1).

const CX = 324, CY = 298, RX = 312, RY = 292;
const rad = (d) => (d * Math.PI) / 180;

function sampleEllipse(cx, cy, rx, ry, fromDeg, toDeg, steps = 90) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = rad(fromDeg + ((toDeg - fromDeg) * i) / steps);
    pts.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);
  }
  return pts;
}
function toPath(pts) {
  let len = 0;
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return { d, len };
}

// [path, start, end, strokeWidth] — start/end are windows within progress 0..1
function buildStrokes() {
  return [
    { ...toPath(sampleEllipse(CX, CY, RX, RY, 156.6, 328.4, 80)), w: 7, from: 0.0, to: 0.5 },
    { ...toPath(sampleEllipse(CX, CY, RX, RY, 345.5, 499.4, 80)), w: 7, from: 0.08, to: 0.55 },
    { ...toPath([[92, 487], [548, 487]]), w: 6, from: 0.28, to: 0.5 },
    { ...toPath(sampleEllipse(320, 440, 90, 30, 180, 540)), w: 9, from: 0.38, to: 0.62 }, // bottom stone
    { ...toPath(sampleEllipse(322, 335, 218, 50, 180, 540)), w: 11, from: 0.48, to: 0.76 }, // widest
    { ...toPath(sampleEllipse(322, 228, 134, 40, 180, 540)), w: 10, from: 0.6, to: 0.86 },
    { ...toPath(sampleEllipse(322, 145, 60, 21, 180, 540)), w: 8, from: 0.72, to: 0.96 }, // top stone
  ];
}

export default function BalanceMark({ progress, size = 160, color = '#FFFFFF', glow = 0 }) {
  const strokes = useMemo(buildStrokes, []);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!progress) { setP(1); return; }
    const id = progress.addListener(({ value }) => setP(value));
    return () => progress.removeListener(id);
  }, [progress]);

  const h = size * (676 / 728);
  return (
    <Svg width={size} height={h} viewBox="-40 -40 728 676">
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#D6AE5E" stopOpacity={0.35 * glow} />
          <Stop offset="1" stopColor="#D6AE5E" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      {glow > 0 ? <Circle cx={CX} cy={CY} r={360} fill="url(#glow)" /> : null}
      {strokes.map((s, i) => {
        const local = Math.min(1, Math.max(0, (p - s.from) / (s.to - s.from)));
        if (local <= 0) return null;
        return (
          <Path
            key={i}
            d={s.d}
            stroke={color}
            strokeWidth={s.w}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={`${s.len} ${s.len}`}
            strokeDashoffset={s.len * (1 - local)}
          />
        );
      })}
    </Svg>
  );
}
