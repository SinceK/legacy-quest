import { useState } from "react";
import Feedback from "./Feedback.jsx";
import { panelStyle } from "../../lib/theme.js";

export default function ChoiceQuestion({ q, onResult, onNext }) {
  const [picked, setPicked] = useState(null);
  const submitted = picked !== null;
  const correct = submitted && picked === q.answer;

  function choose(i) {
    if (submitted) return;
    setPicked(i);
    onResult(i === q.answer);
  }

  return (
    <div style={submitted && !correct ? { animation: "shakeX .4s" } : undefined}>
      {q.javaTemplate && (
        <div className="rounded-md px-4 py-3 mb-4 text-sm" style={{ ...panelStyle, color: "#fde68a" }}>
          {q.javaTemplate.split("⬚").map((part, idx, arr) => (
            <span key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <span
                  className="inline-block px-2 mx-1 rounded"
                  style={{
                    background: submitted
                      ? correct
                        ? "rgba(16,185,129,0.3)"
                        : "rgba(244,63,94,0.3)"
                      : "rgba(253,230,138,0.18)",
                  }}
                >
                  {submitted ? q.options[picked] : "＿＿"}
                </span>
              )}
            </span>
          ))}
        </div>
      )}
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          let cls = "answer-card w-full text-left px-4 py-3 rounded-xl border transition-colors font-mono text-sm ";
          if (!submitted) cls += "border-slate-600 bg-slate-800 text-slate-100 hover:border-amber-400 hover:bg-slate-700";
          else if (i === q.answer) cls += "border-emerald-400 bg-emerald-900 text-emerald-100";
          else if (i === picked) cls += "border-rose-400 bg-rose-900 text-rose-100";
          else cls += "border-slate-700 bg-slate-800 text-slate-400";
          return (
            <button
              key={i}
              className={cls}
              onClick={() => choose(i)}
              style={{ animation: "fadeUp .3s both", animationDelay: `${i * 45}ms` }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {submitted && (
        <Feedback
          correct={correct}
          explanation={q.explanation}
          wrongReason={correct ? null : q.wrongReasons?.[picked]}
          migrationTip={q.migrationTip}
          xp={q.xp}
          onNext={onNext}
        />
      )}
    </div>
  );
}
