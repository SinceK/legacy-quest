const SCROLLS = [
  { x: 92, y: 360, d: "0s" },
  { x: 288, y: 400, d: ".8s" },
  { x: 250, y: 480, d: "1.4s" },
  { x: 116, y: 500, d: "2s" },
];

const FAR_SPIRES = [
  { x: 8, w: 22, h: 70 },
  { x: 40, w: 16, h: 46 },
  { x: 352, w: 18, h: 54 },
  { x: 378, w: 20, h: 78 },
];

/** COBOLの巨塔が世界を統べていた、栄華の時代。荘厳な大聖堂型サーバー塔を画面いっぱいに描く。 */
export default function SceneKingdom() {
  return (
    <svg
      viewBox="0 0 400 860"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="kingdomAura" cx="50%" cy="34%" r="46%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#0f5c43" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#0f5c43" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="kingdomTower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#134a37" />
          <stop offset="100%" stopColor="#041712" />
        </linearGradient>
        <linearGradient id="kingdomGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b2b22" />
          <stop offset="100%" stopColor="#020a07" />
        </linearGradient>
      </defs>

      {/* 蝕月 */}
      <circle cx="332" cy="96" r="26" fill="#0b2b24" opacity="0.9" />
      <circle cx="324" cy="90" r="26" fill="#05070e" />

      {/* 大塔を包む後光 */}
      <ellipse cx="200" cy="300" rx="230" ry="320" fill="url(#kingdomAura)" />

      {/* 遠景に連なる無数の塔＝支えられていた世界のシステム群 */}
      <g fill="#08211a" opacity="0.75">
        {FAR_SPIRES.map((s, i) => (
          <rect key={i} x={s.x} y={620 - s.h} width={s.w} height={s.h} />
        ))}
      </g>

      {/* 地平線 */}
      <path d="M-20 606 Q110 566 210 596 T420 588 L420 860 L-20 860Z" fill="url(#kingdomGround)" />
      <path d="M-20 632 Q120 606 260 626 T420 622 L420 860 L-20 860Z" fill="#0b2b22" opacity="0.8" />

      {/* 脇塔 */}
      <g fill="#0c2a20" stroke="#0f5c43" strokeWidth="2.4">
        <path d="M56 636 L56 520 L72 520 L72 490 L104 490 L104 520 L118 520 L118 636 Z" />
        <path d="M282 636 L282 520 L298 520 L298 490 L330 490 L330 520 L344 520 L344 636 Z" />
      </g>

      {/* 中央の大聖堂型サーバー塔（段状にすぼまる、天を衝く高さ） */}
      <path
        d="M140 640 L140 500 L160 500 L160 430 L180 430 L180 360 L184 300 L216 300 L220 360 L220 430 L240 430 L240 500 L260 500 L260 640 Z"
        fill="url(#kingdomTower)"
        stroke="#10b981"
        strokeWidth="2.6"
      />
      {/* 頂の尖塔 */}
      <path d="M184 300 L200 195 L216 300 Z" fill="url(#kingdomTower)" stroke="#10b981" strokeWidth="2.6" />

      {/* 稼働窓（明滅） */}
      <g fill="#fbbf24">
        <rect x="164" y="540" width="12" height="16" rx="1" style={{ animation: "flicker 4s infinite" }} />
        <rect x="188" y="540" width="12" height="16" rx="1" style={{ animation: "flicker 5.2s infinite" }} />
        <rect x="212" y="540" width="12" height="16" rx="1" style={{ animation: "flicker 3.4s infinite" }} />
        <rect x="164" y="580" width="12" height="16" rx="1" style={{ animation: "flicker 4.6s infinite" }} />
        <rect x="188" y="580" width="12" height="16" rx="1" style={{ animation: "flicker 3.8s infinite" }} />
        <rect x="212" y="580" width="12" height="16" rx="1" style={{ animation: "flicker 5s infinite" }} />
        <rect x="176" y="450" width="10" height="14" rx="1" style={{ animation: "flicker 4.4s infinite" }} />
        <rect x="200" y="450" width="10" height="14" rx="1" style={{ animation: "flicker 3.6s infinite" }} />
        <rect x="60" y="580" width="9" height="13" rx="1" style={{ animation: "flicker 4.8s infinite" }} />
        <rect x="332" y="580" width="9" height="13" rx="1" style={{ animation: "flicker 3.9s infinite" }} />
      </g>

      {/* 頂点に輝く古き核。二重の環がゆっくり回り、魔導と機械が同居する空気を出す */}
      <g style={{ transformOrigin: "200px 195px", animation: "spin 18s linear infinite" }}>
        <circle cx="200" cy="195" r="26" fill="none" stroke="#6ee7b7" strokeWidth="1.2" strokeDasharray="5 6" opacity="0.7" />
      </g>
      <circle cx="200" cy="195" r="17" fill="#10b981" style={{ animation: "orbPulse 2.6s ease-in-out infinite" }} />
      <circle cx="200" cy="195" r="8" fill="#d1fae5" />

      {/* 旗 */}
      <path d="M160 430 L140 438 L160 446 Z" fill="#10b981" opacity="0.85" />
      <path d="M240 430 L260 438 L240 446 Z" fill="#10b981" opacity="0.85" />
      <path d="M180 360 L164 366 L180 372 Z" fill="#10b981" opacity="0.7" />
      <path d="M220 360 L236 366 L220 372 Z" fill="#10b981" opacity="0.7" />

      {/* 漂うCOBOLの巻物 */}
      {SCROLLS.map((s, i) => (
        <g key={i} style={{ animation: `floatY 3s ease-in-out ${s.d} infinite` }}>
          <rect x={s.x} y={s.y} width="30" height="20" rx="3" fill="#ecfdf5" opacity="0.92" />
          <rect x={s.x - 3} y={s.y - 1} width="4" height="22" rx="2" fill="#a7f3d0" />
          <rect x={s.x + 29} y={s.y - 1} width="4" height="22" rx="2" fill="#a7f3d0" />
          <line x1={s.x + 5} y1={s.y + 7} x2={s.x + 24} y2={s.y + 7} stroke="#34d399" strokeWidth="1.6" />
          <line x1={s.x + 5} y1={s.y + 13} x2={s.x + 21} y2={s.y + 13} stroke="#34d399" strokeWidth="1.6" />
        </g>
      ))}
    </svg>
  );
}
