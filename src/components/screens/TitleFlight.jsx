import { useEffect, useState } from "react";
import Logo from "../ui/Logo.jsx";
import NightSky from "../ui/NightSky.jsx";
import Embers from "../ui/Embers.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";

const FLIGHT_MS = 4600; // ロゴが遠方から着地するまで
const IMPACT_MS = 2750; // 稲妻と閃光の瞬間
const CTA_MS = 5100; // ボタンが現れるまで

/** 雲海の奥からタイトルロゴが飛来し、稲妻とともに着地する。 */
export default function TitleFlight({ onStart }) {
  const { playSfx } = useAudio();
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    playSfx("whoosh");
    const timers = [
      setTimeout(() => {
        playSfx("thunder");
        playSfx("chime");
      }, IMPACT_MS),
      setTimeout(() => setShowCta(true), CTA_MS),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#02040a" }}>
      <NightSky push />
      <Embers count={30} />

      {/* 着地の閃光 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "#fff7e0", animation: `impactFlash ${FLIGHT_MS}ms ease-out both` }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="relative" style={{ width: "100%", maxWidth: 380 }}>
          {/* 稲妻はロゴの背後で光る */}
          <svg
            className="absolute left-1/2 pointer-events-none"
            width="260"
            height="300"
            viewBox="0 0 260 300"
            style={{
              top: "-46%",
              marginLeft: -130,
              animation: `boltStrike ${FLIGHT_MS}ms ease-out both`,
              filter: "drop-shadow(0 0 14px #fde68a)",
            }}
          >
            <path
              d="M148 6 L96 132 L134 132 L88 294 L176 128 L136 128 L184 6 Z"
              fill="#fef3c7"
              opacity="0.92"
            />
            <path d="M148 6 L96 132 L134 132 L88 294 L176 128 L136 128 L184 6 Z" fill="none" stroke="#fff" strokeWidth="2" />
          </svg>

          {/* ロゴ本体。飛来 → 着地後はゆるく漂う */}
          <div
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform, filter",
              animation: `logoFlyIn ${FLIGHT_MS}ms cubic-bezier(.16,.72,.18,1) both, titleHold 7s ease-in-out ${FLIGHT_MS + 200}ms infinite`,
            }}
          >
            {/* 発光コピー。着地後にグローが焼き切れて金属質が残る */}
            <div
              className="absolute inset-0 flex justify-center pointer-events-none"
              style={{
                filter: "blur(16px) saturate(1.7)",
                mixBlendMode: "screen",
                animation: `logoBloom ${FLIGHT_MS}ms ease-out both`,
              }}
            >
              <Logo scale={1.2} />
            </div>
            <div className="flex justify-center">
              <Logo scale={1.2} />
            </div>
          </div>

          {/* 着地の瞬間に走る光条 */}
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: "52%",
              height: 3,
              background: "linear-gradient(90deg,transparent,#fff8e1,transparent)",
              filter: "blur(1px)",
              animation: `flareSweep ${FLIGHT_MS}ms ease-out both`,
            }}
          />
        </div>

        <button
          onClick={onStart}
          className="relative mt-14 px-9 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-black text-lg hover:bg-amber-300"
          style={{
            opacity: showCta ? undefined : 0,
            pointerEvents: showCta ? "auto" : "none",
            animation: showCta ? "fadeUp .9s ease-out both, ctaPulse 1.8s ease-in-out 1.2s infinite" : undefined,
          }}
        >
          ▶ 冒険をはじめる
        </button>
      </div>
    </div>
  );
}
