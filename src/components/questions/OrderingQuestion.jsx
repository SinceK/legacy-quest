import { useMemo, useState } from "react";
import Feedback from "./Feedback.jsx";
import { shuffle } from "../../lib/game.js";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function OrderingQuestion({ q, onResult, onNext }) {
  const { playSfx } = useAudio();
  const shuffled = useMemo(() => shuffle(q.items).map((x) => ({ text: x.v, orig: x.i })), [q.id]);
  const [seq, setSeq] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const done = seq.length === q.items.length;
  const correct = submitted && seq.every((origIdx, pos) => origIdx === pos);

  function pick(orig) {
    if (submitted || seq.includes(orig)) return;
    playSfx("select");
    setSeq([...seq, orig]);
  }

  function check() {
    if (!done) return;
    setSubmitted(true);
    onResult(seq.every((origIdx, pos) => origIdx === pos));
  }

  return (
    <div style={submitted && !correct ? { animation: "shakeX .4s" } : undefined}>
      <div className="grid gap-2 mb-3">
        {shuffled.map((it) => {
          const chosen = seq.includes(it.orig);
          const posIdx = seq.indexOf(it.orig);
          const okPos = submitted && chosen && posIdx === it.orig;
          return (
            <button
              key={it.orig}
              onClick={() => pick(it.orig)}
              disabled={chosen || submitted}
              className={
                "w-full text-left px-4 py-3 rounded-lg border font-mono text-sm flex items-center gap-3 " +
                (chosen
                  ? submitted
                    ? okPos
                      ? "border-emerald-400 bg-emerald-900 text-emerald-100"
                      : "border-rose-400 bg-rose-900 text-rose-100"
                    : "border-amber-400 bg-slate-700 text-amber-100"
                  : "border-slate-600 bg-slate-800 text-slate-100 hover:border-amber-400")
              }
            >
              <span
                className={
                  "w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold " +
                  (chosen ? "bg-amber-400 text-slate-900" : "bg-slate-600 text-slate-300")
                }
              >
                {chosen ? posIdx + 1 : "・"}
              </span>
              {it.text}
            </button>
          );
        })}
      </div>
      {submitted && !correct && (
        <div className="mb-2 text-xs text-slate-400 font-mono">
          正しい順: {q.items.map((t, i) => `${i + 1}.${t}`).join("  ")}
        </div>
      )}
      {!submitted ? (
        <div className="flex gap-2">
          <button
            onClick={() => {
              playSfx("back");
              setSeq([]);
            }}
            className="px-4 py-3 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
          >
            やり直す
          </button>
          <button
            onClick={check}
            disabled={!done}
            className={
              "flex-1 py-3 rounded-lg font-bold " +
              (done ? "bg-amber-400 text-slate-900 hover:bg-amber-300" : "bg-slate-700 text-slate-500")
            }
          >
            こうげき！
          </button>
        </div>
      ) : (
        <Feedback correct={correct} explanation={q.explanation} xp={q.xp} onNext={onNext} />
      )}
    </div>
  );
}
