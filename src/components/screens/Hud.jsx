import { SKILLS } from "../../content/index.js";
import { XP_PER_LEVEL, MAX_SKILL_RANK, levelOf } from "../../lib/game.js";

export default function Hud({ xp, skills }) {
  const level = levelOf(xp);
  const into = xp % XP_PER_LEVEL;
  const pct = (into / XP_PER_LEVEL) * 100;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 mb-4 relative" style={{ zIndex: 10 }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-amber-400 text-slate-900 font-black text-lg shrink-0">
          Lv{level}
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
            <span>XP</span>
            <span>
              {into} / {XP_PER_LEVEL}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%`, transition: "width .6s ease" }} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-3">
        {Object.entries(SKILLS).map(([key, s]) => (
          <div key={key} className="rounded-lg bg-slate-800 border border-slate-700 px-2 py-1.5 text-center">
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
                  className={"w-1.5 h-1.5 rounded-full " + (n < (skills[key] || 0) ? "bg-sky-400" : "bg-slate-600")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
