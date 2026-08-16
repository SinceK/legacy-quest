import { DIFFICULTY_LABELS } from "../../lib/game.js";

const TONES = {
  beginner: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  intermediate: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  advanced: "border-violet-400/40 bg-violet-400/10 text-violet-200",
  practical: "border-amber-400/40 bg-amber-400/10 text-amber-200",
};

export default function QuestionMeta({ question }) {
  return (
    <div className="flex flex-wrap gap-2 mb-2 text-[10px] font-black tracking-wider">
      <span className="rounded-full border border-slate-500/40 bg-slate-700/50 px-2 py-1 text-slate-200">
        {question.topic}
      </span>
      <span className={`rounded-full border px-2 py-1 ${TONES[question.difficulty] ?? TONES.beginner}`}>
        {DIFFICULTY_LABELS[question.difficulty] ?? question.difficulty}
      </span>
    </div>
  );
}
