import { useId, useMemo } from "react";

/**
 * feTurbulence のフラクタルノイズで雲海を描く。
 * 3層を別々の速度で流して視差を出し、奥行きのある夜空にする。
 * 画像を持たないので読み込み待ちがなく、どの解像度でも滲まない。
 */
const LAYERS = [
  // 遠景のうすい霞
  {
    freq: "0.0030 0.0070",
    octaves: 4,
    seed: 11,
    rgb: [0.09, 0.18, 0.22],
    boost: 1.35,
    offset: -0.44,
    opacity: 0.5,
    dx: "-5%",
    dur: 190,
    inset: "-18% -30%",
  },
  // 主役の雲
  {
    freq: "0.0060 0.0130",
    octaves: 4,
    seed: 5,
    rgb: [0.14, 0.26, 0.29],
    boost: 1.6,
    offset: -0.52,
    opacity: 0.46,
    dx: "-13%",
    dur: 115,
    inset: "-12% -35%",
  },
  // 手前を横切る低い霧
  {
    freq: "0.0110 0.0210",
    octaves: 3,
    seed: 23,
    rgb: [0.04, 0.10, 0.13],
    boost: 1.85,
    offset: -0.55,
    opacity: 0.62,
    dx: "-27%",
    dur: 72,
    inset: "34% -45% -20% -45%",
    // 上端が直線で切れて見えないよう、フェードさせる
    mask: "linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%)",
  },
];

export default function NightSky({ intensity = 1, moon = true, push = false, showBase = true }) {
  const rawId = useId();
  const uid = useMemo(() => rawId.replace(/[^a-zA-Z0-9]/g, ""), [rawId]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={push ? { animation: "skyPush 26s ease-out both" } : undefined}
    >
      {/* 空の地色。既に背景がある画面ではshowBase=falseで雲だけ重ねる */}
      {showBase && (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg,#03060d 0%,#06131c 42%,#04202180 70%,#020508 100%)" }}
        />
      )}

      {/* 月あかり */}
      {moon && (
        <div
          className="absolute"
          style={{
            left: "62%",
            top: "-14%",
            width: "70%",
            paddingBottom: "70%",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(186,230,253,0.16), rgba(56,189,248,0.05) 42%, transparent 68%)",
            animation: "orbPulse 9s ease-in-out infinite",
          }}
        />
      )}

      {LAYERS.map((l, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            inset: l.inset,
            opacity: l.opacity * intensity,
            "--dx": l.dx,
            animation: `cloudDrift ${l.dur}s linear infinite alternate`,
            willChange: "transform",
            ...(l.mask ? { maskImage: l.mask, WebkitMaskImage: l.mask } : null),
          }}
        >
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <filter id={`${uid}c${i}`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency={l.freq} numOctaves={l.octaves} seed={l.seed} />
              {/* ノイズの赤成分を透明度に変換し、単色の雲として塗る */}
              <feColorMatrix
                type="matrix"
                values={`0 0 0 0 ${l.rgb[0]}  0 0 0 0 ${l.rgb[1]}  0 0 0 0 ${l.rgb[2]}  ${l.boost} 0 0 0 ${l.offset}`}
              />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${uid}c${i})`} />
          </svg>
        </div>
      ))}

      {/* 周辺減光。中央へ視線を集める */}
      {showBase && (
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 46%, transparent 32%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.88) 100%)",
          }}
        />
      )}
    </div>
  );
}
