export default function Sage({ mood = "happy", size = 56 }) {
  const isWarn = mood === "warn";
  const isThink = mood === "think";
  const brow = isWarn
    ? { l: "M35 46 L44 43", r: "M56 43 L65 46" }
    : isThink
      ? { l: "M35 44 Q40 42 45 44", r: "M55 45 Q60 41 65 42" }
      : { l: "M35 43 Q40 41 45 43", r: "M55 43 Q60 41 65 43" };
  const mouth = isWarn
    ? "M45 65 Q50 61 55 65"
    : isThink
      ? "M47 64 Q51 66 54 63"
      : "M44 63 Q50 69 56 63";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="古い巻物とJavaの魔導書を携えた案内役の賢者"
      style={{ animation: "floatY 3.2s ease-in-out infinite", overflow: "visible" }}
    >
      <path d="M22 97 Q24 75 36 68 L50 75 L64 68 Q76 75 78 97 Z" fill="#064e3b" />
      <path d="M29 97 Q30 78 39 72 L50 80 L61 72 Q70 78 71 97 Z" fill="#047857" />
      <path d="M47 78 L50 84 L53 78 L50 74 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />

      {/* 柔らかく折れた帽子と、COBOLからJavaへの橋渡しを表す山括弧の紋章 */}
      <path d="M24 40 Q31 27 43 20 Q48 11 59 5 Q62 17 58 24 Q69 27 75 41 Q56 46 24 40 Z" fill="#047857" stroke="#022c22" strokeWidth="2" strokeLinejoin="round" />
      <path d="M58 6 Q61 15 56 25 Q50 22 43 21 Q49 12 58 6 Z" fill="#34d399" opacity=".72" />
      <path d="M20 39 Q49 34 80 40 Q76 48 51 47 Q28 48 20 39 Z" fill="#065f46" stroke="#022c22" strokeWidth="2" />
      <path d="M40 37 L35 40 L40 43 M60 37 L65 40 L60 43" fill="none" stroke="#fcd34d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="40" r="2.3" fill="#fde68a" style={{ animation: "orbPulse 2.4s ease-in-out infinite" }} />

      <circle cx="29" cy="56" r="5" fill="#e9bd87" />
      <circle cx="71" cy="56" r="5" fill="#e9bd87" />
      <circle cx="50" cy="56" r="21" fill="#f2d3a7" stroke="#9a6337" strokeWidth="1.5" />
      <ellipse cx="50" cy="61" rx="3" ry="2" fill="#d59b66" />

      <circle cx="40" cy="53" r="8" fill="rgba(125,211,252,.12)" stroke="#fbbf24" strokeWidth="2.4" />
      <circle cx="60" cy="53" r="8" fill="rgba(125,211,252,.12)" stroke="#fbbf24" strokeWidth="2.4" />
      <path d="M48 52 Q50 50 52 52 M31 51 L27 49 M69 51 L73 49" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <path d={brow.l} stroke="#e2e8f0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d={brow.r} stroke="#e2e8f0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="54" r={isWarn ? 2.3 : 2} fill="#172033" />
      <circle cx="60" cy="54" r={isWarn ? 2.3 : 2} fill="#172033" />
      {isThink && <circle cx="62" cy="51" r="1" fill="#fff" />}

      <path d="M48 61 Q43 59 39 63 Q45 65 50 63 Q55 65 61 63 Q57 59 52 61" fill="#f1f5f9" />
      <path d={mouth} fill="none" stroke="#7c2d12" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M38 67 Q40 81 50 85 Q60 81 62 67 Q56 74 50 72 Q44 74 38 67 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

      {/* 左手には古い巻物 */}
      <g transform={isWarn ? "rotate(-7 25 80)" : "rotate(2 25 80)"}>
        <path d="M17 74 Q21 71 26 74 L28 91 Q23 94 18 91 Z" fill="#f3d59b" stroke="#92400e" strokeWidth="1.5" />
        <path d="M18 77 L27 76 M19 88 L28 87" stroke="#b45309" strokeWidth="1.4" />
        <path d="M21 80 L25 80 M21 83 L26 83" stroke="#9a6b35" strokeWidth="1" />
      </g>

      {/* 右手には青く光るJavaの魔導書 */}
      <g transform={isThink ? "translate(0 -2) rotate(-5 75 82)" : "rotate(3 75 82)"}>
        <path d="M67 74 Q74 71 82 75 L81 92 Q74 89 67 92 Z" fill="#075985" stroke="#7dd3fc" strokeWidth="1.7" />
        <path d="M74 74 L74 90" stroke="#bae6fd" strokeWidth="1" />
        <path d="M77 78 Q73 80 77 82 Q81 84 76 87" fill="none" stroke="#fef3c7" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="77" cy="82" r="10" fill="none" stroke="#38bdf8" strokeWidth="1" opacity=".35" style={{ animation: "orbPulse 2s ease-in-out infinite" }} />
      </g>
    </svg>
  );
}
