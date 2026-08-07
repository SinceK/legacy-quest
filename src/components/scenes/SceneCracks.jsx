const CRACKS = [
  "M200 92 L196 120 L204 140 L198 170 L206 210",
  "M200 110 L214 128 L210 150 L224 176",
  "M200 118 L186 136 L190 158 L176 182",
];
const DEBRIS = [
  { x: 190, d: "0s" },
  { x: 210, d: ".5s" },
  { x: 176, d: "1s" },
  { x: 224, d: "1.4s" },
];

export default function SceneCracks() {
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block", animation: "rumble 0.4s ease-in-out infinite" }}>
      <path d="M0 218 Q120 202 260 215 T400 214 L400 240 L0 240Z" fill="#1a1226" />
      <rect x="168" y="86" width="64" height="136" fill="#241a30" stroke="#7c3aed" strokeWidth="2" opacity="0.9" />
      <g fill="#7c1d1d">
        <rect x="168" y="80" width="12" height="10" />
        <rect x="186" y="80" width="12" height="10" />
        <rect x="208" y="80" width="12" height="10" />
        <rect x="220" y="80" width="12" height="10" />
      </g>
      <g fill="#f59e0b" opacity="0.5">
        <rect x="183" y="118" width="10" height="14" rx="1" style={{ animation: "flicker 1.2s infinite" }} />
        <rect x="207" y="150" width="10" height="14" rx="1" style={{ animation: "flicker 0.9s infinite" }} />
      </g>
      {CRACKS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#fca5a5"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{
            strokeDasharray: 220,
            strokeDashoffset: 220,
            animation: `crackDraw 1.3s ease-out ${i * 0.35}s forwards`,
            filter: "drop-shadow(0 0 3px #ef4444)",
          }}
        />
      ))}
      {DEBRIS.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y="150"
          width="6"
          height="6"
          fill="#a78bfa"
          style={{ animation: `debris 1.6s ease-in ${p.d} infinite` }}
        />
      ))}
      <rect x="0" y="0" width="400" height="240" fill="#ef4444" opacity="0.06" />
    </svg>
  );
}
