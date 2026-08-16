const SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const NOTE_PATTERN = /^([A-G])([#b]?)(-?\d+)$/;

/** "A4" や "C#3" のような音名を周波数(Hz)へ変換する。 */
export function noteToFreq(name) {
  const m = NOTE_PATTERN.exec(String(name));
  if (!m) return 440;
  const [, letter, accidental, octave] = m;
  const offset = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
  const midi = (Number(octave) + 1) * 12 + SEMITONES[letter] + offset;
  return 440 * 2 ** ((midi - 69) / 12);
}
