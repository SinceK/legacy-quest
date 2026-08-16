import { useEffect } from "react";
import Monster from "../characters/Monster.jsx";
import Sage from "../characters/Sage.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function Encounter({ chapter, onFight }) {
  const { playSfx } = useAudio();
  const m = chapter.monster;

  useEffect(() => {
    playSfx("encounter");
    const t = setTimeout(onFight, 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ animation: "fadeUp .3s" }}>
      <div
        key="flash"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 40, background: "#fff", animation: "whiteFlash .5s ease-out forwards" }}
      />
      <div
        className="rounded-xl border border-slate-700 bg-slate-900 p-4 mb-4 relative overflow-hidden"
        style={{ animation: "bigShake .5s ease-out" }}
      >
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, ${m.accent}44, transparent 65%)` }} />
        <div className="relative text-center mb-2">
          <span className="inline-block text-lg font-black text-slate-100" style={{ animation: "bannerIn .5s ease-out .15s both" }}>
            ⚔ {m.name} が あらわれた！
          </span>
        </div>
        <div className="relative flex justify-center" style={{ minHeight: 170 }}>
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "55%",
              width: 80,
              height: 80,
              marginLeft: -40,
              marginTop: -40,
              borderRadius: 9999,
              border: `4px solid ${m.accent}`,
              animation: "shock .6s ease-out .25s forwards",
            }}
          />
          <div style={{ animation: "slamIn .6s ease-out" }}>
            <Monster cfg={m} size={150} />
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border border-emerald-800 bg-emerald-950 p-3 mb-4 flex gap-3 items-start"
        style={{ animation: "fadeUp .4s ease-out .4s both" }}
      >
        <div className="shrink-0">
          <Sage size={40} mood={chapter.monster.mood === "angry" ? "warn" : "happy"} />
        </div>
        <p className="text-sm text-emerald-100 leading-relaxed">{chapter.intro}</p>
      </div>

      <button
        onClick={onFight}
        className="w-full py-3.5 rounded-xl bg-rose-500 text-white font-black text-lg hover:bg-rose-400"
        style={{ animation: "fadeUp .4s ease-out .55s both, ctaPulse 1.6s ease-in-out 1s infinite" }}
      >
        ⚔ たたかう！
      </button>
    </div>
  );
}
