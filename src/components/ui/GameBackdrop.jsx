import { GAME_IMAGES } from "../../content/gameImages.js";

export default function GameBackdrop({ scene = "map", accent = "#10b981" }) {
  const src = GAME_IMAGES[scene] ?? GAME_IMAGES.map;
  return (
    <div key={scene} className="game-backdrop" aria-hidden="true">
      {src && <img src={src} alt="" decoding="async" />}
      <div className="game-backdrop__veil" />
      <div className="game-backdrop__aurora" style={{ "--scene-accent": accent }} />
      <div className="game-backdrop__runes">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} style={{ "--i": i }}>◆</span>
        ))}
      </div>
    </div>
  );
}
