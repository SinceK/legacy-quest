import { Sparkles } from "../ui/Ambience.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function Feedback({ correct, explanation, wrongReason, migrationTip, xp, onNext }) {
  const { playSfx } = useAudio();
  return (
    <div
      className={
        "rpg-panel relative mt-4 rounded-2xl p-4 border overflow-hidden " +
        (correct ? "border-emerald-500 bg-emerald-950" : "border-rose-500 bg-rose-950")
      }
      style={{ animation: "popIn .3s ease-out" }}
    >
      {correct && <Sparkles />}
      {correct && (
        <span className="absolute right-3 top-2 text-amber-300 font-black" style={{ animation: "riseFade 1s ease-out forwards" }}>
          ＋{xp} XP
        </span>
      )}
      <div className={"relative font-bold mb-1 " + (correct ? "text-emerald-300" : "text-rose-300")}>
        {correct ? "⚔️ クリティカル！！！" : "🛡️ 反撃をくらった…"}
      </div>
      {wrongReason && (
        <div className="relative mb-3 rounded-xl border border-rose-400/25 bg-rose-950/55 p-3">
          <div className="mb-1 text-[10px] font-black tracking-[.16em] text-rose-300">なぜ違う？</div>
          <p className="text-sm leading-relaxed text-rose-100">{wrongReason}</p>
        </div>
      )}
      <div className="relative">
        <div className="mb-1 text-[10px] font-black tracking-[.16em] text-slate-400">解説</div>
        <p className="text-sm text-slate-200 leading-relaxed">{explanation}</p>
      </div>
      {migrationTip && (
        <div className="relative mt-3 rounded-xl border border-sky-400/25 bg-sky-950/55 p-3">
          <div className="mb-1 text-[10px] font-black tracking-[.16em] text-sky-300">Java移行の実務ポイント</div>
          <p className="text-sm leading-relaxed text-sky-100">{migrationTip}</p>
        </div>
      )}
      <button
        onClick={() => {
          playSfx("select");
          onNext();
        }}
        className="relative rpg-button mt-3 w-full py-2.5 rounded-xl text-white font-bold"
      >
        つぎへ →
      </button>
    </div>
  );
}
