import { useMemo } from "react";

/** 渦を巻きながら中心へ収束していく軌跡（SVGパス文字列）を作る。 */
function spiralPath(startAngle, startR, endR, turns, cx, cy) {
  const steps = 26;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle + turns * Math.PI * 2 * t;
    const r = startR + (endR - startR) * t;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)} ${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return "M" + pts.join(" L");
}

/**
 * 無数の金色の光の粒が夜空を渦巻きながら中心へ吸い込まれていく演出。
 * ロゴが実体として飛来するのではなく、光の粒が寄り集まって形をなす、という
 * 魔法的な収束の見せ方をしたいときに使う。
 */
export default function MagicDust({ count = 30, cx = 200, cy = 150, durationMs = 3200, startMs = 300 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const startR = 130 + Math.random() * 100;
        const turns = 0.55 + Math.random() * 0.85;
        const dur = durationMs / 1000 - Math.random() * 0.5;
        const begin = startMs / 1000 + Math.random() * 0.6;
        return {
          id: i,
          path: spiralPath(angle, startR, 3 + Math.random() * 8, turns, cx, cy),
          dur: Math.max(dur, 0.8),
          begin,
          size: 1.3 + Math.random() * 2,
        };
      }),
    [count, cx, cy, durationMs, startMs],
  );

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid meet"
    >
      {particles.map((p) => (
        <g key={p.id}>
          <path id={`dust${p.id}`} d={p.path} fill="none" opacity="0" />
          <circle r={p.size} fill="#fde68a" opacity="0" filter="drop-shadow(0 0 3px #fde68a)">
            <animateMotion dur={`${p.dur}s`} begin={`${p.begin}s`} fill="freeze">
              <mpath href={`#dust${p.id}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;0.95;0.9;0"
              keyTimes="0;0.1;0.7;1"
              dur={`${p.dur}s`}
              begin={`${p.begin}s`}
              fill="freeze"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}
