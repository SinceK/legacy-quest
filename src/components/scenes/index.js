import SceneKingdom from "./SceneKingdom.jsx";
import SceneWorld from "./SceneWorld.jsx";
import SceneCracks from "./SceneCracks.jsx";
import SceneCrisis from "./SceneCrisis.jsx";
import SceneJourney from "./SceneJourney.jsx";

/** story.json の "scene" キーと描画コンポーネントの対応表。 */
export const SCENES = {
  kingdom: SceneKingdom,
  world: SceneWorld,
  cracks: SceneCracks,
  crisis: SceneCrisis,
  journey: SceneJourney,
};
