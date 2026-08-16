import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "./content/index.js";
import { levelOf } from "./lib/game.js";
import { useGameProgress } from "./hooks/useGameProgress.js";
import { useAudio, useBgm } from "./audio/AudioProvider.jsx";

import CodeRain from "./components/ui/CodeRain.jsx";
import AudioToggle from "./components/ui/AudioToggle.jsx";
import Hud from "./components/screens/Hud.jsx";
import Intro from "./components/screens/Intro.jsx";
import Home from "./components/screens/Home.jsx";
import Stage from "./components/screens/Stage.jsx";
import ChapterResult from "./components/screens/ChapterResult.jsx";
import Victory from "./components/screens/Victory.jsx";

const BGM_BY_SCREEN = {
  intro: "title",
  home: "map",
  result: "map",
  stage: "battle",
  victory: "victory",
};

export default function App() {
  const { progress, addScore, completeChapter, markIntroSeen, reset, hasSave } = useGameProgress();
  const { playSfx } = useAudio();

  // 一度オープニングを見ていればマップから再開する
  const [screen, setScreen] = useState(() => (progress.introSeen ? "home" : "intro"));
  const [current, setCurrent] = useState(0);
  const [lastGain, setLastGain] = useState(0);
  const [levelUp, setLevelUp] = useState(null);

  useBgm(BGM_BY_SCREEN[screen] ?? "map");

  // XPの変化からレベルアップを検知して演出する
  const level = levelOf(progress.xp);
  const prevLevel = useRef(level);
  useEffect(() => {
    if (level <= prevLevel.current) {
      prevLevel.current = level;
      return undefined;
    }
    prevLevel.current = level;
    setLevelUp(level);
    playSfx("levelup");
    const t = setTimeout(() => setLevelUp(null), 1900);
    return () => clearTimeout(t);
  }, [level, playSfx]);

  function handleScore(questionId, skill, amount) {
    if (progress.scored.includes(questionId)) return;
    setLastGain((g) => g + amount);
    addScore(questionId, skill, amount);
  }

  function startStage(index) {
    setCurrent(index);
    setLastGain(0);
    setScreen("stage");
  }

  function completeStage() {
    const chapter = CHAPTERS[current];
    completeChapter(chapter.id);
    const cleared = progress.completed.includes(chapter.id)
      ? progress.completed.length
      : progress.completed.length + 1;
    setScreen(cleared === CHAPTERS.length ? "victory" : "result");
  }

  function handleReset() {
    reset();
    setCurrent(0);
    setLastGain(0);
    setScreen("home");
  }

  const allCleared = progress.completed.length === CHAPTERS.length;

  return (
    <div
      className="min-h-screen w-full py-6 px-4 relative"
      style={{ background: "radial-gradient(1100px 500px at 50% -8%, #1e1b4b, #0b1020 55%, #070a12)" }}
    >
      {screen === "home" && <CodeRain />}
      {screen === "intro" && (
        <Intro
          onDone={() => {
            markIntroSeen();
            setScreen("home");
          }}
        />
      )}

      {levelUp && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 50 }}>
          <div
            className="rounded-2xl bg-amber-400 text-slate-900 px-8 py-5 text-center"
            style={{ animation: "popIn .4s, glowPulse 1.6s ease-in-out" }}
          >
            <div className="text-2xl font-black">LEVEL UP!</div>
            <div className="font-mono font-bold">Lv{levelUp} になった！</div>
          </div>
        </div>
      )}

      {screen !== "intro" && (
        <div className="max-w-md mx-auto relative" style={{ zIndex: 10 }}>
          <div className="flex justify-end mb-2">
            <AudioToggle />
          </div>
          <Hud xp={progress.xp} skills={progress.skills} />
          <div key={screen}>
            {screen === "home" && (
              <Home
                chapters={CHAPTERS}
                completed={progress.completed}
                onStart={startStage}
                onReset={handleReset}
                hasSave={hasSave}
              />
            )}
            {screen === "stage" && (
              <Stage
                chapter={CHAPTERS[current]}
                onScore={handleScore}
                onComplete={completeStage}
                onHome={() => setScreen("home")}
              />
            )}
            {screen === "result" && (
              <ChapterResult
                chapter={CHAPTERS[current]}
                gained={lastGain}
                allCleared={allCleared}
                onHome={() => setScreen("home")}
              />
            )}
            {screen === "victory" && <Victory xp={progress.xp} onReset={handleReset} />}
          </div>
          <p className="text-center text-xs text-slate-600 mt-8 font-mono">
            進捗はこのブラウザに自動保存されます
          </p>
        </div>
      )}
    </div>
  );
}
