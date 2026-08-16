import Monster from "../characters/Monster.jsx";
import Sage from "../characters/Sage.jsx";
import { SKILLS, SAGE_LINES } from "../../content/index.js";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function ChapterResult({ chapter, gained, onHome, allCleared }) {
  const { playSfx } = useAudio();
  return (
    <div className="text-center py-6" style={{ animation: "fadeUp .35s ease-out" }}>
      <div className="flex justify-center mb-2">
        <Monster cfg={chapter.monster} defeated size={110} />
      </div>
      <h2 className="text-xl font-black text-amber-300">モジュール移行、成功！</h2>
      <p className="text-slate-300 mt-1">
        {chapter.no}「{chapter.title}」の主を撃破した
      </p>
      <div className="inline-block rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 mt-4 text-sm font-mono text-emerald-300">
        獲得 XP ＋{gained}／{SKILLS[chapter.skill].label} アップ ↑
      </div>
      <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-3 my-5 flex gap-3 items-start text-left">
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
        className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 font-bold hover:bg-amber-300"
      >
        {allCleared ? "マップへもどる" : "マップへもどって次へ →"}
      </button>
    </div>
  );
}
