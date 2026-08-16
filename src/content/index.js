import chapters from "../data/chapters.json";
import skills from "../data/skills.json";
import story from "../data/story.json";
import ui from "../data/ui.json";

export const CHAPTERS = chapters;
export const SKILLS = skills;
export const STORY = story;
export const RAIN_WORDS = ui.rainWords;
export const SAGE_LINES = ui.sage;

export const EMPTY_SKILLS = Object.fromEntries(Object.keys(skills).map((k) => [k, 0]));

export const getChapter = (id) => chapters.find((c) => c.id === id) ?? null;

/** 開発時にコンテンツJSONの取りこぼしへ早めに気づくための軽い整合性チェック。 */
if (import.meta.env.DEV) {
  const ids = new Set();
  const difficulties = new Set(["beginner", "intermediate", "advanced", "practical"]);
  for (const c of chapters) {
    if (!skills[c.skill]) console.warn(`[content] 未知のskill: ${c.skill} (${c.id})`);
    for (const q of c.questions) {
      if (ids.has(q.id)) console.warn(`[content] 問題IDが重複: ${q.id}`);
      ids.add(q.id);
      if (!q.topic) console.warn(`[content] topicが未設定: ${q.id}`);
      if (!difficulties.has(q.difficulty)) console.warn(`[content] difficultyが不正: ${q.id}`);
      if ((q.type === "choice" || q.type === "fill") && q.options?.[q.answer] === undefined) {
        console.warn(`[content] answerが選択肢の範囲外: ${q.id}`);
      }
    }
  }
}
