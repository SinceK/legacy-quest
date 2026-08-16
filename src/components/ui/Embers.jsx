import { useMemo } from "react";

/** 画面下から舞い上がる金色の火の粉。魔法的な空気を足す。 */
export default function Embers({ count = 26, color = "#fcd34d", intensity = 1 }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        bottom: -8 + Math.random() * 46,
        size: 1.5 + Math.random() * 3.2,
        dur: 7 + Math.random() * 9,
        delay: -Math.random() * 14,
        drift: `${(Math.random() - 0.5) * 70}px`,
        peak: 0.35 + Math.random() * 0.5,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${b.left}%`,
            bottom: `${b.bottom}%`,
            width: b.size,
            height: b.size,
            background: color,
            boxShadow: `0 0 ${b.size * 3}px ${color}`,
            "--drift": b.drift,
            "--peak": b.peak * intensity,
            animation: `emberRise ${b.dur}s linear ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
