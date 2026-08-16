import Sage from "../characters/Sage.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";

function tone(score, answered) {
  if (!answered) return { bar: "#475569", text: "text-slate-400", label: "未挑戦" };
  if (score >= 80) return { bar: "#34d399", text: "text-emerald-300", label: "習得" };
  if (score >= 50) return { bar: "#fbbf24", text: "text-amber-300", label: "成長中" };
  return { bar: "#fb7185", text: "text-rose-300", label: "要復習" };
}

export default function LearningReport({ stats, onReviewTopic, onHome }) {
  const { playSfx } = useAudio();
  const summary = stats.reduce(
    (result, topic) => ({
      total: result.total + topic.total,
      answered: result.answered + topic.answered,
      mastered: result.mastered + topic.mastered,
    }),
    { total: 0, answered: 0, mastered: 0 },
  );
  const overall = summary.total ? Math.round((summary.mastered / summary.total) * 100) : 0;
  const ordered = [...stats].sort(
    (a, b) => Number(b.answered > 0) - Number(a.answered > 0) || a.mastery - b.mastery || a.topic.localeCompare(b.topic, "ja"),
  );

  return (
    <div>
      <button onClick={onHome} className="mb-2 text-sm text-slate-400 hover:text-slate-200">← マップへ</button>
      <div className="rpg-panel mb-4 rounded-3xl p-5" style={{ animation: "fadeUp .45s ease-out" }}>
        <div className="flex items-center gap-4">
          <Sage size={64} mood="think" />
          <div className="flex-1">
            <div className="text-[10px] font-black tracking-[.22em] text-amber-300">LEARNING REPORT</div>
            <h2 className="text-2xl font-black text-slate-50">学習レポート</h2>
            <p className="mt-1 text-xs text-slate-400">最後に正解した問題を習得済みとして集計</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-emerald-300">{overall}%</div>
            <div className="text-[10px] text-slate-400">総合理解度</div>
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-300 transition-all" style={{ width: `${overall}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>回答範囲 {summary.answered} / {summary.total}問</span>
          <span>習得 {summary.mastered}問</span>
        </div>
      </div>

      <div className="space-y-3">
        {ordered.map((topic, index) => {
          const style = tone(topic.mastery, topic.answered);
          return (
            <div
              key={topic.topic}
              className="quest-card rounded-2xl p-4"
              style={{ animation: `fadeUp .35s ease-out ${Math.min(index * .04, .5)}s both` }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <div className="font-black text-slate-100">{topic.topic}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    回答 {topic.answered}/{topic.total}問
                    {topic.attempts > 0 ? `・累計正答率 ${topic.accuracy}%` : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-black ${style.text}`}>{topic.mastery}%</div>
                  <div className={`text-[10px] font-bold ${style.text}`}>{style.label}</div>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-950">
                <div className="h-full rounded-full transition-all" style={{ width: `${topic.mastery}%`, background: style.bar }} />
              </div>
              <button
                onClick={() => {
                  playSfx("select");
                  onReviewTopic(topic.topic);
                }}
                className="mt-3 w-full rounded-lg border border-sky-400/25 bg-sky-400/10 py-2 text-xs font-black text-sky-200 hover:bg-sky-400/20"
              >
                このトピックを特訓する →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
