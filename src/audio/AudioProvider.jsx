import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AudioEngine } from "./AudioEngine.js";
import bgmData from "../data/bgm.json";
import sfxData from "../data/sfx.json";
import { readJson, writeJson } from "../lib/storage.js";

const STORAGE_KEY = "legacy-quest:audio";
const DEFAULTS = { bgmEnabled: true, sfxEnabled: true, volume: 0.7 };

const AudioSettingsContext = createContext(null);

export function AudioProvider({ children }) {
  const engineRef = useRef(null);
  if (!engineRef.current) engineRef.current = new AudioEngine({ bgm: bgmData, sfx: sfxData });

  const [settings, setSettings] = useState(() => ({ ...DEFAULTS, ...readJson(STORAGE_KEY, {}) }));
  const [unlocked, setUnlocked] = useState(false);
  const [track, setTrack] = useState(null);

  // 設定はlocalStorageへ保存し、エンジンにも反映する
  useEffect(() => {
    writeJson(STORAGE_KEY, settings);
    engineRef.current.updateSettings(settings);
  }, [settings]);

  // ブラウザの自動再生制限のため、最初のユーザー操作までAudioContextを起こせない
  useEffect(() => {
    const engine = engineRef.current;
    const onGesture = () => {
      if (engine.unlock()) setUnlocked(true);
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, []);

  useEffect(() => {
    if (unlocked) engineRef.current.playBgm(track);
  }, [track, unlocked]);

  useEffect(() => () => engineRef.current?.dispose(), []);

  const playSfx = useCallback((name) => engineRef.current.playSfx(name), []);
  const playBgm = useCallback((id) => setTrack(id), []);
  const toggleBgm = useCallback(() => setSettings((s) => ({ ...s, bgmEnabled: !s.bgmEnabled })), []);
  const toggleSfx = useCallback(() => setSettings((s) => ({ ...s, sfxEnabled: !s.sfxEnabled })), []);
  const setVolume = useCallback((volume) => setSettings((s) => ({ ...s, volume })), []);

  const value = useMemo(
    () => ({ ...settings, unlocked, track, playSfx, playBgm, toggleBgm, toggleSfx, setVolume }),
    [settings, unlocked, track, playSfx, playBgm, toggleBgm, toggleSfx, setVolume],
  );

  return <AudioSettingsContext.Provider value={value}>{children}</AudioSettingsContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioSettingsContext);
  if (!ctx) throw new Error("useAudio は AudioProvider の内側で使ってください");
  return ctx;
}

/** 画面に応じたBGMを鳴らす。screenが変わると自動で曲が切り替わる。 */
export function useBgm(trackId) {
  const { playBgm } = useAudio();
  useEffect(() => {
    playBgm(trackId);
  }, [trackId, playBgm]);
}
