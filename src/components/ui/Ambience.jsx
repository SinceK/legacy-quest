import { useMemo } from "react";

export function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 46 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 78,
        r: Math.random() * 1.6 + 0.4,
        d: Math.random() * 3,
        dur: 2 + Math.random() * 3,
      })),
    [],
  );
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#e2e8f0"
          style={{ animation: `twinkle ${s.dur}s ease-in-out ${s.d}s infinite` }}
        />
      ))}
    </svg>
  );
}

export function Motes({ color = "#5eead4" }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 16 }).map(() => ({
        left: Math.random() * 100,
        size: Math.random() * 5 + 2,
        delay: Math.random() * 6,
        dur: 6 + Math.random() * 5,
        bottom: Math.random() * 30,
      })),
    [],
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            bottom: `${m.bottom}%`,
            width: m.size,
            height: m.size,
            background: color,
            boxShadow: `0 0 8px ${color}`,
            animation: `driftUp ${m.dur}s linear ${m.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function Sparkles() {
  const spots = [
    { l: "8%", t: "20%", d: "0ms", s: "✦" },
    { l: "88%", t: "16%", d: "80ms", s: "✧" },
    { l: "20%", t: "70%", d: "160ms", s: "⭐" },
    { l: "78%", t: "66%", d: "120ms", s: "✦" },
    { l: "50%", t: "6%", d: "40ms", s: "✧" },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {spots.map((sp, i) => (
        <span
          key={i}
          className="absolute text-amber-300 text-lg"
          style={{ left: sp.l, top: sp.t, animation: "sparkle .7s ease-out forwards", animationDelay: sp.d }}
        >
          {sp.s}
        </span>
      ))}
    </div>
  );
}
