import Logo from "../ui/Logo.jsx";
import Monster from "../characters/Monster.jsx";
import { CHAPTERS } from "../../content/index.js";
import { levelOf } from "../../lib/game.js";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function Victory({ xp, onReset }) {
  const { playSfx } = useAudio();
  return (
    <div className="rpg-panel rounded-3xl text-center p-6 my-4 overflow-hidden relative" style={{ animation: "levelSlam .6s ease-out" }}>
      <div
        key="vflash"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 40, background: "#fff", animation: "whiteFlash .6s ease-out forwards" }}
      />
      <div className="result-rays" />
      <div className="relative text-7xl mb-2" style={{ animation: "floatY 2.6s ease-in-out infinite" }}>
        🏆
      </div>
      <div className="relative flex justify-center gap-1 mb-3">
        {CHAPTERS.map((c) => (
          <div key={c.id} className="w-9 h-9">
            <Monster cfg={c.monster} defeated size={36} />
          </div>
        ))}
      </div>
      <div className="relative flex justify-center mb-2">
        <Logo scale={0.7} />
      </div>
      <h2 className="relative text-2xl font-black text-amber-300 mt-2">LEGACY QUEST COMPLETE!</h2>
      <p className="text-slate-300 mt-2">COBOL基幹システムをJavaへ移行しきった。</p>
      <p className="text-slate-400 text-sm mt-1 font-mono">
        最終レベル Lv{levelOf(xp)}／総XP {xp}
      </p>
      <button
        onClick={() => {
          playSfx("select");
          onReset();
        }}
        className="relative rpg-button mt-6 px-8 py-3 rounded-xl text-white font-black"
      >
        もう一度あそぶ
      </button>
    </div>
  );
}
