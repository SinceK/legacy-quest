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
  };
}

/** 問題プールから指定数を選び、選択肢もセッションごとに並べ替える。 */
export function createQuestionSession(questions, limit = 5) {
  return shuffle(questions)
    .slice(0, Math.min(limit, questions.length))
    .map((item) => shuffleQuestionOptions(item.v));
}

export function nextChapterIndex(chapters, completed) {
  return chapters.findIndex((c) => !completed.includes(c.id));
}
