import { useMemo } from "react";
import { RAIN_WORDS } from "../../content/index.js";

export default function CodeRain({ heavy = false, fast = false }) {
  const n = heavy ? 11 : 9;
  const cols = useMemo(
    () =>
      Array.from({ length: n }).map((_, i) => ({
        left: `${i * (100 / n) + 1}%`,
        dur: (7 + (i % 5) * 1.6) * (fast ? 0.35 : 1),
        delay: -(i * 1.3),
        words: Array.from({ length: 9 }).map(
          () => RAIN_WORDS[Math.floor(Math.random() * RAIN_WORDS.length)],
        ),
      })),
    [n, fast],
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {cols.map((c, i) => (
        <div
          key={i}
          className="absolute top-0 font-mono text-xs text-emerald-500"
          style={{
            left: c.left,
            opacity: heavy ? 0.2 : 0.13,
            animation: `fall ${c.dur}s linear infinite`,
            animationDelay: `${c.delay}s`,
            textShadow: "0 0 6px rgba(16,185,129,0.6)",
          }}
        >
          {c.words.map((w, j) => (
            <div key={j} className="mb-4">
              {w}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
