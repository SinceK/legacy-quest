const HOPES = [
  { x: 150, d: "0s" },
  { x: 210, d: ".7s" },
  { x: 260, d: "1.3s" },
  { x: 120, d: "1.8s" },
];

export default function SceneJourney() {
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block" }}>
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
      </defs>
      <circle cx="300" cy="150" r="60" fill="#fbbf24" opacity="0.18" style={{ animation: "orbPulse 3s ease-in-out infinite" }} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={300 + Math.cos(a) * 34}
            y1={150 + Math.sin(a) * 34}
            x2={300 + Math.cos(a) * 54}
            y2={150 + Math.sin(a) * 54}
            stroke="#fcd34d"
            strokeWidth="2"
            opacity="0.55"
          />
        );
      })}
      <circle cx="300" cy="150" r="28" fill="url(#sun)" />
      <path d="M0 205 Q100 190 200 198 T400 196 L400 240 L0 240Z" fill="#3b2450" />
      <rect x="40" y="192" width="70" height="14" rx="4" fill="#0f5c43" />
      <rect x="285" y="158" width="80" height="14" rx="4" fill="#9a3412" />
      <path
        id="bridgePath"
        d="M95 196 Q200 214 320 168"
        fill="none"
        stroke="url(#bridge)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle r="4.5" fill="#ffffff">
        <animateMotion dur="1.9s" repeatCount="indefinite">
          <mpath href="#bridgePath" />
        </animateMotion>
      </circle>
      <g style={{ animation: "floatY 3s ease-in-out infinite" }}>
        <circle cx="74" cy="176" r="8" fill="#0b1020" stroke="#fcd34d" strokeWidth="1.2" />
        <path d="M62 200 L67 182 Q74 176 81 182 L86 200 Z" fill="#0b1020" stroke="#fcd34d" strokeWidth="1.2" />
      </g>
      {HOPES.map((s, i) => (
        <g key={i} style={{ animation: `hopeRise 2.4s ease-out ${s.d} infinite` }}>
          <path d={`M${s.x} 190 l3 5 l5 1 l-4 4 l1 6 l-5 -3 l-5 3 l1 -6 l-4 -4 l5 -1 z`} fill="#fde68a" />
        </g>
      ))}
    </svg>
  );
}
