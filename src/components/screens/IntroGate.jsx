import Emblem from "../ui/Emblem.jsx";
import Embers from "../ui/Embers.jsx";
import FilmGrain from "../ui/FilmGrain.jsx";
import { OPENING_IMAGES } from "../../content/openingImages.js";

/**
 * ブラウザの自動再生制限により、最初のユーザー操作までは音を鳴らせない。
 * オープニングを無音で流してしまわないよう、開幕の一拍として開始ゲートを置く。
 */
export default function IntroGate({ onStart }) {
  return (
    <button
      onClick={onStart}
      className="absolute inset-0 w-full overflow-hidden cursor-pointer"
      style={{ background: "#02040a" }}
    >
      {OPENING_IMAGES.kingdom && (
        <img
          src={OPENING_IMAGES.kingdom}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scale(1.035)", filter: "brightness(.42) saturate(.8)" }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 42%, transparent 8%, rgba(2,4,10,.45) 55%, #02040a 100%)" }}
      />
      <Embers count={7} intensity={0.45} />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <div style={{ animation: "fadeUp 1.2s ease-out both" }}>
          <Emblem size={66} />
        </div>
        <div
          className="font-bold text-emerald-300/80 mt-5"
          style={{ fontSize: 11, letterSpacing: "0.42em", paddingLeft: "0.42em", animation: "fadeUp 1.2s ease-out .3s both" }}
        >
          LEGACY QUEST
        </div>
        <p className="text-slate-300 text-sm mt-8 leading-relaxed" style={{ animation: "fadeUp 1.2s ease-out .6s both" }}>
          この物語には音楽があります。
          <br />
          音量を確認してからおすすみください。
        </p>
        <span
          className="mt-9 px-8 py-3 rounded-xl border border-amber-400/70 text-amber-300 font-bold"
          style={{ animation: "fadeUp 1.2s ease-out .9s both, ctaPulse 2.2s ease-in-out 1.6s infinite" }}
        >
          ▶ 画面をタップしてはじめる
        </span>
        <p className="text-slate-600 text-xs mt-6 font-mono" style={{ animation: "fadeUp 1.2s ease-out 1.2s both" }}>
          音はあとから消せます
        </p>
      </div>
      <FilmGrain opacity={0.045} />
    </button>
  );
}
