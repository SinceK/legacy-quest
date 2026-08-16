import { useEffect, useMemo, useRef, useState } from "react";
import { CHAPTERS } from "./content/index.js";
import { buildTopicStats, levelOf } from "./lib/game.js";
import { useGameProgress } from "./hooks/useGameProgress.js";
import { useAudio, useBgm } from "./audio/AudioProvider.jsx";

import CodeRain from "./components/ui/CodeRain.jsx";
import AudioToggle from "./components/ui/AudioToggle.jsx";
import GameBackdrop from "./components/ui/GameBackdrop.jsx";
import Hud from "./components/screens/Hud.jsx";
import Intro from "./components/screens/Intro.jsx";
import Home from "./components/screens/Home.jsx";
import Stage from "./components/screens/Stage.jsx";
import ChapterResult from "./components/screens/ChapterResult.jsx";
import Victory from "./components/screens/Victory.jsx";
import Review from "./components/screens/Review.jsx";
import LearningReport from "./components/screens/LearningReport.jsx";

const BGM_BY_SCREEN = {
  intro: "title",
  home: "map",
  result: "map",
  stage: "battle",
  victory: "victory",
  review: "map",
  report: "map",
};

export default function App() {
  const { progress, addScore, recordAnswer, completeChapter, markIntroSeen, reset, hasSave } = useGameProgress();
  const { playSfx } = useAudio();

  // 一度オープニングを見ていればマップから再開する
  const [screen, setScreen] = useState(() => (progress.introSeen ? "home" : "intro"));
  const [current, setCurrent] = useState(0);
  const [lastGain, setLastGain] = useState(0);
  const [levelUp, setLevelUp] = useState(null);
  const [reviewTopic, setReviewTopic] = useState(null);

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

  const topicStats = useMemo(
    () => buildTopicStats(CHAPTERS, progress.answerStats),
    [progress.answerStats],
  );
  const allQuestionItems = CHAPTERS.flatMap((chapter) =>
    chapter.questions
      .map((question) => ({
        ...question,
        chapter,
        awardXp: !progress.scored.includes(question.id),
      })),
  );
  const mistakeItems = allQuestionItems.filter((question) => progress.mistakes.includes(question.id));
  const reviewItems = reviewTopic
    ? allQuestionItems.filter((question) => question.topic === reviewTopic)
    : mistakeItems;

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
  const activeChapter = CHAPTERS[current];
  const backdropScene =
    screen === "stage"
      ? `battle-${activeChapter.id}`
      : screen === "victory"
        ? "victory"
        : "map";

  return (
    <div className="game-shell min-h-screen w-full py-5 px-3 sm:px-5 relative">
      {screen !== "intro" && <GameBackdrop scene={backdropScene} accent={activeChapter?.monster.accent} />}
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
          <div className="level-up-card px-10 py-7 text-center">
            <div className="level-up-rays" />
            <div className="relative text-3xl font-black">LEVEL UP!</div>
            <div className="font-mono font-bold">Lv{levelUp} になった！</div>
          </div>
        </div>
      )}

      {screen !== "intro" && (
        <div className="max-w-xl mx-auto relative" style={{ zIndex: 10 }}>
          <div className="flex justify-end mb-2">
            <AudioToggle />
          </div>
          <Hud xp={progress.xp} skills={progress.skills} />
          <div key={screen}>
            {screen === "home" && (
              <Home
                chapters={CHAPTERS}
                completed={progress.completed}
                mistakeCount={mistakeItems.length}
                onStart={startStage}
                onReview={() => {
                  setReviewTopic(null);
                  setScreen("review");
                }}
                onReport={() => setScreen("report")}
                onReset={handleReset}
                hasSave={hasSave}
              />
            )}
            {screen === "stage" && (
              <Stage
                chapter={CHAPTERS[current]}
                onScore={handleScore}
                onAnswer={recordAnswer}
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
            {screen === "review" && (
              <Review
                items={reviewItems}
                topic={reviewTopic}
                onAnswer={(question, correct) => {
                  recordAnswer(question.id, correct);
                  if (correct) handleScore(question.id, question.chapter.skill, question.xp);
                }}
                onHome={() => {
                  setReviewTopic(null);
                  setScreen("home");
                }}
              />
            )}
            {screen === "report" && (
              <LearningReport
                stats={topicStats}
                onReviewTopic={(topic) => {
                  setReviewTopic(topic);
                  setScreen("review");
                }}
                onHome={() => setScreen("home")}
              />
            )}
          </div>
          <p className="text-center text-xs text-slate-600 mt-8 font-mono">
            進捗はこのブラウザに自動保存されます
          </p>
        </div>
      )}
    </div>
  );
}
