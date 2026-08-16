import { useMemo, useState } from "react";
import Feedback from "./Feedback.jsx";
import { shuffle } from "../../lib/game.js";

export default function MatchingQuestion({ q, onResult, onNext }) {
  const rights = useMemo(() => shuffle(q.pairs.map((p) => p.right)).map((x) => x.v), [q.id]);
  const [assign, setAssign] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allSet = q.pairs.every((_, i) => assign[i] != null && assign[i] !== "");
  const correct = submitted && q.pairs.every((p, i) => assign[i] === p.right);

  function check() {
    if (!allSet) return;
    setSubmitted(true);
    onResult(q.pairs.every((p, i) => assign[i] === p.right));
  }

  return (
    <div style={submitted && !correct ? { animation: "shakeX .4s" } : undefined}>
      <div className="grid gap-2">
        {q.pairs.map((p, i) => {
          const ok = submitted && assign[i] === p.right;
          const bad = submitted && assign[i] !== p.right;
          return (
            <div
              key={i}
              className="answer-card flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/80 px-3 py-2"
              style={{ animation: "fadeUp .3s both", animationDelay: `${i * 45}ms` }}
            >
              <span className="flex-1 font-mono text-sm text-emerald-200">{p.left}</span>
              <span className="text-slate-500">→</span>
              <select
                disabled={submitted}
                value={assign[i] ?? ""}
                onChange={(e) => setAssign({ ...assign, [i]: e.target.value })}
                className={
                  "rounded-md px-2 py-2 text-sm font-mono border bg-slate-900 " +
                  (ok
                    ? "border-emerald-400 text-emerald-200"
                    : bad
                      ? "border-rose-400 text-rose-200"
                      : "border-slate-600 text-slate-100")
                }
              >
                <option value="">— えらぶ —</option>
                {rights.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {submitted && !correct && (
        <div className="mt-2 text-xs text-slate-400 font-mono">
          正解: {q.pairs.map((p) => `${p.left}→${p.right}`).join(" / ")}
        </div>
      )}
      {!submitted ? (
        <button
          onClick={check}
          disabled={!allSet}
          className={
            "rpg-button mt-4 w-full py-3 rounded-xl font-bold " +
            (allSet ? "bg-amber-400 text-slate-900 hover:bg-amber-300" : "bg-slate-700 text-slate-500")
          }
        >
          こうげき！
        </button>
      ) : (
        <Feedback
          correct={correct}
          explanation={q.explanation}
          wrongReason={correct ? null : q.wrongReason}
          migrationTip={q.migrationTip}
          xp={q.xp}
          onNext={onNext}
        />
      )}
    </div>
  );
}
