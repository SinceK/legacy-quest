export default function Monster({ cfg, defeated = false, size = 120 }) {
  const eyePos =
    cfg.eyes === 1
      ? [[50, 47]]
      : cfg.eyes === 3
        ? [
            [36, 46],
            [50, 42],
            [64, 46],
          ]
        : [
            [41, 46],
            [59, 46],
          ];

  const mouth = defeated
    ? "M42 64 Q50 60 58 64"
    : cfg.mood === "angry"
      ? "M40 66 L45 61 L50 66 L55 61 L60 66"
      : cfg.mood === "think"
        ? "M44 65 Q52 65 56 61"
        : "M40 62 Q50 71 60 62";

  const idle = defeated
    ? "koFall .6s ease forwards"
    : cfg.mood === "angry"
      ? "floatY 2.4s ease-in-out infinite, sway 1.4s ease-in-out infinite"
      : "floatY 2.6s ease-in-out infinite";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ animation: idle }}>
      {cfg.horns && (
        <>
          <polygon points="30,26 24,8 40,22" fill={cfg.accent} />
          <polygon points="70,26 76,8 60,22" fill={cfg.accent} />
        </>
      )}
      <ellipse cx="50" cy="90" rx="26" ry="5" fill="rgba(0,0,0,0.35)" />
      <ellipse cx="38" cy="82" rx="8" ry="6" fill={cfg.accent} />
      <ellipse cx="62" cy="82" rx="8" ry="6" fill={cfg.accent} />
      {cfg.square ? (
        <rect x="22" y="26" width="56" height="56" rx="12" fill={cfg.body} />
      ) : (
        <ellipse cx="50" cy="54" rx="30" ry="29" fill={cfg.body} />
      )}
      {cfg.square && (
        <>
          <circle cx="30" cy="36" r="2.5" fill={cfg.accent} />
          <circle cx="70" cy="36" r="2.5" fill={cfg.accent} />
          <circle cx="30" cy="72" r="2.5" fill={cfg.accent} />
          <circle cx="70" cy="72" r="2.5" fill={cfg.accent} />
        </>
      )}
      <ellipse cx="40" cy="40" rx="10" ry="7" fill="#ffffff" opacity="0.18" />
      <ellipse cx="20" cy="56" rx="6" ry="9" fill={cfg.body} />
      <ellipse cx="80" cy="56" rx="6" ry="9" fill={cfg.body} />
      {eyePos.map(([x, y], i) =>
        defeated ? (
          <g key={i} stroke="#1e293b" strokeWidth="2.4" strokeLinecap="round">
            <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} />
            <line x1={x + 4} y1={y - 4} x2={x - 4} y2={y + 4} />
          </g>
        ) : (
          <g key={i}>
            <circle cx={x} cy={y} r="6.5" fill="#ffffff" />
            <circle cx={x} cy={y + (cfg.mood === "angry" ? 1 : 0)} r="3" fill="#1e293b" />
          </g>
        ),
      )}
      {cfg.mood === "angry" && !defeated && (
        <>
          <line x1="30" y1="40" x2="42" y2="44" stroke={cfg.accent} strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="40" x2="58" y2="44" stroke={cfg.accent} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      <path d={mouth} fill="none" stroke="#1e293b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
