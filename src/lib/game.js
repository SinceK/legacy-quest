import ui from "../data/ui.json";

export const XP_PER_LEVEL = ui.xpPerLevel;
export const MAX_SKILL_RANK = ui.maxSkillRank;

export const levelOf = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;

export const DIFFICULTY_LABELS = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
  practical: "実践",
};

/** 元の並び順(orig index)を保ったままシャッフルする。 */
export function shuffle(arr) {
  const a = arr.map((v, i) => ({ v, i }));
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
}

/** 正解位置を保ったまま、選択式問題の選択肢を並べ替える。 */
export function shuffleQuestionOptions(question) {
  if (!question.options || !["choice", "fill"].includes(question.type)) return question;
  const options = shuffle(question.options);
  return {
    ...question,
    options: options.map((item) => item.v),
    answer: options.findIndex((item) => item.i === question.answer),
    wrongReasons: question.wrongReasons
      ? options.map((item) => question.wrongReasons[item.i])
      : undefined,
  };
}

/** 問題プールから指定数を選び、選択肢もセッションごとに並べ替える。 */
export function createQuestionSession(questions, limit = 5) {
  return shuffle(questions)
    .slice(0, Math.min(limit, questions.length))
    .map((item) => shuffleQuestionOptions(item.v));
}

/** 問題単位の回答履歴を、トピック別の理解度・回答範囲・正答率へ集計する。 */
export function buildTopicStats(chapters, answerStats = {}) {
  const topics = new Map();
  for (const chapter of chapters) {
    for (const question of chapter.questions) {
      const current = topics.get(question.topic) ?? {
        topic: question.topic,
        total: 0,
        answered: 0,
        mastered: 0,
        attempts: 0,
        correctCount: 0,
      };
      const history = answerStats[question.id];
      current.total += 1;
      if (history?.attempts > 0) {
        current.answered += 1;
        current.attempts += history.attempts;
        current.correctCount += history.correctCount;
        if (history.lastCorrect) current.mastered += 1;
      }
      topics.set(question.topic, current);
    }
  }
  return [...topics.values()].map((topic) => ({
    ...topic,
    mastery: topic.total ? Math.round((topic.mastered / topic.total) * 100) : 0,
    accuracy: topic.attempts ? Math.round((topic.correctCount / topic.attempts) * 100) : 0,
  }));
}

export function nextChapterIndex(chapters, completed) {
  return chapters.findIndex((c) => !completed.includes(c.id));
}
