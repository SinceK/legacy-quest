import Emblem from "../ui/Emblem.jsx";
import NightSky from "../ui/NightSky.jsx";
import Embers from "../ui/Embers.jsx";

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
      <NightSky intensity={0.5} moon={false} />
      <Embers count={14} intensity={0.6} />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <div style={{ animation: "fadeUp 1.2s ease-out both" }}>
          <Emblem size={72} />
        </div>
        <div
          className="font-bold text-emerald-300/80 mt-5"
          style={{ fontSize: 11, letterSpacing: "0.42em", paddingLeft: "0.42em", animation: "fadeUp 1.2s ease-out .3s both" }}
        >
          LEGACY QUEST
        </div>
        <p className="text-slate-400 text-sm mt-8 leading-relaxed" style={{ animation: "fadeUp 1.2s ease-out .6s both" }}>
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
    </button>
  );
}
