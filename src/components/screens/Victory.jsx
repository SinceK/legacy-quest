import Logo from "../ui/Logo.jsx";
import Monster from "../characters/Monster.jsx";
import { CHAPTERS } from "../../content/index.js";
import { levelOf } from "../../lib/game.js";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function Victory({ xp, onReset }) {
  const { playSfx } = useAudio();
  return (
    <div className="text-center py-8" style={{ animation: "fadeUp .35s ease-out" }}>
      <div
        key="vflash"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 40, background: "#fff", animation: "whiteFlash .6s ease-out forwards" }}
      />
      <div className="text-6xl mb-2" style={{ animation: "floatY 2.6s ease-in-out infinite" }}>
        🏆
      </div>
      <div className="flex justify-center gap-1 mb-3">
        {CHAPTERS.map((c) => (
          <div key={c.id} className="w-9 h-9">
            <Monster cfg={c.monster} defeated size={36} />
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-2">
        <Logo scale={0.7} />
      </div>
      <h2 className="text-xl font-black text-amber-300 mt-2">クエスト完了！</h2>
      <p className="text-slate-300 mt-2">COBOL基幹システムをJavaへ移行しきった。</p>
      <p className="text-slate-400 text-sm mt-1 font-mono">
        最終レベル Lv{levelOf(xp)}／総XP {xp}
      </p>
      <button
        onClick={() => {
          playSfx("select");
          onReset();
        }}
        className="mt-6 px-6 py-3 rounded-lg bg-slate-700 text-slate-100 font-bold hover:bg-slate-600"
      >
        もう一度あそぶ
      </button>
    </div>
  );
}
