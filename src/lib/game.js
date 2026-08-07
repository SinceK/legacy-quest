import ui from "../data/ui.json";

export const XP_PER_LEVEL = ui.xpPerLevel;
export const MAX_SKILL_RANK = ui.maxSkillRank;

export const levelOf = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;

/** 元の並び順(orig index)を保ったままシャッフルする。 */
export function shuffle(arr) {
  const a = arr.map((v, i) => ({ v, i }));
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
}

/** 直前の章をクリアしていれば解放。第1章は常に解放。 */
export function isUnlocked(chapters, index, completed) {
  return index === 0 || completed.includes(chapters[index - 1].id);
}

export function nextChapterIndex(chapters, completed) {
  return chapters.findIndex((c, i) => !completed.includes(c.id) && isUnlocked(chapters, i, completed));
}
