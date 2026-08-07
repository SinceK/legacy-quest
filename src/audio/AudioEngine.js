import { noteToFreq } from "./notes.js";

const LOOKAHEAD_MS = 250;
const SILENCE = 0.0001;

/**
 * JSONで定義された曲データ(bgm.json)と効果音データ(sfx.json)を
 * Web Audio API でリアルタイム合成するチップチューン音源。
 * 音声ファイルを一切持たないので、リポジトリにバイナリが増えない。
 */
export class AudioEngine {
  constructor({ bgm = {}, sfx = {} } = {}) {
    this.bgmData = bgm;
    this.sfxData = sfx;
    this.ctx = null;
    this.nodes = null;
    this.compiled = new Map();
    this.currentTrackId = null;
    this.timer = null;
    this.nextLoopAt = 0;
    this.noiseBuffer = null;
    this.settings = { bgmEnabled: true, sfxEnabled: true, volume: 0.7 };
  }

  /* ---------------- 初期化 ---------------- */

  /** ブラウザの自動再生制限があるため、最初のユーザー操作で呼ぶ。 */
  unlock() {
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return false;
      this.ctx = new Ctor();
      const master = this.ctx.createGain();
      const bgmGain = this.ctx.createGain();
      const sfxGain = this.ctx.createGain();
      bgmGain.connect(master);
      sfxGain.connect(master);
      master.connect(this.ctx.destination);
      this.nodes = { master, bgm: bgmGain, sfx: sfxGain };
      this.applySettings();
    }
    if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
    return true;
  }

  get isReady() {
    return Boolean(this.ctx && this.nodes);
  }

  applySettings() {
    if (!this.nodes) return;
    const { volume, bgmEnabled, sfxEnabled } = this.settings;
    this.nodes.master.gain.value = volume;
    this.nodes.bgm.gain.value = bgmEnabled ? 1 : 0;
    this.nodes.sfx.gain.value = sfxEnabled ? 1 : 0;
  }

  updateSettings(patch) {
    const prev = this.settings;
    this.settings = { ...prev, ...patch };
    this.applySettings();
    // BGMを切ったらスケジューラも止めてCPUを使わないようにする
    if (prev.bgmEnabled && !this.settings.bgmEnabled) {
      this.stopScheduler();
    } else if (!prev.bgmEnabled && this.settings.bgmEnabled && this.currentTrackId) {
      const id = this.currentTrackId;
      this.currentTrackId = null;
      this.playBgm(id);
    }
  }

  /* ---------------- 曲データのコンパイル ---------------- */

  compile(trackId) {
    if (this.compiled.has(trackId)) return this.compiled.get(trackId);
    const track = this.bgmData[trackId];
    if (!track) return null;

    const spb = 60 / track.bpm;
    const events = [];
    const push = (beat, event) => events.push({ ...event, at: beat * spb });

    for (const ch of track.channels ?? []) {
      const chGain = ch.gain ?? 0.1;
      if (ch.type === "tone") {
        for (const [pitch, start, dur, mul] of ch.notes ?? []) {
          push(start, {
            kind: "tone",
            wave: ch.wave ?? "square",
            freq: noteToFreq(pitch),
            dur: dur * spb,
            gain: chGain * (mul ?? 1),
          });
        }
      } else if (ch.type === "arp") {
        const rate = ch.rate ?? 0.5;
        for (const chord of ch.chords ?? []) {
          const steps = Math.round(chord.beats / rate);
          for (let i = 0; i < steps; i++) {
            push(chord.start + i * rate, {
              kind: "tone",
              wave: ch.wave ?? "square",
              freq: noteToFreq(chord.notes[i % chord.notes.length]),
              dur: rate * spb * 0.92,
              gain: chGain,
            });
          }
        }
      } else if (ch.type === "kit") {
        for (const entry of ch.pattern ?? []) {
          const beats = entry.every
            ? Array.from({ length: Math.round(track.loopBeats / entry.every) }, (_, i) => i * entry.every)
            : (entry.at ?? []);
          for (const beat of beats) {
            push(beat, { kind: "drum", drum: entry.drum, gain: chGain * (entry.gain ?? 1) });
          }
        }
      }
    }

    const result = { events, duration: track.loopBeats * spb, gain: track.gain ?? 1 };
    this.compiled.set(trackId, result);
    return result;
  }

  /* ---------------- BGM ---------------- */

  playBgm(trackId) {
    if (trackId === this.currentTrackId) return;
    this.currentTrackId = trackId;
    this.stopScheduler();
    if (!trackId || !this.isReady || !this.settings.bgmEnabled) return;
    if (!this.compile(trackId)) return;
    this.nextLoopAt = this.ctx.currentTime + 0.08;
    this.tick();
    this.timer = setInterval(() => this.tick(), LOOKAHEAD_MS);
  }

  stopBgm() {
    this.currentTrackId = null;
    this.stopScheduler();
  }

  stopScheduler() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  tick() {
    const track = this.compile(this.currentTrackId);
    if (!track || !this.ctx) return;
    // ループ1周分をまとめて先行スケジュールする
    while (this.nextLoopAt < this.ctx.currentTime + track.duration) {
      const origin = this.nextLoopAt;
      for (const ev of track.events) {
        const when = origin + ev.at;
        if (when < this.ctx.currentTime - 0.05) continue;
        if (ev.kind === "tone") {
          this.scheduleTone(this.nodes.bgm, {
            when,
            wave: ev.wave,
            freq: ev.freq,
            dur: ev.dur,
            gain: ev.gain * track.gain,
          });
        } else {
          this.scheduleDrum(this.nodes.bgm, ev.drum, when, ev.gain * track.gain);
        }
      }
      this.nextLoopAt += track.duration;
    }
  }

  /* ---------------- 効果音 ---------------- */

  playSfx(name) {
    if (!this.isReady || !this.settings.sfxEnabled) return;
    const spec = this.sfxData[name];
    if (!spec) return;
    const base = spec.gain ?? 0.2;
    const now = this.ctx.currentTime + 0.01;

    for (const tone of spec.tones ?? []) {
      const when = now + (tone.start ?? 0);
      const gain = base * (tone.gain ?? 1);
      if (tone.noise) {
        this.scheduleNoise(this.nodes.sfx, {
          when,
          dur: tone.dur ?? 0.2,
          gain,
          filter: tone.filter ?? "lowpass",
          from: tone.from ?? 4000,
          to: tone.to ?? 400,
        });
      } else {
        const freq = tone.freq ?? noteToFreq(tone.note ?? "A4");
        const target = tone.toFreq ?? (tone.toNote ? noteToFreq(tone.toNote) : null);
        this.scheduleTone(this.nodes.sfx, {
          when,
          wave: tone.wave ?? "square",
          freq,
          toFreq: target,
          dur: tone.dur ?? 0.15,
          gain,
        });
      }
    }
  }

  /* ---------------- 基本ボイス ---------------- */

  scheduleTone(dest, { when, wave, freq, toFreq, dur, gain }) {
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, when);
    if (toFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(toFreq, 20), when + dur);

    const peak = Math.max(gain, SILENCE * 2);
    amp.gain.setValueAtTime(SILENCE, when);
    amp.gain.exponentialRampToValueAtTime(peak, when + Math.min(0.012, dur * 0.25));
    amp.gain.exponentialRampToValueAtTime(peak * 0.55, when + dur * 0.6);
    amp.gain.exponentialRampToValueAtTime(SILENCE, when + dur);

    osc.connect(amp);
    amp.connect(dest);
    osc.start(when);
    osc.stop(when + dur + 0.03);
    osc.onended = () => amp.disconnect();
  }

  getNoiseBuffer() {
    if (!this.noiseBuffer) {
      const len = Math.floor(this.ctx.sampleRate * 1.5);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buf;
    }
    return this.noiseBuffer;
  }

  scheduleNoise(dest, { when, dur, gain, filter, from, to }) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer();
    const biquad = this.ctx.createBiquadFilter();
    biquad.type = filter;
    biquad.frequency.setValueAtTime(Math.max(from, 20), when);
    biquad.frequency.exponentialRampToValueAtTime(Math.max(to, 20), when + dur);
    if (filter === "bandpass") biquad.Q.value = 1.2;

    const amp = this.ctx.createGain();
    const peak = Math.max(gain, SILENCE * 2);
    amp.gain.setValueAtTime(peak, when);
    amp.gain.exponentialRampToValueAtTime(SILENCE, when + dur);

    src.connect(biquad);
    biquad.connect(amp);
    amp.connect(dest);
    src.start(when);
    src.stop(when + dur + 0.02);
    src.onended = () => amp.disconnect();
  }

  scheduleDrum(dest, drum, when, gain) {
    if (drum === "kick") {
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, when);
      osc.frequency.exponentialRampToValueAtTime(45, when + 0.11);
      amp.gain.setValueAtTime(Math.max(gain * 1.6, SILENCE * 2), when);
      amp.gain.exponentialRampToValueAtTime(SILENCE, when + 0.18);
      osc.connect(amp);
      amp.connect(dest);
      osc.start(when);
      osc.stop(when + 0.2);
      osc.onended = () => amp.disconnect();
    } else if (drum === "snare") {
      this.scheduleNoise(dest, {
        when,
        dur: 0.13,
        gain: gain * 0.9,
        filter: "bandpass",
        from: 2200,
        to: 1200,
      });
    } else {
      this.scheduleNoise(dest, {
        when,
        dur: 0.035,
        gain: gain * 0.35,
        filter: "highpass",
        from: 7000,
        to: 9000,
      });
    }
  }

  dispose() {
    this.stopScheduler();
    if (this.ctx) this.ctx.close().catch(() => {});
    this.ctx = null;
    this.nodes = null;
  }
}
