import Logo from "../ui/Logo.jsx";
import Sage from "../characters/Sage.jsx";
import Monster from "../characters/Monster.jsx";
import { SKILLS, SAGE_LINES } from "../../content/index.js";
import { isUnlocked, nextChapterIndex } from "../../lib/game.js";
import { useAudio } from "../../audio/AudioProvider.jsx";

export default function Home({ chapters, completed, onStart, onReset, hasSave }) {
  const { playSfx } = useAudio();
  const nextIdx = nextChapterIndex(chapters, completed);

  return (
    <div>
      <div className="flex flex-col items-center mb-5" style={{ animation: "titlePop .6s ease-out" }}>
        <Logo scale={0.82} />
      </div>

      <div
        className="rounded-xl border border-emerald-800 bg-emerald-950 p-3 mb-5 flex gap-3 items-start"
        style={{ animation: "fadeUp .5s ease-out .3s both" }}
      >
        <div className="shrink-0">
          <Sage size={44} />
        </div>
        <p className="text-sm text-emerald-100 leading-relaxed">{SAGE_LINES.home}</p>
      </div>

      <div className="space-y-3">
        {chapters.map((c, i) => {
          const cleared = completed.includes(c.id);
          const unlocked = isUnlocked(chapters, i, completed);
          const isNext = i === nextIdx;
          return (
            <button
              key={c.id}
              disabled={!unlocked}
              onClick={() => {
                playSfx("select");
                onStart(i);
              }}
              className={
                "w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors " +
                (unlocked
                  ? "border-slate-600 bg-slate-800 hover:border-amber-400 hover:bg-slate-700"
                  : "border-slate-800 bg-slate-900 opacity-60")
              }
              style={{ animation: `fadeUp .45s ease-out ${0.45 + i * 0.12}s both` }}
            >
              <div
                className="w-14 h-14 shrink-0 flex items-center justify-center"
                style={isNext ? { animation: "ctaPulse 1.8s ease-in-out infinite", borderRadius: 12 } : undefined}
              >
                {unlocked ? <Monster cfg={c.monster} defeated={cleared} size={56} /> : <span className="text-3xl">🔒</span>}
              </div>
              <div className="flex-1">
                <div className="text-xs text-slate-400 font-mono">
                  {c.no}・{SKILLS[c.skill].label}
                </div>
                <div className="font-bold text-slate-100">{c.title}</div>
                <div className="text-xs text-slate-500">{unlocked ? c.monster.name : c.dungeon}</div>
              </div>
              {cleared ? (
                <span className="text-emerald-400 text-sm font-bold">✓ 撃破</span>
              ) : isNext ? (
                <span className="text-amber-300 text-sm font-bold" style={{ animation: "floatY 1.6s ease-in-out infinite" }}>
                  ▶
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {hasSave && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (window.confirm("進捗をすべて消して最初からやり直しますか？")) {
                playSfx("back");
                onReset();
              }
            }}
            className="text-xs text-slate-500 underline underline-offset-4 hover:text-slate-300"
          >
            進捗をリセットして最初から
          </button>
        </div>
      )}
    </div>
  );
}
