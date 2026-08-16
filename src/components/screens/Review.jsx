import { useState } from "react";
import { createQuestionSession } from "../../lib/game.js";
import CobolPanel from "../ui/CobolPanel.jsx";
import QuestionMeta from "../questions/QuestionMeta.jsx";
import QuestionView from "../questions/QuestionView.jsx";
import Sage from "../characters/Sage.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function Review({ items, onAnswer, onHome }) {
  const { playSfx } = useAudio();
  const [questions] = useState(() => createQuestionSession(items, items.length));
  const [index, setIndex] = useState(0);
  const [resolved, setResolved] = useState(0);
  const done = index >= questions.length;
  const q = questions[index];

  function result(correct) {
    playSfx(correct ? "correct" : "wrong");
    onAnswer(q, correct);
    if (correct) setResolved((value) => value + 1);
  }

  if (!questions.length || done) {
    return (
      <div className="rpg-panel rounded-3xl p-6 text-center" style={{ animation: "fadeUp .45s ease-out" }}>
        <div className="flex justify-center mb-3"><Sage size={64} mood="happy" /></div>
        <h2 className="text-2xl font-black text-amber-300">復習完了！</h2>
        <p className="mt-2 text-sm text-slate-300">
          {questions.length ? `${questions.length}問中${resolved}問を苦手リストから克服しました。` : "現在、復習が必要な問題はありません。"}
        </p>
        <button onClick={onHome} className="rpg-button mt-5 w-full rounded-xl py-3 font-black">
          マップへもどる
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onHome} className="mb-2 text-sm text-slate-400 hover:text-slate-200">← マップへ</button>
      <div className="rpg-panel mb-4 flex items-center gap-3 rounded-2xl p-3">
        <Sage size={42} mood="think" />
        <div>
          <div className="text-[10px] font-black tracking-[.2em] text-amber-300">REVIEW QUEST</div>
          <p className="text-sm text-emerald-100">間違えた問題を解き直して、苦手を克服するのじゃ。</p>
        </div>
      </div>
      <div className="question-shell rounded-3xl p-4">
        <CobolPanel code={q.chapter.cobol} />
        <div className="mb-2 mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>復習 {index + 1} / {questions.length}</span>
          <span>{q.chapter.no}</span>
        </div>
        <QuestionMeta question={q} />
        <h2 className="mb-3 font-bold text-slate-100">{q.prompt}</h2>
        <QuestionView q={q} onResult={result} onNext={() => setIndex((value) => value + 1)} />
      </div>
    </div>
  );
}
