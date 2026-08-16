import { useState } from "react";
import BattleIntro from "./BattleIntro.jsx";
import Encounter from "./Encounter.jsx";
import Monster from "../characters/Monster.jsx";
import CobolPanel from "../ui/CobolPanel.jsx";
import Impact from "../ui/Impact.jsx";
import QuestionView from "../questions/QuestionView.jsx";
import QuestionMeta from "../questions/QuestionMeta.jsx";
import { useAudio } from "../../audio/AudioProvider.jsx";
import { createQuestionSession } from "../../lib/game.js";

export default function Stage({ chapter, onScore, onAnswer, onComplete, onHome }) {
  const { playSfx } = useAudio();
  const [phase, setPhase] = useState("dive");
  const [qi, setQi] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [fx, setFx] = useState({ key: 0, type: "crit", dmg: 0 });
  const [pop, setPop] = useState(null);
  const [combo, setCombo] = useState(0);
  const [questions] = useState(() => createQuestionSession(chapter.questions));

  const q = questions[qi];
  const total = questions.length;
  const hpPct = ((total - answered) / total) * 100;
  const defeated = answered >= total;

  function result(correct) {
    const isFinalBlow = answered + 1 >= total;
    setAnswered((a) => a + 1);
    setFx({ key: fx.key + 1, type: correct ? "crit" : "miss", dmg: q.xp });

    playSfx(correct ? "correct" : "wrong");
    onAnswer(q.id, correct);
    if (isFinalBlow) setTimeout(() => playSfx("defeat"), 280);

    if (correct) {
      onScore(q.id, chapter.skill, q.xp);
      setPop({ key: (pop?.key || 0) + 1, xp: q.xp });
      if (combo + 1 >= 2 && !isFinalBlow) setTimeout(() => playSfx("combo"), 170);
      setCombo((c) => c + 1);
    } else {
      setCombo(0);
    }
  }

  function next() {
    if (qi + 1 < total) setQi(qi + 1);
    else onComplete();
  }

  function goHome() {
    playSfx("back");
    onHome();
  }

  if (phase === "dive") return <BattleIntro chapter={chapter} onDone={() => setPhase("encounter")} />;
  if (phase === "encounter") {
    return (
      <div>
        <button onClick={goHome} className="text-slate-400 text-sm mb-2 hover:text-slate-200">
          ← マップへ
        </button>
        <Encounter chapter={chapter} onFight={() => setPhase("battle")} />
      </div>
    );
  }

  const shakeAnim = fx.key > 0 ? (fx.type === "crit" ? "screenShake .4s" : "bigShake .45s") : undefined;
  const punchAnim = fx.key > 0 && fx.type === "crit" ? "punch .32s ease-out" : undefined;

  return (
    <div>
      {fx.key > 0 && (
        <div
          key={`flash${fx.key}`}
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 40,
            background: defeated
              ? "#fff"
              : fx.type === "crit"
                ? "radial-gradient(circle at 50% 40%, rgba(251,191,36,.55), transparent 60%)"
                : "radial-gradient(circle at 50% 45%, transparent 45%, rgba(244,63,94,.65))",
            animation: defeated
              ? "whiteFlash .55s ease-out forwards"
              : fx.type === "crit"
                ? "critFlash .5s ease-out forwards"
                : "redPulse .55s ease-out forwards",
          }}
        />
      )}

      <button onClick={goHome} className="text-slate-400 text-sm mb-2 hover:text-slate-200">
        ← マップへ
      </button>

      <div
        key={`shake${fx.key}`}
        className="battle-arena rounded-3xl p-4 mb-4 relative overflow-hidden"
        style={{ animation: shakeAnim }}
      >
        <div className="battle-aura" style={{ background: `radial-gradient(circle, ${chapter.monster.accent}4d, transparent 68%)` }} />
        <div className="relative" key={`punch${fx.key}`} style={{ animation: punchAnim }}>
          <div className="flex justify-between items-center mb-1">
            <span className="boss-nameplate">BOSS・{chapter.monster.name}</span>
            <span className="text-xs font-mono text-slate-400">
              {chapter.no}・{chapter.dungeon}
            </span>
          </div>
          <div className="hp-frame relative h-4 rounded-full bg-slate-950/80 overflow-hidden mb-3 p-[3px]">
            <div className="absolute inset-y-0 left-0 rounded-full bg-amber-300" style={{ width: `${hpPct}%`, transition: "width .7s ease .25s" }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-rose-500" style={{ width: `${hpPct}%`, transition: "width .18s ease" }} />
          </div>
          <div className="flex justify-center relative" style={{ minHeight: 132 }}>
            <div
              key={`mon${fx.key}`}
              style={fx.key > 0 && !defeated ? { animation: "knockback .45s ease-out, hardFlash .5s ease-out" } : undefined}
            >
              <Monster cfg={chapter.monster} defeated={defeated} size={142} />
            </div>
            <Impact fx={fx} />
            {combo >= 2 && !defeated && (
              <span
                key={`combo${fx.key}`}
                className="absolute font-black text-amber-300"
                style={{ left: "8%", top: "4%", fontSize: 18, textShadow: "0 2px 6px rgba(0,0,0,.6)", animation: "comboPop .4s ease-out" }}
              >
                {combo} COMBO!
              </span>
            )}
            {pop && (
              <span
                key={`xp${pop.key}`}
                className="absolute font-black text-lg text-emerald-300"
                style={{ left: "64%", top: "8%", animation: "riseFade 1s ease-out forwards", textShadow: "0 2px 6px rgba(0,0,0,.6)" }}
              >
                ＋{pop.xp} XP
              </span>
            )}
            {defeated && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ animation: "bigText .5s ease-out" }}>
                <span className="text-rose-300 font-black text-3xl" style={{ textShadow: "0 0 18px rgba(244,63,94,.8)" }}>
                  撃破！！！
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="question-shell rounded-3xl p-4">
        <div className="mb-4">
          <CobolPanel code={chapter.cobol} />
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400 font-mono">
            問 {qi + 1} / {total}
          </span>
          <span className="text-xs text-amber-300 font-mono">＋{q.xp} XP</span>
        </div>
        <QuestionMeta question={q} />
        <h2 className="font-bold text-slate-100 mb-3">{q.prompt}</h2>

        <QuestionView q={q} onResult={result} onNext={next} />
      </div>
    </div>
  );
}
