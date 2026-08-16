import Monster from "../characters/Monster.jsx";
import Sage from "../characters/Sage.jsx";
import { SKILLS, SAGE_LINES } from "../../content/index.js";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function ChapterResult({ chapter, gained, onHome, allCleared }) {
  const { playSfx } = useAudio();
  return (
    <div className="rpg-panel rounded-3xl text-center p-6 overflow-hidden relative" style={{ animation: "levelSlam .55s ease-out" }}>
      <div className="result-rays" />
      <div className="flex justify-center mb-2">
        <Monster cfg={chapter.monster} defeated size={110} />
      </div>
      <h2 className="relative text-2xl font-black text-amber-300">QUEST CLEAR!</h2>
      <div className="relative text-sm font-black tracking-widest text-white mt-1">モジュール移行、成功！</div>
      <p className="text-slate-300 mt-1">
        {chapter.no}「{chapter.title}」の主を撃破した
      </p>
      <div className="inline-block rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 mt-4 text-sm font-mono text-emerald-300">
        獲得 XP ＋{gained}／{SKILLS[chapter.skill].label} アップ ↑
      </div>
      <div className="relative rounded-2xl border border-emerald-400/30 bg-emerald-950/70 p-3 my-5 flex gap-3 items-start text-left">
        <div className="shrink-0">
          <Sage size={40} />
        </div>
        <p className="text-sm text-emerald-100 leading-relaxed">
          {allCleared ? SAGE_LINES.resultAll : SAGE_LINES.resultNext}
        </p>
      </div>
      <button
        onClick={() => {
          playSfx("select");
          onHome();
        }}
        className="relative rpg-button w-full py-3 rounded-xl text-white font-black"
      >
        {allCleared ? "マップへもどる" : "マップへもどって次へ →"}
      </button>
    </div>
  );
}
