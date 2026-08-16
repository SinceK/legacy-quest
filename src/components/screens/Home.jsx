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
    <div className="pb-6">
      <div className="flex flex-col items-center mb-4" style={{ animation: "titlePop .6s ease-out" }}>
        <Logo scale={0.82} />
      </div>

      <div
        className="rpg-panel rounded-2xl p-4 mb-5 flex gap-3 items-center"
        style={{ animation: "fadeUp .5s ease-out .3s both" }}
      >
        <div className="shrink-0">
          <Sage size={44} />
        </div>
        <div>
          <div className="text-[10px] font-black tracking-[.24em] text-amber-300 mb-1">GUIDE</div>
          <p className="text-sm text-emerald-50 leading-relaxed">{SAGE_LINES.home}</p>
        </div>
      </div>

      <div className="relative space-y-3">
        <div className="absolute left-[35px] top-8 bottom-8 w-px bg-gradient-to-b from-amber-300 via-emerald-400 to-violet-400 opacity-50" />
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
                "quest-card w-full flex items-center gap-3 rounded-2xl p-3.5 text-left transition-all " +
                (unlocked
                  ? isNext
                    ? "quest-card--next"
                    : ""
                  : "opacity-55 grayscale")
              }
              style={{ animation: `fadeUp .45s ease-out ${0.45 + i * 0.12}s both` }}
            >
              <div
                className="relative z-10 w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-slate-950/50 border border-white/10"
                style={isNext ? { animation: "ctaPulse 1.8s ease-in-out infinite", borderRadius: 12 } : undefined}
              >
                {unlocked ? <Monster cfg={c.monster} defeated={cleared} size={62} /> : <span className="text-3xl">🔒</span>}
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-amber-300 font-black tracking-wider">
                  {c.no}・{SKILLS[c.skill].label}
                </div>
                <div className="font-black text-slate-50 text-lg leading-tight">{c.title}</div>
                <div className="text-xs text-slate-300 mt-1">{unlocked ? `${c.dungeon}・${c.monster.name}` : c.dungeon}</div>
              </div>
              {cleared ? (
                <span className="rounded-full border border-emerald-400/50 bg-emerald-400/15 px-2 py-1 text-emerald-300 text-xs font-black">✓ CLEAR</span>
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
