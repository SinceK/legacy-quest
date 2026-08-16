const LINKS = [{ x: 92 }, { x: 168 }, { x: 236 }, { x: 312 }];

/** 銀行も行政も、その屋台骨をCOBOLの巨塔が支えていた世界の全景。画面いっぱいに広がる回路図のような都市。 */
export default function SceneWorld() {
  return (
    <svg
      viewBox="0 0 400 860"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="worldAura" cx="50%" cy="24%" r="40%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#0e7490" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="worldBuilding" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b3a4a" />
          <stop offset="100%" stopColor="#031a22" />
        </linearGradient>
        <linearGradient id="worldGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#031722" />
          <stop offset="100%" stopColor="#00090e" />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="220" rx="240" ry="300" fill="url(#worldAura)" />

      {/* 中枢を成すCOBOLの核。世界を支える見えざる根 */}
      <g style={{ transformOrigin: "200px 190px", animation: "spin 22s linear infinite" }}>
        <circle cx="200" cy="190" r="60" fill="none" stroke="#67e8f9" strokeWidth="1.2" opacity="0.4" />
        <circle cx="200" cy="190" r="44" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="4 7" opacity="0.65" />
      </g>
      <circle cx="200" cy="190" r="26" fill="#0e7490" style={{ animation: "orbPulse 3s ease-in-out infinite" }} />
      <circle cx="200" cy="190" r="13" fill="#a5f3fc" />

      {/* 核から各都市機能へ伸びる支柱線 */}
      {LINKS.map((l, i) => (
        <line
          key={i}
          x1="200"
          y1="216"
          x2={l.x}
          y2="580"
          stroke="#22d3ee"
          strokeWidth="1.4"
          opacity="0.5"
          style={{ animation: `twinkle ${3 + i * 0.4}s ease-in-out infinite` }}
        />
      ))}

      {/* 地平線 */}
      <path d="M-20 626 Q120 594 260 616 T420 610 L420 860 L-20 860Z" fill="url(#worldGround)" />
      <path d="M-20 654 Q140 636 280 650 T420 646 L420 860 L-20 860Z" fill="#052430" opacity="0.85" />

      {/* 銀行（列柱と三角破風） */}
      <g fill="url(#worldBuilding)" stroke="#22d3ee" strokeWidth="1.6">
        <rect x="60" y="562" width="76" height="72" />
        <path d="M54 562 L98 526 L142 562 Z" />
      </g>
      <g stroke="#22d3ee" strokeWidth="2.2" opacity="0.6">
        <line x1="72" y1="572" x2="72" y2="630" />
        <line x1="90" y1="572" x2="90" y2="630" />
        <line x1="106" y1="572" x2="106" y2="630" />
        <line x1="122" y1="572" x2="122" y2="630" />
      </g>

      {/* 議事堂（円蓋） */}
      <g fill="url(#worldBuilding)" stroke="#22d3ee" strokeWidth="1.6">
        <rect x="164" y="578" width="80" height="56" />
        <path d="M164 578 A40 32 0 0 1 244 578 Z" />
        <rect x="198" y="516" width="10" height="24" />
      </g>
      <circle cx="203" cy="514" r="5" fill="#a5f3fc" style={{ animation: "twinkle 2.4s ease-in-out infinite" }} />

      {/* データタワー群（近代的な高層シルエット） */}
      <g fill="url(#worldBuilding)" stroke="#22d3ee" strokeWidth="1.6">
        <rect x="278" y="530" width="38" height="104" />
        <rect x="320" y="556" width="32" height="78" />
      </g>
      <g fill="#67e8f9" opacity="0.7">
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x="287" y={544 + i * 16} width="7" height="8" style={{ animation: `flicker ${3.5 + i}s infinite` }} />
        ))}
      </g>

      {/* 各棟の足元から立ちのぼる稼働の光 */}
      {[98, 204, 296, 336].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy="634"
          r="2.8"
          fill="#67e8f9"
          style={{ animation: `streamUp 2.4s linear ${i * 0.5}s infinite`, filter: "drop-shadow(0 0 4px #67e8f9)" }}
        />
      ))}
    </svg>
  );
}
