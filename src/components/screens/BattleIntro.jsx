import { useEffect } from "react";
import CodeRain from "../ui/CodeRain.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";
import { GAME_IMAGES } from "../../content/gameImages.js";

/** 章開始のダイブ演出。章表示 → ポータル → ズームイン。 */
export default function BattleIntro({ chapter, onDone }) {
  const { playSfx } = useAudio();
  const m = chapter.monster;

  useEffect(() => {
    playSfx("portal");
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 30, background: "#04060d" }} onClick={onDone}>
      <img className="absolute inset-0 h-full w-full object-cover opacity-70" src={GAME_IMAGES[`battle-${chapter.id}`]} alt="" />
      <div className="absolute inset-0 bg-slate-950/55" />
      <CodeRain fast />
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 58%, ${m.accent}33, transparent 60%)` }} />
      <div className="absolute inset-0" style={{ animation: "diveZoom 1s ease-in 2.2s both" }}>
        <div className="absolute inset-x-0 text-center px-6" style={{ top: "22%" }}>
          <div className="inline-block rounded-full border border-amber-200/50 bg-slate-950/70 px-5 py-1 font-black text-amber-300"
            style={{ fontSize: 40, textShadow: "0 0 22px rgba(251,191,36,.6)", animation: "dropIn .7s ease-out both" }}
          >
            {chapter.no}
          </div>
          <div className="font-black text-white mt-3" style={{ fontSize: 28, textShadow: "0 3px 16px #000", animation: "fadeUp .6s ease-out .45s both" }}>
            {chapter.title}
          </div>
        </div>

        <div className="absolute" style={{ left: "50%", top: "60%", animation: "portalIn .9s ease-out 1.1s both" }}>
            <div className="relative" style={{ width: 210, height: 210, marginLeft: -105, marginTop: -105 }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, ${m.accent}, transparent, ${m.body}, transparent, ${m.accent})`,
                opacity: 0.6,
                animation: "spin 2.4s linear infinite",
              }}
            />
            <div className="absolute inset-4 rounded-full" style={{ border: `3px solid ${m.body}`, boxShadow: `0 0 30px ${m.accent}` }} />
            <div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${m.accent}`, animation: "orbPulse 1.6s ease-in-out infinite" }} />
            <div
              className="absolute inset-0 flex items-center justify-center text-white font-black"
              style={{ fontSize: 15, textShadow: "0 2px 8px rgba(0,0,0,.9)" }}
            >
              {chapter.dungeon}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 text-center" style={{ bottom: "16%", animation: "fadeUp .5s ease-out 1.8s both" }}>
          <span className="font-serif text-slate-200" style={{ fontStyle: "italic", fontSize: 16, textShadow: "0 2px 8px rgba(0,0,0,.8)" }}>
            いざ、{chapter.dungeon}へ——
          </span>
        </div>
      </div>
      <div className="absolute right-4 text-slate-400 text-sm" style={{ top: "6%", zIndex: 32 }}>
        タップでスキップ →
      </div>
    </div>
  );
}
