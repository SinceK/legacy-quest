import { useCallback, useEffect, useMemo, useState } from "react";
import { readJson, writeJson, removeKey } from "../lib/storage.js";
import { MAX_SKILL_RANK } from "../lib/game.js";
import { EMPTY_SKILLS } from "../content/index.js";

const STORAGE_KEY = "legacy-quest:progress";
const SCHEMA_VERSION = 1;

const emptyProgress = () => ({
  version: SCHEMA_VERSION,
  xp: 0,
  skills: { ...EMPTY_SKILLS },
  completed: [],
  scored: [],
  mistakes: [],
  answerStats: {},
  introSeen: false,
});

function load() {
  const saved = readJson(STORAGE_KEY, null);
  if (!saved || saved.version !== SCHEMA_VERSION) return emptyProgress();
  const base = emptyProgress();
  const scored = Array.isArray(saved.scored) ? saved.scored : [];
  const mistakes = Array.isArray(saved.mistakes) ? saved.mistakes : [];
  const answerStats =
    saved.answerStats && typeof saved.answerStats === "object" && !Array.isArray(saved.answerStats)
      ? saved.answerStats
      : Object.fromEntries(
          [...new Set([...scored, ...mistakes])].map((questionId) => {
            const wasCorrect = scored.includes(questionId);
            const isMistake = mistakes.includes(questionId);
            return [
              questionId,
              {
                attempts: wasCorrect && isMistake ? 2 : 1,
                correctCount: wasCorrect ? 1 : 0,
                lastCorrect: !isMistake,
              },
            ];
          }),
        );
  return {
    ...base,
    ...saved,
    skills: { ...base.skills, ...(saved.skills ?? {}) },
    completed: Array.isArray(saved.completed) ? saved.completed : [],
    scored,
    mistakes,
    answerStats,
  };
}

/** 進捗をlocalStorageへ自動保存し、リロード後も続きから遊べるようにする。 */
export function useGameProgress() {
  const [progress, setProgress] = useState(load);

  useEffect(() => {
    writeJson(STORAGE_KEY, progress);
  }, [progress]);

  const addScore = useCallback((questionId, skill, amount) => {
    setProgress((p) => {
      if (p.scored.includes(questionId)) return p;
      return {
        ...p,
        xp: p.xp + amount,
        scored: [...p.scored, questionId],
        skills: { ...p.skills, [skill]: Math.min(MAX_SKILL_RANK, (p.skills[skill] ?? 0) + 1) },
      };
    });
  }, []);

  const completeChapter = useCallback((chapterId) => {
    setProgress((p) =>
      p.completed.includes(chapterId) ? p : { ...p, completed: [...p.completed, chapterId] },
    );
  }, []);

  const recordAnswer = useCallback((questionId, correct) => {
    setProgress((p) => {
      const hasMistake = p.mistakes.includes(questionId);
      const previous = p.answerStats[questionId] ?? { attempts: 0, correctCount: 0, lastCorrect: false };
      const mistakes = correct
        ? hasMistake
          ? p.mistakes.filter((id) => id !== questionId)
          : p.mistakes
        : hasMistake
          ? p.mistakes
          : [...p.mistakes, questionId];
      return {
        ...p,
        mistakes,
        answerStats: {
          ...p.answerStats,
          [questionId]: {
            attempts: previous.attempts + 1,
            correctCount: previous.correctCount + (correct ? 1 : 0),
            lastCorrect: correct,
          },
        },
      };
    });
  }, []);

  const markIntroSeen = useCallback(() => {
    setProgress((p) => (p.introSeen ? p : { ...p, introSeen: true }));
  }, []);

  const reset = useCallback(() => {
    removeKey(STORAGE_KEY);
    setProgress({ ...emptyProgress(), introSeen: true });
  }, []);

  const hasSave = useMemo(
    () => progress.xp > 0 || progress.completed.length > 0 || progress.mistakes.length > 0,
    [progress.xp, progress.completed.length, progress.mistakes.length],
  );

  return { progress, addScore, recordAnswer, completeChapter, markIntroSeen, reset, hasSave };
}
