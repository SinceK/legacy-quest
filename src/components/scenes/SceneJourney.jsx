const HOPES = [
  { x: 150, d: "0s" },
  { x: 250, d: ".7s" },
  { x: 300, d: "1.3s" },
  { x: 110, d: "1.8s" },
];
const RAYS = 12;

/** COBOLの地からJavaの地へ。旅立ちの橋を渡る、選ばれし新人の後ろ姿を画面いっぱいに描く。 */
export default function SceneJourney() {
  return (
    <svg
      viewBox="0 0 400 860"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <linearGradient id="bridge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <linearGradient id="cliffCobol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f5c43" />
          <stop offset="100%" stopColor="#062a1e" />
        </linearGradient>
        <linearGradient id="cliffJava" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#431407" />
        </linearGradient>
        <linearGradient id="journeyGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241537" />
          <stop offset="100%" stopColor="#0a0512" />
        </linearGradient>
      </defs>

      {/* 陽光の環 */}
      <circle cx="260" cy="270" rx="120" ry="120" fill="#fbbf24" opacity="0.14" style={{ animation: "orbPulse 3s ease-in-out infinite" }} />
      <g style={{ transformOrigin: "260px 270px", animation: "spin 40s linear infinite" }}>
        {Array.from({ length: RAYS }).map((_, i) => {
          const a = (i / RAYS) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={260 + Math.cos(a) * 56}
              y1={270 + Math.sin(a) * 56}
              x2={260 + Math.cos(a) * 96}
              y2={270 + Math.sin(a) * 96}
              stroke="#fcd34d"
              strokeWidth="2.4"
              opacity="0.5"
            />
          );
        })}
      </g>
      <circle cx="260" cy="270" r="46" fill="url(#sun)" />

      {/* 両岸に連なる遠山。左＝COBOLの地、右＝Javaの地 */}
      <path d="M-30 560 L60 420 L150 486 L220 440 L270 560 Z" fill="url(#cliffCobol)" opacity="0.85" />
      <path d="M250 560 L320 460 L380 500 L430 400 L470 560 Z" fill="url(#cliffJava)" opacity="0.85" />

      {/* 手前の断崖と地面 */}
      <path d="M-20 606 Q110 566 210 596 T420 588 L420 860 L-20 860Z" fill="url(#journeyGround)" />
      <path d="M20 590 L120 590 L120 618 L20 618 Z" fill="url(#cliffCobol)" />
      <path d="M280 500 L380 500 L380 528 L280 528 Z" fill="url(#cliffJava)" />

      {/* 二つの地をつなぐ橋 */}
      <path
        id="bridgePath"
        d="M100 596 Q220 636 340 512"
        fill="none"
        stroke="url(#bridge)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle r="5" fill="#ffffff">
        <animateMotion dur="1.9s" repeatCount="indefinite">
          <mpath href="#bridgePath" />
        </animateMotion>
      </circle>

      {/* 橋を渡る旅人の後ろ姿。マントと杖を持つシルエット */}
      <g style={{ animation: "floatY 2.6s ease-in-out infinite" }}>
        <circle cx="212" cy="592" r="9" fill="#0b1020" stroke="#fcd34d" strokeWidth="1.4" />
        <path d="M198 626 Q204 598 212 592 Q220 598 226 626 Q212 636 198 626 Z" fill="#0b1020" stroke="#fcd34d" strokeWidth="1.4" />
        <line x1="228" y1="600" x2="238" y2="634" stroke="#fcd34d" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* 立ちのぼる希望の光 */}
      {HOPES.map((s, i) => (
        <g key={i} style={{ animation: `hopeRise 2.4s ease-out ${s.d} infinite` }}>
          <path d={`M${s.x} 540 l3 6 l6 1 l-5 5 l1 7 l-5 -4 l-6 4 l1 -7 l-5 -5 l6 -1 z`} fill="#fde68a" />
        </g>
      ))}
    </svg>
  );
}
