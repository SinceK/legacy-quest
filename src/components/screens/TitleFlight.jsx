import { useEffect, useState } from "react";
import Logo from "../ui/Logo.jsx";
import NightSky from "../ui/NightSky.jsx";
import Embers from "../ui/Embers.jsx";
import LightRays from "../ui/LightRays.jsx";
import FilmGrain from "../ui/FilmGrain.jsx";
import MagicDust from "../ui/MagicDust.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";
import { OPENING_IMAGES } from "../../content/openingImages.js";

const FLIGHT_MS = 4600; // ロゴが現れきるまで
const REVEAL_MS = 2750; // 光の粒が寄り集まり、ロゴがほのかに輝きだす瞬間
const CTA_MS = 5100; // ボタンが現れるまで

/** 夜空を舞う金色の光の粒が渦を巻きながら寄り集まり、静かにタイトルの形を結ぶ。 */
export default function TitleFlight({ onStart, sharedJourneyBackground = false }) {
  const { playSfx } = useAudio();
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    playSfx("whoosh");
    const timers = [
      setTimeout(() => {
        playSfx("sparkle");
        playSfx("chime");
      }, REVEAL_MS),
      setTimeout(() => setShowCta(true), CTA_MS),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: sharedJourneyBackground ? "transparent" : "#02040a" }}
    >
      {OPENING_IMAGES.journey ? (
        <>
          {!sharedJourneyBackground && (
            <img
              src={OPENING_IMAGES.journey}
              alt=""
              className="title-journey-bg absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div
            className="title-journey-shade absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 45%, rgba(2,4,10,.08), #02040a 82%)" }}
          />
        </>
      ) : (
        <NightSky push />
      )}
      <LightRays count={3} intensity={0.48} />
      <Embers count={12} intensity={0.65} />
      <MagicDust durationMs={REVEAL_MS + 400} startMs={200} />

      {/* 光の粒が収束する瞬間、画面全体がふわりと金色に満ちる */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 46%, #fef3c7, transparent 62%)",
          mixBlendMode: "screen",
          animation: `impactFlash ${FLIGHT_MS}ms ease-out both`,
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="relative" style={{ width: "100%", maxWidth: 380 }}>
          {/* ロゴ本体。淡く滲みながら像を結び、そのあとはゆるく漂う */}
          <div
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform, filter",
              animation: `logoFlyIn ${FLIGHT_MS}ms cubic-bezier(.16,.72,.18,1) both, titleHold 7s ease-in-out ${FLIGHT_MS + 200}ms infinite`,
            }}
          >
            {/* 発光コピー。結像後にグローが淡くなり金属質が残る */}
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

          {/* 像を結ぶ瞬間に走る光条 */}
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

          {/* 結像した中心から放射状に広がるレンズフレア */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: "48%",
              width: 260,
              height: 260,
              marginLeft: -130,
              marginTop: -130,
              mixBlendMode: "screen",
              background: "radial-gradient(circle, rgba(255,247,224,0.95), rgba(253,230,138,0.4) 38%, transparent 72%)",
              animation: `flareBurst ${FLIGHT_MS}ms ease-out both`,
            }}
          />
          {[0, 45, 90, 135].map((deg) => (
            <div
              key={deg}
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "48%",
                width: 300,
                height: 2,
                marginLeft: -150,
                transform: `rotate(${deg}deg)`,
                transformOrigin: "50% 50%",
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: "linear-gradient(90deg,transparent,rgba(255,247,224,0.85),transparent)",
                  mixBlendMode: "screen",
                  animation: `flareStreak ${FLIGHT_MS}ms ease-out both`,
                }}
              />
            </div>
          ))}
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
      <FilmGrain opacity={0.025} />
    </div>
  );
}
