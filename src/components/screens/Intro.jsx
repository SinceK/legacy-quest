import { useEffect, useState } from "react";
import { STORY } from "../../content/index.js";
import { SCENES } from "../scenes/index.js";
import { Starfield, Motes } from "../ui/Ambience.jsx";
import Logo from "../ui/Logo.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function Intro({ onDone }) {
  const { playSfx } = useAudio();
  const [i, setI] = useState(0);
  const scenes = STORY.scenes;
  const titleShown = i >= scenes.length;

  useEffect(() => {
    if (titleShown) return undefined;
    const t = setTimeout(() => setI((v) => v + 1), STORY.sceneDurationMs);
    return () => clearTimeout(t);
  }, [i, titleShown]);

  const sc = scenes[Math.min(i, scenes.length - 1)];
  const Scene = SCENES[sc.scene];

  function finish() {
    playSfx("start");
    onDone();
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 20, background: "#05070e" }}>
      {!titleShown ? (
        <div key={i} className="absolute inset-0" style={{ animation: "cineIn .8s ease-out" }}>
          <div className="absolute inset-0" style={{ background: sc.tint }} />
          <Starfield />
          <Motes color={sc.moteColor} />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 45%, transparent 40%, rgba(0,0,0,0.7))" }}
          />
          <div className="absolute inset-x-0 flex justify-center" style={{ top: "22%" }}>
            <div className="w-full max-w-md px-6" style={{ animation: "kenburns 4s ease-out forwards" }}>
              {Scene ? <Scene /> : null}
            </div>
          </div>
          <div className="absolute inset-x-0 px-8 text-center" style={{ top: "68%" }}>
            <p
              key={`cap${i}`}
              className="text-slate-100 text-lg leading-relaxed font-serif"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)", animation: "captionIn .8s ease-out .3s both" }}
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
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 42%, #16123a, #06060f 75%)" }}
        >
          <Starfield />
          <Motes color="#fcd34d" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div
              className="absolute"
              style={{
                width: 300,
                height: 300,
                borderRadius: 9999,
                background: "radial-gradient(circle, rgba(251,191,36,0.3), transparent 70%)",
                animation: "orbPulse 2.6s ease-in-out infinite",
              }}
            />
            <div className="relative" style={{ animation: "titlePop .8s ease-out .1s both" }}>
              <Logo scale={1.15} />
            </div>
            <button
              onClick={finish}
              className="relative mt-10 px-9 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-black text-lg hover:bg-amber-300"
              style={{ animation: "fadeUp .6s ease-out .9s both, ctaPulse 1.8s ease-in-out 1.5s infinite" }}
            >
              ▶ 冒険をはじめる
            </button>
          </div>
        </div>
      )}
      <div
        className="absolute top-0 inset-x-0 bg-black"
        style={{ height: "7%", transformOrigin: "top", animation: "letterbox .6s ease-out" }}
      />
      <div
        className="absolute bottom-0 inset-x-0 bg-black"
        style={{ height: "7%", transformOrigin: "bottom", animation: "letterbox .6s ease-out" }}
      />
      <button
        onClick={finish}
        className="absolute right-4 text-slate-400 text-sm hover:text-slate-200"
        style={{ top: "8.5%", zIndex: 30 }}
      >
        スキップ →
      </button>
    </div>
  );
}
