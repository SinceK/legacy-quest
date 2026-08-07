export default function SceneWorld() {
  const pillars = [110, 165, 220, 275];
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block" }}>
      <circle cx="200" cy="66" r="46" fill="#0e7490" />
      <circle cx="200" cy="66" r="46" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
      <ellipse cx="200" cy="66" rx="46" ry="16" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.7" />
      <ellipse cx="200" cy="66" rx="20" ry="46" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.5" />
      <ellipse cx="200" cy="66" rx="40" ry="46" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.35" />
      <circle cx="186" cy="52" r="10" fill="#a5f3fc" opacity="0.5" />
      <circle
        cx="200"
        cy="66"
        r="52"
        fill="#22d3ee"
        opacity="0.12"
        style={{ animation: "orbPulse 3s ease-in-out infinite" }}
      />
      <path d="M0 224 L400 224" stroke="#0b2b22" strokeWidth="24" />
      {pillars.map((x, i) => (
        <g key={i}>
          <rect x={x - 8} y="120" width="16" height="104" fill="#0c2a20" stroke="#0f5c43" strokeWidth="1.5" />
          {[0, 1, 2].map((k) => (
            <circle
              key={k}
              cx={x}
              cy="210"
              r="3"
              fill="#34d399"
              style={{
                animation: `streamUp 2.2s linear ${i * 0.3 + k * 0.7}s infinite`,
                filter: "drop-shadow(0 0 4px #34d399)",
              }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
