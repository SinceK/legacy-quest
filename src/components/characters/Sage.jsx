export default function Sage({ mood = "happy", size = 56 }) {
  const brow =
    mood === "warn"
      ? { l: "M38 46 L46 44", r: "M54 44 L62 46" }
      : mood === "think"
        ? { l: "M38 45 L46 45", r: "M54 45 L62 43" }
        : { l: "M38 45 L46 46", r: "M54 46 L62 45" };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ animation: "floatY 3.2s ease-in-out infinite" }}>
      <polygon points="50,6 28,44 72,44" fill="#059669" />
      <polygon points="50,6 40,24 50,20 60,24" fill="#34d399" opacity="0.7" />
      <circle cx="50" cy="10" r="3" fill="#fbbf24" />
      <rect x="27" y="41" width="46" height="6" rx="3" fill="#065f46" />
      <circle cx="50" cy="58" r="19" fill="#f2d3a7" />
      <path d="M33 60 Q34 88 50 90 Q66 88 67 60 Q60 78 50 79 Q40 78 33 60 Z" fill="#e2e8f0" />
      <path d="M44 74 Q50 80 56 74 L56 60 Q50 64 44 60 Z" fill="#f1f5f9" />
      <circle cx="43" cy="56" r="6" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="57" cy="56" r="6" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <line x1="49" y1="56" x2="51" y2="56" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="43" cy="56" r="2" fill="#1e293b" />
      <circle cx="57" cy="56" r="2" fill="#1e293b" />
      <path d={brow.l} stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={brow.r} stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
