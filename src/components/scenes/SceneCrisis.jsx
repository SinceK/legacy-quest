const BOLTS = [
  "M96 120 L82 210 L104 206 L88 300",
  "M312 140 L326 220 L306 216 L322 310",
  "M56 240 L44 292 L58 288 L48 340",
];
const SPARKS = [
  { x: 150, d: "0s" },
  { x: 250, d: ".6s" },
  { x: 180, d: "1.1s" },
  { x: 220, d: "1.6s" },
  { x: 205, d: "0.3s" },
];

/** 「このままでは王国が止まってしまう」——崩落する巨塔を前に鳴り響く警鐘。画面全体を紅く染める。 */
export default function SceneCrisis() {
  return (
    <svg
      viewBox="0 0 400 860"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="crisisAura" cx="50%" cy="34%" r="42%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="crisisTower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1414" />
          <stop offset="100%" stopColor="#0c0607" />
        </linearGradient>
        <linearGradient id="crisisGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#120608" />
          <stop offset="100%" stopColor="#030101" />
        </linearGradient>
      </defs>

      <rect
        x="0"
        y="0"
        width="400"
        height="860"
        fill="#7f1d1d"
        opacity="0.16"
        style={{ animation: "alertPulse 1.4s ease-in-out infinite" }}
      />
      <ellipse cx="200" cy="360" rx="220" ry="300" fill="url(#crisisAura)" />
      <path d="M-20 606 Q110 566 210 596 T420 588 L420 860 L-20 860Z" fill="url(#crisisGround)" />

      {/* 傾き、崩れ落ちる巨塔の残骸が背後に沈む */}
      <g style={{ transform: "rotate(-6deg)", transformOrigin: "80px 630px" }} opacity="0.75">
        <path
          d="M40 636 L40 540 L58 540 L58 500 L84 486 L96 502 L112 490 L124 540 L124 636 Z"
          fill="url(#crisisTower)"
          stroke="#7f1d1d"
          strokeWidth="2.4"
        />
      </g>
      <g style={{ transform: "rotate(5deg)", transformOrigin: "330px 630px" }} opacity="0.6">
        <path d="M290 636 L290 560 L306 560 L306 520 L336 520 L336 636 Z" fill="url(#crisisTower)" stroke="#7f1d1d" strokeWidth="2.4" />
      </g>

      {/* 稲妻 */}
      {BOLTS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#fde68a"
          strokeWidth="2.6"
          strokeLinecap="round"
          style={{ animation: `boltFlash 2.4s ${i * 0.6}s infinite`, filter: "drop-shadow(0 0 4px #fbbf24)" }}
        />
      ))}

      {/* 中央の警鐘紋章。ひび割れた二重の環と警告標 */}
      <g style={{ animation: "alertPulse 1s ease-in-out infinite" }}>
        <circle cx="200" cy="320" r="86" fill="none" stroke="#ef4444" strokeWidth="1.6" opacity="0.5" strokeDasharray="12 7" />
        <circle cx="200" cy="320" r="68" fill="none" stroke="#fca5a5" strokeWidth="1.2" opacity="0.35" />
        <polygon points="200,268 246,354 154,354" fill="none" stroke="#ef4444" strokeWidth="5" strokeLinejoin="round" />
        <polygon points="200,284 234,344 166,344" fill="#dc2626" opacity="0.3" />
        <rect x="194" y="298" width="12" height="32" rx="3" fill="#fca5a5" />
        <circle cx="200" cy="342" r="5" fill="#fca5a5" />
      </g>

      {/* 崩落から散る火の粉 */}
      {SPARKS.map((s, i) => (
        <rect
          key={i}
          x={s.x}
          y="420"
          width="5"
          height="5"
          fill="#fca5a5"
          style={{ animation: `debris 1.8s ease-in ${s.d} infinite`, filter: "drop-shadow(0 0 3px #ef4444)" }}
        />
      ))}
    </svg>
  );
}
