import { useMemo } from "react";

/**
 * 雲間から差し込む光条（ゴッドレイ）。
 * 数本の縦長グラデーションを薄く重ねてゆっくり揺らすだけで、
 * 画像なしに「光が差し込んでいる」空気感を出す。
 */
export default function LightRays({ count = 5, tint = "#fde68a", intensity = 1 }) {
  const rays = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: 8 + (84 / Math.max(count - 1, 1)) * i + (Math.random() * 10 - 5),
        width: 9 + Math.random() * 9,
        rotate: -20 + Math.random() * 14,
        delay: -Math.random() * 12,
        dur: 13 + Math.random() * 9,
        opacity: 0.1 + Math.random() * 0.12,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ mixBlendMode: "screen" }}>
      {rays.map((r, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: "-25%",
            bottom: "-10%",
            left: `${r.left}%`,
            width: `${r.width}%`,
            background: `linear-gradient(180deg, transparent, ${tint}, transparent 78%)`,
            opacity: r.opacity * intensity,
            transform: `rotate(${r.rotate}deg)`,
            filter: "blur(9px)",
            animation: `raySway ${r.dur}s ease-in-out ${r.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
