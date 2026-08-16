export default function Emblem({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ animation: "floatY 3.4s ease-in-out infinite" }}>
      <defs>
        <linearGradient id="crest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f3b2e" />
          <stop offset="100%" stopColor="#0a1420" />
        </linearGradient>
      </defs>
      <path
        d="M32 5 L55 13 L55 31 C55 47 45 55 32 60 C19 55 9 47 9 31 L9 13 Z"
        fill="url(#crest)"
        stroke="#fbbf24"
        strokeWidth="2"
      />
      <path
        d="M32 10 L50 16 L50 31 C50 44 42 51 32 55 C22 51 14 44 14 31 L14 16 Z"
        fill="none"
        stroke="#10b981"
        strokeWidth="1"
        opacity="0.6"
      />
      <polyline
        points="24,23 18,32 24,41"
        fill="none"
        stroke="#34d399"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="40,23 46,32 40,41"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points="32,14 35,20 32,20 29,20" fill="#e2e8f0" />
      <rect x="30.5" y="18" width="3" height="22" fill="#e2e8f0" />
      <rect x="24" y="40" width="16" height="3" rx="1.5" fill="#fbbf24" />
      <rect x="30.5" y="43" width="3" height="7" fill="#fbbf24" />
      <circle cx="32" cy="52" r="2.4" fill="#fcd34d" />
      <circle cx="32" cy="11" r="2.4" fill="#fcd34d" style={{ animation: "orbPulse 2.4s ease-in-out infinite" }} />
    </svg>
  );
}
