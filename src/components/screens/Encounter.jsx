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
        className="battle-arena rounded-3xl p-4 mb-4 relative overflow-hidden"
        style={{ animation: "bigShake .5s ease-out" }}
      >
        <div className="battle-aura" style={{ background: `radial-gradient(circle, ${m.accent}55, transparent 68%)` }} />
        <div className="relative text-center mb-2">
          <span className="boss-nameplate" style={{ animation: "bannerIn .5s ease-out .15s both" }}>
            WARNING・{m.name} 出現！
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
        className="rpg-panel rounded-2xl p-3 mb-4 flex gap-3 items-start"
        style={{ animation: "fadeUp .4s ease-out .4s both" }}
      >
        <div className="shrink-0">
          <Sage size={40} mood={chapter.monster.mood === "angry" ? "warn" : "happy"} />
        </div>
        <p className="text-sm text-emerald-100 leading-relaxed">{chapter.intro}</p>
      </div>

      <button
        onClick={onFight}
        className="rpg-button w-full py-3.5 rounded-xl text-white font-black text-lg"
        style={{ animation: "fadeUp .4s ease-out .55s both, ctaPulse 1.6s ease-in-out 1s infinite" }}
      >
        ⚔ たたかう！
      </button>
    </div>
  );
}
