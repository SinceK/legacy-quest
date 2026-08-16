// src/assets/opening/ に kingdom.jpg / world.jpg / cracks.jpg / crisis.jpg / journey.jpg
// のようにファイルを置くと、該当シーンのイラストが自動的にSVGから差し替わる。
// ファイルが無いシーンは今まで通りSVGで描画される（フォールバック）。
const modules = import.meta.glob("../assets/opening/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
});

/** シーンキー（kingdom/world/cracks/crisis/journey）→画像URLのマップ。 */
export const OPENING_IMAGES = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => {
    const key = path.split("/").pop().replace(/\.[^.]+$/, "");
    return [key, url];
  }),
);
