import { SKILLS } from "../../content/index.js";
import { XP_PER_LEVEL, MAX_SKILL_RANK, levelOf } from "../../lib/game.js";

export default function Hud({ xp, skills }) {
  const level = levelOf(xp);
  const into = xp % XP_PER_LEVEL;
  const pct = (into / XP_PER_LEVEL) * 100;

  return (
    <div className="rpg-panel rounded-2xl p-3.5 mb-4 relative" style={{ zIndex: 10 }}>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 text-slate-900 font-black shrink-0 border-2 border-amber-100 shadow-[0_0_22px_rgba(251,191,36,.45)]">
          <span className="text-[9px] absolute top-1.5">LEVEL</span>
          <span className="text-xl mt-2">{level}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
            <span>XP</span>
            <span>
              {into} / {XP_PER_LEVEL}
            </span>
          </div>
          <div className="h-3 rounded-full bg-slate-950/80 overflow-hidden border border-amber-100/20 p-[2px]">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300" style={{ width: `${pct}%`, transition: "width .6s ease", boxShadow: "0 0 12px #34d399" }} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-3">
        {Object.entries(SKILLS).map(([key, s]) => (
          <div key={key} className="rounded-xl bg-slate-950/50 border border-white/10 px-2 py-2 text-center">
            <div className="text-base leading-none">{s.emoji}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            <div
              key={skills[key] || 0}
              className="flex justify-center gap-0.5 mt-1"
              style={{ animation: (skills[key] || 0) > 0 ? "popIn .3s" : undefined }}
            >
              {Array.from({ length: MAX_SKILL_RANK }).map((_, n) => (
                <span
                  key={n}
                  className={"w-1.5 h-1.5 rotate-45 " + (n < (skills[key] || 0) ? "bg-cyan-300 shadow-[0_0_5px_#67e8f9]" : "bg-slate-700")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
