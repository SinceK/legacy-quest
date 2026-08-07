export default function SceneKingdom() {
  const scrolls = [
    { x: 96, y: 120, d: "0s" },
    { x: 300, y: 116, d: ".8s" },
    { x: 250, y: 150, d: "1.4s" },
  ];
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block" }}>
      <circle cx="335" cy="46" r="20" fill="#0b2b24" opacity="0.9" />
      <circle cx="329" cy="42" r="20" fill="#05070e" />
      <path d="M0 205 Q110 178 210 200 T400 195 L400 240 L0 240Z" fill="#08201a" />
      <path d="M0 218 Q120 202 260 215 T400 214 L400 240 L0 240Z" fill="#0b2b22" />
      <g fill="#0c2a20" stroke="#0f5c43" strokeWidth="2">
        <rect x="66" y="150" width="34" height="72" />
        <rect x="300" y="150" width="34" height="72" />
      </g>
      <rect x="168" y="86" width="64" height="136" fill="#0d3327" stroke="#10b981" strokeWidth="2" />
      <g fill="#10b981">
        <rect x="168" y="80" width="12" height="10" />
        <rect x="186" y="80" width="12" height="10" />
        <rect x="208" y="80" width="12" height="10" />
        <rect x="220" y="80" width="12" height="10" />
      </g>
      <g fill="#fbbf24">
        <rect x="183" y="118" width="10" height="14" rx="1" style={{ animation: "flicker 4s infinite" }} />
        <rect x="207" y="118" width="10" height="14" rx="1" style={{ animation: "flicker 5.2s infinite" }} />
        <rect x="183" y="150" width="10" height="14" rx="1" style={{ animation: "flicker 3.4s infinite" }} />
        <rect x="207" y="150" width="10" height="14" rx="1" style={{ animation: "flicker 4.6s infinite" }} />
        <rect x="76" y="170" width="8" height="12" rx="1" style={{ animation: "flicker 4.8s infinite" }} />
        <rect x="312" y="170" width="8" height="12" rx="1" style={{ animation: "flicker 3.9s infinite" }} />
      </g>
      <circle cx="200" cy="66" r="26" fill="#10b981" style={{ animation: "orbPulse 2.6s ease-in-out infinite" }} />
      <circle cx="200" cy="66" r="12" fill="#6ee7b7" />
      <circle cx="200" cy="66" r="12" fill="none" stroke="#d1fae5" strokeWidth="1" />
      {scrolls.map((s, i) => (
        <g key={i} style={{ animation: `floatY 3s ease-in-out ${s.d} infinite` }}>
          <rect x={s.x} y={s.y} width="26" height="18" rx="3" fill="#ecfdf5" opacity="0.9" />
          <rect x={s.x - 3} y={s.y - 1} width="4" height="20" rx="2" fill="#a7f3d0" />
          <rect x={s.x + 25} y={s.y - 1} width="4" height="20" rx="2" fill="#a7f3d0" />
          <line x1={s.x + 4} y1={s.y + 6} x2={s.x + 20} y2={s.y + 6} stroke="#34d399" strokeWidth="1.5" />
          <line x1={s.x + 4} y1={s.y + 11} x2={s.x + 18} y2={s.y + 11} stroke="#34d399" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}
