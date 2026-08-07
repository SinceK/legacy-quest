const BOLTS = ["M120 40 L110 90 L128 88 L116 140", "M290 50 L302 96 L286 94 L298 150"];

export default function SceneCrisis() {
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block" }}>
      <rect
        x="0"
        y="0"
        width="400"
        height="240"
        fill="#7f1d1d"
        opacity="0.16"
        style={{ animation: "alertPulse 1.4s ease-in-out infinite" }}
      />
      <path d="M0 218 Q120 204 260 216 T400 214 L400 240 L0 240Z" fill="#120608" />
      <rect x="170" y="96" width="60" height="128" fill="#1c1013" stroke="#4c1d1d" strokeWidth="2" />
      {BOLTS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#fde68a"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ animation: `boltFlash 2.4s ${i * 0.7}s infinite`, filter: "drop-shadow(0 0 4px #fbbf24)" }}
        />
      ))}
      <g style={{ animation: "alertPulse 1s ease-in-out infinite" }}>
        <polygon points="200,74 236,140 164,140" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinejoin="round" />
        <polygon points="200,84 226,134 174,134" fill="#dc2626" opacity="0.25" />
        <rect x="196" y="98" width="8" height="24" rx="2" fill="#fca5a5" />
        <circle cx="200" cy="130" r="3.5" fill="#fca5a5" />
      </g>
    </svg>
  );
}
