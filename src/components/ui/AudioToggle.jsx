import { useAudio } from "../../audio/AudioProvider.jsx";

function Chip({ active, label, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={
        "backdrop-blur-md px-2 py-1 rounded-full border text-[11px] font-mono transition-colors " +
        (active
          ? "border-emerald-500 bg-emerald-950 text-emerald-300"
          : "border-slate-700 bg-slate-900 text-slate-500")
      }
    >
      {label}
    </button>
  );
}

/** BGM / 効果音のオンオフ。設定はlocalStorageに保存される。 */
export default function AudioToggle({ className = "" }) {
  const { bgmEnabled, sfxEnabled, toggleBgm, toggleSfx, playSfx } = useAudio();
  return (
    <div className={"flex gap-1.5 " + className}>
      <Chip
        active={bgmEnabled}
        label={`♪ BGM ${bgmEnabled ? "ON" : "OFF"}`}
        title="BGMの再生を切り替える"
        onClick={toggleBgm}
      />
      <Chip
        active={sfxEnabled}
        label={`🔔 SE ${sfxEnabled ? "ON" : "OFF"}`}
        title="効果音の再生を切り替える"
        onClick={() => {
          toggleSfx();
          if (!sfxEnabled) setTimeout(() => playSfx("select"), 30);
        }}
      />
    </div>
  );
}
