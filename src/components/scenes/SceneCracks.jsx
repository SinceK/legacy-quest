const CRACKS = [
  "M192 320 L184 366 L200 400 L188 450 L198 508",
  "M192 344 L216 372 L206 408 L230 452",
  "M192 358 L166 382 L176 416 L150 456",
  "M210 328 L234 350 L224 382",
  "M180 372 L156 392 L164 420",
];
const DEBRIS = [
  { x: 176, d: "0s" },
  { x: 210, d: ".5s" },
  { x: 150, d: "1s" },
  { x: 232, d: "1.4s" },
  { x: 194, d: "0.8s" },
];
const SMOKE = [
  { x: 168, d: "0s" },
  { x: 210, d: "1.6s" },
  { x: 232, d: "0.9s" },
];

/** 老いた巨塔のあちこちに亀裂が走り、崩落が始まる瞬間。画面いっぱいに歪んだ塔がそびえる。 */
export default function SceneCracks() {
  return (
    <svg
      viewBox="0 0 400 860"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      style={{ display: "block", animation: "rumble 0.4s ease-in-out infinite" }}
    >
      <defs>
        <linearGradient id="cracksTower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b2350" />
          <stop offset="100%" stopColor="#160c22" />
        </linearGradient>
        <radialGradient id="cracksAura" cx="50%" cy="38%" r="46%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cracksGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#160c22" />
          <stop offset="100%" stopColor="#050208" />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="280" rx="230" ry="320" fill="url(#cracksAura)" />
      <path d="M-20 606 Q110 566 210 596 T420 588 L420 860 L-20 860Z" fill="url(#cracksGround)" />

      {/* 崩れ始めた大聖堂塔。頂は欠け、輪郭がもはや整っていない */}
      <path
        d="M140 640 L140 500 L160 500 L160 430 L180 430 L180 380 L192 358 L200 372 L212 352 L222 372 L220 380 L220 430 L240 430 L240 500 L260 500 L260 640 Z"
        fill="url(#cracksTower)"
        stroke="#7c3aed"
        strokeWidth="2.6"
        opacity="0.92"
      />

      {/* 消えかけた窓明かり */}
      <g fill="#f59e0b" opacity="0.45">
        <rect x="164" y="540" width="12" height="16" rx="1" style={{ animation: "flicker 1.4s infinite" }} />
        <rect x="212" y="540" width="12" height="16" rx="1" style={{ animation: "flicker 1.1s infinite" }} />
        <rect x="188" y="580" width="12" height="16" rx="1" style={{ animation: "flicker 0.9s infinite" }} />
      </g>

      {/* 崩落で舞う塵 */}
      {SMOKE.map((s, i) => (
        <ellipse
          key={i}
          cx={s.x}
          cy="420"
          rx="12"
          ry="7"
          fill="#6d28d9"
          opacity="0.3"
          style={{ filter: "blur(2px)", animation: `driftUp ${4 + i}s ease-out ${s.d} infinite` }}
        />
      ))}

      {/* 走る亀裂 */}
      {CRACKS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#fca5a5"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{
            strokeDasharray: 260,
            strokeDashoffset: 260,
            animation: `crackDraw 1.3s ease-out ${i * 0.3}s forwards`,
            filter: "drop-shadow(0 0 3px #ef4444)",
          }}
        />
      ))}

      {/* 崩れ落ちる破片 */}
      {DEBRIS.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y="420"
          width="7"
          height="7"
          fill="#a78bfa"
          style={{ animation: `debris 1.6s ease-in ${p.d} infinite` }}
        />
      ))}

      <rect x="0" y="0" width="400" height="860" fill="#ef4444" opacity="0.06" />
    </svg>
  );
}
