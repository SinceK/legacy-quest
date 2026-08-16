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

/** すべての章は最初から選択可能。引数は呼び出し側との互換性のため受け取る。 */
export function isUnlocked() {
  return true;
}

export function nextChapterIndex(chapters, completed) {
  return chapters.findIndex((c) => !completed.includes(c.id));
}
