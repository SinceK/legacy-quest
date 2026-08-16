import { useEffect, useState } from "react";
import { STORY } from "../../content/index.js";
import { SCENES } from "../scenes/index.js";
import { Starfield } from "../ui/Ambience.jsx";
import NightSky from "../ui/NightSky.jsx";
import Embers from "../ui/Embers.jsx";
import LightRays from "../ui/LightRays.jsx";
import FilmGrain from "../ui/FilmGrain.jsx";
import TitleFlight from "./TitleFlight.jsx";
import IntroGate from "./IntroGate.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";

// シーンごとにケンバーンズの寄り引き・パン方向を変えて、カメラが意思を持って動いているように見せる
const KENBURNS = ["kenburnsA", "kenburnsB", "kenburnsC"];

export default function Intro({ onDone }) {
  const { playSfx } = useAudio();
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const scenes = STORY.scenes;
  const titleShown = i >= scenes.length;

  useEffect(() => {
    if (!started || titleShown) return undefined;
    const t = setTimeout(() => setI((v) => v + 1), STORY.sceneDurationMs);
    return () => clearTimeout(t);
  }, [i, started, titleShown]);

  const sc = scenes[Math.min(i, scenes.length - 1)];
  const Scene = SCENES[sc.scene];

  function finish() {
    playSfx("start");
    onDone();
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 20, background: "#02040a" }}>
      {!started ? (
        <IntroGate onStart={() => setStarted(true)} />
      ) : !titleShown ? (
        <div key={i} className="absolute inset-0" style={{ animation: "cineIn 1.3s ease-out" }}>
          {/* シーン切り替えの一瞬だけ暗転させ、カットが切り替わる映画的な間を作る */}
          <div
            key={`shutter${i}`}
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ zIndex: 5, animation: "shutterFlash .5s ease-out both" }}
          />
          <div className="absolute inset-0" style={{ background: sc.tint }} />
          {/* イラスト本体を画面いっぱいに敷き、ケンバーンズでゆっくり動かす */}
          <div
            className="absolute inset-0"
            style={{ animation: `${KENBURNS[i % KENBURNS.length]} 5.4s ease-out forwards` }}
          >
            {Scene ? <Scene /> : null}
          </div>
          {/* 各シーンの背後にも雲を流して、タイトルまで空気を繋げる */}
          <NightSky showBase={false} moon={false} intensity={0.6} />
          <Starfield />
          <LightRays count={4} tint={sc.moteColor} intensity={0.8} />
          <Embers count={16} color={sc.moteColor} intensity={0.85} />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 45%, transparent 32%, rgba(0,0,0,0.82))" }}
          />
          <div className="absolute inset-x-0 px-8 text-center" style={{ top: "68%" }}>
            <p
              key={`cap${i}`}
              className="text-slate-100 text-lg leading-relaxed font-serif"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)", animation: "captionIn 1.1s ease-out .35s both" }}
            >
              {sc.caption}
            </p>
          </div>
          <div className="absolute inset-x-0 flex justify-center gap-2" style={{ bottom: "9%" }}>
            {scenes.map((_, k) => (
              <span
                key={k}
                className={"h-1.5 rounded-full transition-all " + (k === i ? "w-6 bg-amber-400" : "w-1.5 bg-slate-600")}
              />
            ))}
          </div>
          <FilmGrain opacity={0.045} />
        </div>
      ) : (
        <TitleFlight onStart={finish} />
      )}

      {/* ティール&オレンジ寄りのカラーグレード。シーンをまたいでも一貫した「映像」の質感を保つ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(155deg, rgba(20,184,166,0.12) 0%, transparent 42%, transparent 58%, rgba(251,146,60,0.12) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <div
        className="absolute top-0 inset-x-0 bg-black"
        style={{ height: "7%", transformOrigin: "top", animation: "letterbox .6s ease-out" }}
      />
      <div
        className="absolute bottom-0 inset-x-0 bg-black"
        style={{ height: "7%", transformOrigin: "bottom", animation: "letterbox .6s ease-out" }}
      />
      {started && (
        <button
          onClick={finish}
          className="absolute right-4 text-slate-400 text-sm hover:text-slate-200"
          style={{ top: "8.5%", zIndex: 30 }}
        >
          スキップ →
        </button>
      )}
    </div>
  );
}
