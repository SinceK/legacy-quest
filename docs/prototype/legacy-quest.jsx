import React, { useState, useMemo, useEffect } from "react";

/*
  LEGACY QUEST 〜COBOLからJavaへ〜  (MVP v6)
  - 映画的オープニング(手描きSVGシーン) → 英語ロゴのタイトル
  - マップ画面はコードレイン背景
  - チャプター開始で長めのダイブ演出(章表示→ポータル→出現→たたかう) → バトル
  - 進捗はメモリ内(useState)保持。実装版はlocalStorage想定。
*/

const SKILLS = {
  syntax: { label: "構文力", emoji: "📘" },
  design: { label: "設計力", emoji: "🧩" },
  process: { label: "プロセス力", emoji: "🗺️" },
  practice: { label: "実務力", emoji: "🛡️" },
};

const CHAPTERS = [
  {
    id: "ch1", no: "第1章", title: "ことばを覚える", dungeon: "ことばの塔", emoji: "📜", skill: "syntax",
    monster: { name: "コーボル・ゴブリン", body: "#34d399", accent: "#065f46", eyes: 2, horns: false, mood: "calm" },
    intro: "ようこそ移行チームへ！ まずは古の言葉『COBOL』を読み解くのじゃ。MOVEは…代入の呪文じゃぞ。",
    cobol: `01 WS-NAME   PIC X(10).
01 WS-COUNT  PIC 9(3).

MOVE 'HELLO' TO WS-NAME.
MOVE 100     TO WS-COUNT.`,
    questions: [
      { id: "ch1-q1", type: "fill", prompt: "MOVE 'HELLO' TO WS-NAME. をJavaにすると？", javaTemplate: "String wsName = ⬚;", options: ['"HELLO"', "'HELLO'", "HELLO", "new String(HELLO)"], answer: 0, explanation: "MOVEは代入。Javaは = を使い、文字列は必ずダブルクォート \" \" で囲む。", xp: 10 },
      { id: "ch1-q2", type: "choice", prompt: "WS-COUNT PIC 9(3) に最も合うJavaの型は？", options: ["int", "String", "double", "boolean"], answer: 0, explanation: "PIC 9(n) は数字だけの項目なので整数型(int等)。PIC X(n) は文字なのでString。", xp: 10 },
      { id: "ch1-q3", type: "matching", prompt: "PIC句とJavaの型を対応づけよ", pairs: [{ left: "PIC X(10)", right: "String" }, { left: "PIC 9(3)", right: "int" }, { left: "PIC S9(7)V99 COMP-3", right: "BigDecimal" }], explanation: "文字はString、整数はint、金額などのCOMP-3はBigDecimal(第4章で詳しく)。", xp: 15 },
    ],
  },
  {
    id: "ch2", no: "第2章", title: "構造を読み解く", dungeon: "歯車の工房", emoji: "⚙️", skill: "design",
    monster: { name: "ハグルマ・ゴーレム", body: "#94a3b8", accent: "#334155", eyes: 1, horns: false, mood: "calm", square: true },
    intro: "バッチの巻物を Spring Batch の三つの部品に分けるのじゃ。読み・加工・書き出し、じゃな。",
    cobol: `PERFORM UNTIL WS-EOF = 'Y'
    READ IN-FILE
      AT END     MOVE 'Y' TO WS-EOF
      NOT AT END PERFORM CALC-TAX
                 WRITE OUT-REC
    END-READ
END-PERFORM.`,
    questions: [
      { id: "ch2-q1", type: "matching", prompt: "バッチの役割を Spring Batch の部品に対応づけよ", pairs: [{ left: "入力を1件読む", right: "ItemReader" }, { left: "1件を加工(税計算)", right: "ItemProcessor" }, { left: "結果を書き出す", right: "ItemWriter" }, { left: "COMMITの単位", right: "chunkサイズ" }], explanation: "Spring Batchはchunk指向。read→process→(chunk分まとめて)writeの流れ。", xp: 15 },
      { id: "ch2-q2", type: "choice", prompt: "CALC-TAX(1件ごとに税を計算して書き換える処理)を置く場所は？", options: ["ItemProcessor", "ItemReader", "ItemWriter", "JobLauncher"], answer: 0, explanation: "入力を受け取り加工して次へ渡す処理はProcessorの役割。", xp: 10 },
      { id: "ch2-q3", type: "ordering", prompt: "chunk指向処理の流れを正しい順に並べよ", items: ["Readerで1件読む", "Processorで加工する", "chunk分たまったらWriterでまとめ書き", "トランザクションを確定(commit)"], explanation: "read→processをchunk分くり返し、まとめてwriteしてcommitするのが基本サイクル。", xp: 15 },
    ],
  },
  {
    id: "ch3", no: "第3章", title: "計画を立てる", dungeon: "設計図の間", emoji: "🗺️", skill: "process",
    monster: { name: "セッケイ・スフィンクス", body: "#a78bfa", accent: "#5b21b6", eyes: 2, horns: false, mood: "think" },
    intro: "あわてて全部を一度に作り替えると事故るぞ。正しい手順で進めるのじゃ。",
    cobol: `* 巨大なCOBOL基幹システムをJavaへ移行する。
* さて…何から手をつける？`,
    questions: [
      { id: "ch3-q1", type: "ordering", prompt: "移行の工程を正しい順に並べよ", items: ["現状分析(資産の棚卸し)", "移行方針の決定", "変換(Javaへ実装)", "テスト(旧と結果を突合)", "本番切替"], explanation: "まず今あるものを知り、方針を決めてから変換・テスト・切替へ進む。", xp: 15 },
      { id: "ch3-q2", type: "choice", prompt: "資産の量や依存関係を把握するのはどの工程？", options: ["現状分析(棚卸し)", "テスト", "本番切替", "変換"], answer: 0, explanation: "規模と依存を把握しないと方針も見積もりも立たない、移行の土台。", xp: 10 },
      { id: "ch3-q3", type: "choice", prompt: "大規模システムでリスクを抑える進め方は？", options: ["一部ずつ移行し、都度検証しながら進める", "全部を一度に作り替えて一斉切替する", "テストは本番切替の後にまとめて行う", "ドキュメントは作らず記憶で進める"], answer: 0, explanation: "ビッグバン移行はリスクが高い。段階的移行＋検証が安全。", xp: 15 },
    ],
  },
  {
    id: "ch4", no: "第4章", title: "現場の罠", dungeon: "落とし穴の洞窟", emoji: "💀", skill: "practice",
    monster: { name: "ゴサ・デーモン", body: "#fb7185", accent: "#9f1239", eyes: 3, horns: true, mood: "angry" },
    intro: "ここが最難関の洞窟…金額の計算に『誤差の魔物』が潜んでおる。油断するでないぞ！",
    cobol: `01 WS-AMOUNT  PIC S9(7)V99 COMP-3.

COMPUTE WS-AMOUNT = WS-PRICE * WS-QTY.`,
    questions: [
      { id: "ch4-q1", type: "choice", prompt: "COMP-3の金額(S9(7)V99)をJavaで正確に扱う型は？", options: ["BigDecimal", "double", "float", "int"], answer: 0, explanation: "COMP-3は10進を正確に保持する。金額はBigDecimalで扱う。", xp: 10 },
      { id: "ch4-q2", type: "choice", prompt: "金額計算に double を使うと何が問題？", options: ["2進浮動小数点は10進小数を正確に表せず誤差が出る", "計算が遅いだけで結果は正確", "負の数を扱えない", "桁数上限がなく無限にメモリを使う"], answer: 0, explanation: "0.1+0.2 が 0.3 にならないように、doubleは10進小数を正確に表せない。金額では致命的。", xp: 15 },
      { id: "ch4-q3", type: "choice", prompt: "金額 123.45 を誤差なく生成するのは？(罠に注意！)", options: ['new BigDecimal("123.45")', "new BigDecimal(123.45)", "(BigDecimal) 123.45", "new BigDecimal(123.45f)"], answer: 0, explanation: "落とし穴: double引数のコンストラクタはその時点で誤差を持ち込む。文字列で渡すのが正解(BigDecimal.valueOfも可)。", xp: 20 },
    ],
  },
];

const XP_PER_LEVEL = 40;
const levelOf = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;
function shuffle(arr) {
  const a = arr.map((v, i) => ({ v, i }));
  for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
  return a;
}
const BURST_DIRS = [[50, -36], [-50, -36], [64, 8], [-64, 8], [26, -64], [-26, -64], [70, -14], [-70, -14], [16, 44], [-16, 44], [44, 40], [-44, 40]];
const RAIN_WORDS = ["MOVE", "PERFORM", "PIC", "COMP-3", "JCL", "ItemReader", "@Bean", "BigDecimal", "WRITE", "READ", "chunk", "EVALUATE", "Spring", "01 WS", "COBOL", "Java"];

const panelStyle = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  background: "linear-gradient(180deg,#04160f,#020b08)",
  color: "#5eead4",
  boxShadow: "inset 0 0 34px rgba(16,185,129,0.18), 0 0 0 1px rgba(16,185,129,0.35)",
  textShadow: "0 0 6px rgba(94,234,212,0.45)",
};
const scanlines = { backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.20) 0px, rgba(0,0,0,0.20) 1px, transparent 1px, transparent 3px)" };

const GameStyles = () => (
  <style>{`
    @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    @keyframes sway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
    @keyframes shakeX { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(7px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
    @keyframes screenShake { 0%,100%{transform:translate(0,0)} 12%{transform:translate(-9px,5px)} 26%{transform:translate(10px,-5px)} 40%{transform:translate(-8px,-3px)} 56%{transform:translate(8px,3px)} 72%{transform:translate(-5px,2px)} 88%{transform:translate(4px,-1px)} }
    @keyframes bigShake { 0%,100%{transform:translate(0,0)} 8%{transform:translate(-15px,8px)} 22%{transform:translate(16px,-8px)} 38%{transform:translate(-14px,-6px)} 54%{transform:translate(14px,6px)} 70%{transform:translate(-9px,4px)} 86%{transform:translate(6px,-3px)} }
    @keyframes punch { 0%{transform:scale(1)} 35%{transform:scale(1.07)} 100%{transform:scale(1)} }
    @keyframes knockback { 0%{transform:translateX(0) rotate(0)} 16%{transform:translateX(20px) rotate(8deg)} 100%{transform:translateX(0) rotate(0)} }
    @keyframes hardFlash { 0%{filter:brightness(1)} 10%{filter:brightness(3.8) saturate(0)} 45%{filter:brightness(1.5)} 100%{filter:brightness(1)} }
    @keyframes popIn { 0%{transform:scale(.8);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
    @keyframes riseFade { 0%{transform:translateY(6px);opacity:0} 15%{opacity:1} 100%{transform:translateY(-42px);opacity:0} }
    @keyframes dmgFly { 0%{transform:translate(-50%,0) scale(.5);opacity:0} 18%{transform:translate(-50%,-14px) scale(1.4);opacity:1} 100%{transform:translate(-50%,-64px) scale(1);opacity:0} }
    @keyframes ring { 0%{transform:translate(-50%,-50%) scale(.3);opacity:.9} 100%{transform:translate(-50%,-50%) scale(2.2);opacity:0} }
    @keyframes shock { 0%{transform:translate(-50%,-50%) scale(.2);opacity:.9} 100%{transform:translate(-50%,-50%) scale(3);opacity:0} }
    @keyframes burst { 0%{opacity:1;transform:translate(-50%,-50%)} 100%{opacity:0;transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(.25)} }
    @keyframes slash { 0%{transform:translateX(-150%) rotate(-32deg);opacity:0} 30%{opacity:1} 70%{opacity:1} 100%{transform:translateX(150%) rotate(-32deg);opacity:0} }
    @keyframes critFlash { 0%{opacity:0} 8%{opacity:.65} 100%{opacity:0} }
    @keyframes redPulse { 0%{opacity:0} 14%{opacity:.6} 100%{opacity:0} }
    @keyframes whiteFlash { 0%{opacity:0} 10%{opacity:.9} 100%{opacity:0} }
    @keyframes koFall { 0%{transform:rotate(0);opacity:1} 100%{transform:rotate(-16deg) translateY(10px);opacity:.5} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 rgba(251,191,36,0)} 50%{box-shadow:0 0 44px rgba(251,191,36,.95)} }
    @keyframes fadeUp { 0%{transform:translateY(12px);opacity:0} 100%{transform:translateY(0);opacity:1} }
    @keyframes sparkle { 0%{transform:scale(0) rotate(0);opacity:1} 100%{transform:scale(1.6) rotate(120deg);opacity:0} }
    @keyframes blink { 0%,45%{opacity:1} 50%,95%{opacity:0} 100%{opacity:1} }
    @keyframes titlePop { 0%{transform:scale(.5);opacity:0} 55%{transform:scale(1.14)} 100%{transform:scale(1);opacity:1} }
    @keyframes dropIn { 0%{transform:translateY(-34px);opacity:0} 72%{transform:translateY(5px)} 100%{transform:translateY(0);opacity:1} }
    @keyframes fall { 0%{transform:translateY(-25%)} 100%{transform:translateY(125%)} }
    @keyframes ctaPulse { 0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,0)} 50%{box-shadow:0 0 0 4px rgba(251,191,36,.4)} }
    @keyframes slamIn { 0%{transform:translateY(-60px) scale(2.4);opacity:0} 55%{transform:translateY(8px) scale(.9);opacity:1} 78%{transform:translateY(0) scale(1.06)} 100%{transform:translateY(0) scale(1)} }
    @keyframes bannerIn { 0%{transform:translateY(-18px) scale(.9);opacity:0} 60%{transform:translateY(3px) scale(1.04)} 100%{transform:translateY(0) scale(1);opacity:1} }
    @keyframes comboPop { 0%{transform:scale(.4);opacity:0} 50%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
    @keyframes bigText { 0%{transform:scale(.5);opacity:0} 55%{transform:scale(1.16)} 100%{transform:scale(1);opacity:1} }
    @keyframes twinkle { 0%,100%{opacity:.2} 50%{opacity:1} }
    @keyframes driftUp { 0%{transform:translateY(12px);opacity:0} 20%{opacity:.75} 100%{transform:translateY(-70px);opacity:0} }
    @keyframes kenburns { 0%{transform:scale(1) translate(0,0)} 100%{transform:scale(1.12) translate(-2%,-3%)} }
    @keyframes cineIn { 0%{opacity:0;transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
    @keyframes captionIn { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes orbPulse { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:.85;transform:scale(1.18)} }
    @keyframes flicker { 0%,18%,22%,55%,60%,100%{opacity:1} 20%,58%{opacity:.15} }
    @keyframes streamUp { 0%{transform:translateY(0);opacity:0} 12%{opacity:1} 100%{transform:translateY(-86px);opacity:0} }
    @keyframes crackDraw { to{ stroke-dashoffset:0 } }
    @keyframes debris { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(64px) rotate(140deg);opacity:0} }
    @keyframes alertPulse { 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.09)} }
    @keyframes boltFlash { 0%,80%,100%{opacity:0} 84%,92%{opacity:1} }
    @keyframes rumble { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-1.5px,1px)} 50%{transform:translate(1.5px,-1px)} 75%{transform:translate(-1px,1px)} }
    @keyframes hopeRise { 0%{transform:translateY(0) scale(.6);opacity:0} 25%{opacity:1} 100%{transform:translateY(-56px) scale(1);opacity:0} }
    @keyframes letterbox { 0%{transform:scaleY(2.4)} 100%{transform:scaleY(1)} }
    @keyframes spin { to{ transform:rotate(360deg) } }
    @keyframes diveZoom { 0%{transform:scale(1);opacity:1} 70%{opacity:1} 100%{transform:scale(3);opacity:0} }
    @keyframes portalIn { 0%{transform:translate(-50%,-50%) scale(0);opacity:0} 55%{opacity:1} 100%{transform:translate(-50%,-50%) scale(1);opacity:1} }
    @keyframes sweep { to{ transform:translateX(var(--w)) } }
    @keyframes shine { 0%{opacity:0} 50%{opacity:.9} 100%{opacity:0} }
    @media (prefers-reduced-motion: reduce){ *{animation:none !important; transition:none !important} }
  `}</style>
);

// ---------- コードレイン ----------
function CodeRain({ heavy = false, fast = false }) {
  const n = heavy ? 11 : 9;
  const cols = useMemo(() => Array.from({ length: n }).map((_, i) => ({
    left: `${(i * (100 / n)) + 1}%`, dur: (7 + (i % 5) * 1.6) * (fast ? 0.35 : 1), delay: -(i * 1.3),
    words: Array.from({ length: 9 }).map(() => RAIN_WORDS[Math.floor(Math.random() * RAIN_WORDS.length)]),
  })), [n, fast]);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {cols.map((c, i) => (
        <div key={i} className="absolute top-0 font-mono text-xs text-emerald-500" style={{ left: c.left, opacity: heavy ? 0.2 : 0.13, animation: `fall ${c.dur}s linear infinite`, animationDelay: `${c.delay}s`, textShadow: "0 0 6px rgba(16,185,129,0.6)" }}>
          {c.words.map((w, j) => (<div key={j} className="mb-4">{w}</div>))}
        </div>
      ))}
    </div>
  );
}

// ---------- ロゴ ----------
function Emblem({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ animation: "floatY 3.4s ease-in-out infinite" }}>
      <defs>
        <linearGradient id="crest" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f3b2e" /><stop offset="100%" stopColor="#0a1420" /></linearGradient>
      </defs>
      <path d="M32 5 L55 13 L55 31 C55 47 45 55 32 60 C19 55 9 47 9 31 L9 13 Z" fill="url(#crest)" stroke="#fbbf24" strokeWidth="2" />
      <path d="M32 10 L50 16 L50 31 C50 44 42 51 32 55 C22 51 14 44 14 31 L14 16 Z" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.6" />
      <polyline points="24,23 18,32 24,41" fill="none" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="40,23 46,32 40,41" fill="none" stroke="#fbbf24" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="32,14 35,20 32,20 29,20" fill="#e2e8f0" />
      <rect x="30.5" y="18" width="3" height="22" fill="#e2e8f0" />
      <rect x="24" y="40" width="16" height="3" rx="1.5" fill="#fbbf24" />
      <rect x="30.5" y="43" width="3" height="7" fill="#fbbf24" />
      <circle cx="32" cy="52" r="2.4" fill="#fcd34d" />
      <circle cx="32" cy="11" r="2.4" fill="#fcd34d" style={{ animation: "orbPulse 2.4s ease-in-out infinite" }} />
    </svg>
  );
}
function Logo({ scale = 1, row = false }) {
  const under = 208 * scale;
  return (
    <div className={row ? "flex items-center gap-3" : "flex flex-col items-center"}>
      <Emblem size={64 * scale} />
      <div className={row ? "" : "text-center mt-2"}>
        <div className="font-bold text-emerald-300" style={{ fontSize: 13 * scale, letterSpacing: "0.42em", paddingLeft: "0.42em", textShadow: "0 0 10px rgba(52,211,153,.4)" }}>LEGACY</div>
        <div className="font-black" style={{ fontSize: 52 * scale, lineHeight: 0.92, letterSpacing: "0.02em", backgroundImage: "linear-gradient(100deg,#6ee7b7 10%,#fbbf24 90%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 2px 14px rgba(251,191,36,.35))" }}>QUEST</div>
        <div className="relative rounded-full" style={{ width: under, height: 3, marginTop: 5 * scale, marginLeft: row ? 0 : "auto", marginRight: row ? 0 : "auto", background: "linear-gradient(90deg,#34d399,#fbbf24)" }}>
          <span className="absolute rounded-full" style={{ top: "50%", left: 0, width: 8, height: 8, marginTop: -4, background: "#fff", boxShadow: "0 0 10px #fff", ["--w"]: `${under - 8}px`, animation: "sweep 2.4s ease-in-out infinite alternate" }} />
        </div>
        <div className="font-mono text-slate-400" style={{ fontSize: 10.5 * scale, letterSpacing: "0.24em", marginTop: 7 * scale }}>COBOL → JAVA MIGRATION</div>
      </div>
    </div>
  );
}

// ================= 映画的オープニング =================
function Starfield() {
  const stars = useMemo(() => Array.from({ length: 46 }).map(() => ({ x: Math.random() * 100, y: Math.random() * 78, r: Math.random() * 1.6 + 0.4, d: Math.random() * 3, dur: 2 + Math.random() * 3 })), []);
  return (<svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">{stars.map((s, i) => (<circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e2e8f0" style={{ animation: `twinkle ${s.dur}s ease-in-out ${s.d}s infinite` }} />))}</svg>);
}
function Motes({ color = "#5eead4" }) {
  const motes = useMemo(() => Array.from({ length: 16 }).map(() => ({ left: Math.random() * 100, size: Math.random() * 5 + 2, delay: Math.random() * 6, dur: 6 + Math.random() * 5, bottom: Math.random() * 30 })), []);
  return (<div className="absolute inset-0 pointer-events-none overflow-hidden">{motes.map((m, i) => (<span key={i} className="absolute rounded-full" style={{ left: `${m.left}%`, bottom: `${m.bottom}%`, width: m.size, height: m.size, background: color, boxShadow: `0 0 8px ${color}`, animation: `driftUp ${m.dur}s linear ${m.delay}s infinite` }} />))}</div>);
}
function SceneKingdom() {
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block" }}>
      <circle cx="335" cy="46" r="20" fill="#0b2b24" opacity="0.9" /><circle cx="329" cy="42" r="20" fill="#05070e" />
      <path d="M0 205 Q110 178 210 200 T400 195 L400 240 L0 240Z" fill="#08201a" /><path d="M0 218 Q120 202 260 215 T400 214 L400 240 L0 240Z" fill="#0b2b22" />
      <g fill="#0c2a20" stroke="#0f5c43" strokeWidth="2"><rect x="66" y="150" width="34" height="72" /><rect x="300" y="150" width="34" height="72" /></g>
      <rect x="168" y="86" width="64" height="136" fill="#0d3327" stroke="#10b981" strokeWidth="2" />
      <g fill="#10b981"><rect x="168" y="80" width="12" height="10" /><rect x="186" y="80" width="12" height="10" /><rect x="208" y="80" width="12" height="10" /><rect x="220" y="80" width="12" height="10" /></g>
      <g fill="#fbbf24"><rect x="183" y="118" width="10" height="14" rx="1" style={{ animation: "flicker 4s infinite" }} /><rect x="207" y="118" width="10" height="14" rx="1" style={{ animation: "flicker 5.2s infinite" }} /><rect x="183" y="150" width="10" height="14" rx="1" style={{ animation: "flicker 3.4s infinite" }} /><rect x="207" y="150" width="10" height="14" rx="1" style={{ animation: "flicker 4.6s infinite" }} /><rect x="76" y="170" width="8" height="12" rx="1" style={{ animation: "flicker 4.8s infinite" }} /><rect x="312" y="170" width="8" height="12" rx="1" style={{ animation: "flicker 3.9s infinite" }} /></g>
      <circle cx="200" cy="66" r="26" fill="#10b981" style={{ animation: "orbPulse 2.6s ease-in-out infinite" }} /><circle cx="200" cy="66" r="12" fill="#6ee7b7" /><circle cx="200" cy="66" r="12" fill="none" stroke="#d1fae5" strokeWidth="1" />
      {[{ x: 96, y: 120, d: "0s" }, { x: 300, y: 116, d: ".8s" }, { x: 250, y: 150, d: "1.4s" }].map((s, i) => (
        <g key={i} style={{ animation: `floatY 3s ease-in-out ${s.d} infinite` }}>
          <rect x={s.x} y={s.y} width="26" height="18" rx="3" fill="#ecfdf5" opacity="0.9" /><rect x={s.x - 3} y={s.y - 1} width="4" height="20" rx="2" fill="#a7f3d0" /><rect x={s.x + 25} y={s.y - 1} width="4" height="20" rx="2" fill="#a7f3d0" />
          <line x1={s.x + 4} y1={s.y + 6} x2={s.x + 20} y2={s.y + 6} stroke="#34d399" strokeWidth="1.5" /><line x1={s.x + 4} y1={s.y + 11} x2={s.x + 18} y2={s.y + 11} stroke="#34d399" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}
function SceneWorld() {
  const pillars = [110, 165, 220, 275];
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block" }}>
      <circle cx="200" cy="66" r="46" fill="#0e7490" /><circle cx="200" cy="66" r="46" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
      <ellipse cx="200" cy="66" rx="46" ry="16" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.7" /><ellipse cx="200" cy="66" rx="20" ry="46" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.5" /><ellipse cx="200" cy="66" rx="40" ry="46" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.35" />
      <circle cx="186" cy="52" r="10" fill="#a5f3fc" opacity="0.5" /><circle cx="200" cy="66" r="52" fill="#22d3ee" opacity="0.12" style={{ animation: "orbPulse 3s ease-in-out infinite" }} />
      <path d="M0 224 L400 224" stroke="#0b2b22" strokeWidth="24" />
      {pillars.map((x, i) => (<g key={i}><rect x={x - 8} y="120" width="16" height="104" fill="#0c2a20" stroke="#0f5c43" strokeWidth="1.5" />{[0, 1, 2].map((k) => (<circle key={k} cx={x} cy="210" r="3" fill="#34d399" style={{ animation: `streamUp 2.2s linear ${(i * 0.3 + k * 0.7)}s infinite`, filter: "drop-shadow(0 0 4px #34d399)" }} />))}</g>))}
    </svg>
  );
}
function SceneCracks() {
  const cracks = ["M200 92 L196 120 L204 140 L198 170 L206 210", "M200 110 L214 128 L210 150 L224 176", "M200 118 L186 136 L190 158 L176 182"];
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block", animation: "rumble 0.4s ease-in-out infinite" }}>
      <path d="M0 218 Q120 202 260 215 T400 214 L400 240 L0 240Z" fill="#1a1226" />
      <rect x="168" y="86" width="64" height="136" fill="#241a30" stroke="#7c3aed" strokeWidth="2" opacity="0.9" />
      <g fill="#7c1d1d"><rect x="168" y="80" width="12" height="10" /><rect x="186" y="80" width="12" height="10" /><rect x="208" y="80" width="12" height="10" /><rect x="220" y="80" width="12" height="10" /></g>
      <g fill="#f59e0b" opacity="0.5"><rect x="183" y="118" width="10" height="14" rx="1" style={{ animation: "flicker 1.2s infinite" }} /><rect x="207" y="150" width="10" height="14" rx="1" style={{ animation: "flicker 0.9s infinite" }} /></g>
      {cracks.map((d, i) => (<path key={i} d={d} fill="none" stroke="#fca5a5" strokeWidth="1.6" strokeLinecap="round" style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: `crackDraw 1.3s ease-out ${i * 0.35}s forwards`, filter: "drop-shadow(0 0 3px #ef4444)" }} />))}
      {[{ x: 190, d: "0s" }, { x: 210, d: ".5s" }, { x: 176, d: "1s" }, { x: 224, d: "1.4s" }].map((p, i) => (<rect key={i} x={p.x} y="150" width="6" height="6" fill="#a78bfa" style={{ animation: `debris 1.6s ease-in ${p.d} infinite` }} />))}
      <rect x="0" y="0" width="400" height="240" fill="#ef4444" opacity="0.06" />
    </svg>
  );
}
function SceneCrisis() {
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block" }}>
      <rect x="0" y="0" width="400" height="240" fill="#7f1d1d" opacity="0.16" style={{ animation: "alertPulse 1.4s ease-in-out infinite" }} />
      <path d="M0 218 Q120 204 260 216 T400 214 L400 240 L0 240Z" fill="#120608" />
      <rect x="170" y="96" width="60" height="128" fill="#1c1013" stroke="#4c1d1d" strokeWidth="2" />
      {["M120 40 L110 90 L128 88 L116 140", "M290 50 L302 96 L286 94 L298 150"].map((d, i) => (<path key={i} d={d} fill="none" stroke="#fde68a" strokeWidth="2.2" strokeLinecap="round" style={{ animation: `boltFlash 2.4s ${i * 0.7}s infinite`, filter: "drop-shadow(0 0 4px #fbbf24)" }} />))}
      <g style={{ animation: "alertPulse 1s ease-in-out infinite" }}>
        <polygon points="200,74 236,140 164,140" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinejoin="round" /><polygon points="200,84 226,134 174,134" fill="#dc2626" opacity="0.25" />
        <rect x="196" y="98" width="8" height="24" rx="2" fill="#fca5a5" /><circle cx="200" cy="130" r="3.5" fill="#fca5a5" />
      </g>
    </svg>
  );
}
function SceneJourney() {
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block" }}>
      <defs>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef3c7" /><stop offset="60%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#f59e0b" /></radialGradient>
        <linearGradient id="bridge" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#fb923c" /></linearGradient>
      </defs>
      <circle cx="300" cy="150" r="60" fill="#fbbf24" opacity="0.18" style={{ animation: "orbPulse 3s ease-in-out infinite" }} />
      {Array.from({ length: 10 }).map((_, i) => { const a = (i / 10) * Math.PI * 2; return (<line key={i} x1={300 + Math.cos(a) * 34} y1={150 + Math.sin(a) * 34} x2={300 + Math.cos(a) * 54} y2={150 + Math.sin(a) * 54} stroke="#fcd34d" strokeWidth="2" opacity="0.55" />); })}
      <circle cx="300" cy="150" r="28" fill="url(#sun)" />
      <path d="M0 205 Q100 190 200 198 T400 196 L400 240 L0 240Z" fill="#3b2450" />
      <rect x="40" y="192" width="70" height="14" rx="4" fill="#0f5c43" /><rect x="285" y="158" width="80" height="14" rx="4" fill="#9a3412" />
      <path id="bridgePath" d="M95 196 Q200 214 320 168" fill="none" stroke="url(#bridge)" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      <circle r="4.5" fill="#ffffff"><animateMotion dur="1.9s" repeatCount="indefinite"><mpath href="#bridgePath" /></animateMotion></circle>
      <g style={{ animation: "floatY 3s ease-in-out infinite" }}><circle cx="74" cy="176" r="8" fill="#0b1020" stroke="#fcd34d" strokeWidth="1.2" /><path d="M62 200 L67 182 Q74 176 81 182 L86 200 Z" fill="#0b1020" stroke="#fcd34d" strokeWidth="1.2" /></g>
      {[{ x: 150, d: "0s" }, { x: 210, d: ".7s" }, { x: 260, d: "1.3s" }, { x: 120, d: "1.8s" }].map((s, i) => (<g key={i} style={{ animation: `hopeRise 2.4s ease-out ${s.d} infinite` }}><path d={`M${s.x} 190 l3 5 l5 1 l-4 4 l1 6 l-5 -3 l-5 3 l1 -6 l-4 -4 l5 -1 z`} fill="#fde68a" /></g>))}
    </svg>
  );
}
const STORY = [
  { Scene: SceneKingdom, tint: "radial-gradient(circle at 50% 42%, #0d3b34, #061826 72%)", moteColor: "#5eead4", caption: "西暦196X年——世界の基幹を支えた古の言語、その名は COBOL。" },
  { Scene: SceneWorld, tint: "radial-gradient(circle at 50% 36%, #0e3a52, #06142a 72%)", moteColor: "#67e8f9", caption: "銀行も、行政も。その屋台骨は、COBOLの巨塔が支えていた。" },
  { Scene: SceneCracks, tint: "radial-gradient(circle at 50% 46%, #2a1f3a, #0a0716 72%)", moteColor: "#c4b5fd", caption: "だが時は流れ、巨塔は老い、あちこちに亀裂が走りはじめた…。" },
  { Scene: SceneCrisis, tint: "radial-gradient(circle at 50% 50%, #3b0d16, #0a0409 72%)", moteColor: "#f87171", caption: "「このままでは——王国が、止まってしまう」" },
  { Scene: SceneJourney, tint: "linear-gradient(180deg, #1b1740 0%, #3a2a55 45%, #7c2d12 100%)", moteColor: "#fcd34d", caption: "選ばれし新人よ。COBOLからJavaへ。移行の旅が、いま幕を開ける。" },
];
function Intro({ onDone }) {
  const [i, setI] = useState(0);
  const titleShown = i >= STORY.length;
  useEffect(() => { if (!titleShown) { const t = setTimeout(() => setI((v) => v + 1), 3400); return () => clearTimeout(t); } }, [i, titleShown]);
  const sc = STORY[Math.min(i, STORY.length - 1)];
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 20, background: "#05070e" }}>
      {!titleShown ? (
        <div key={i} className="absolute inset-0" style={{ animation: "cineIn .8s ease-out" }}>
          <div className="absolute inset-0" style={{ background: sc.tint }} />
          <Starfield /><Motes color={sc.moteColor} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 45%, transparent 40%, rgba(0,0,0,0.7))" }} />
          <div className="absolute inset-x-0 flex justify-center" style={{ top: "22%" }}><div className="w-full max-w-md px-6" style={{ animation: "kenburns 4s ease-out forwards" }}><sc.Scene /></div></div>
          <div className="absolute inset-x-0 px-8 text-center" style={{ top: "68%" }}><p key={"cap" + i} className="text-slate-100 text-lg leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 2px 12px rgba(0,0,0,0.9)", animation: "captionIn .8s ease-out .3s both" }}>{sc.caption}</p></div>
          <div className="absolute inset-x-0 flex justify-center gap-2" style={{ bottom: "9%" }}>{STORY.map((_, k) => (<span key={k} className={"h-1.5 rounded-full transition-all " + (k === i ? "w-6 bg-amber-400" : "w-1.5 bg-slate-600")} />))}</div>
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 42%, #16123a, #06060f 75%)" }}>
          <Starfield /><Motes color="#fcd34d" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div className="absolute" style={{ width: 300, height: 300, borderRadius: 9999, background: "radial-gradient(circle, rgba(251,191,36,0.3), transparent 70%)", animation: "orbPulse 2.6s ease-in-out infinite" }} />
            <div className="relative" style={{ animation: "titlePop .8s ease-out .1s both" }}><Logo scale={1.15} /></div>
            <button onClick={onDone} className="relative mt-10 px-9 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-black text-lg hover:bg-amber-300" style={{ animation: "fadeUp .6s ease-out .9s both, ctaPulse 1.8s ease-in-out 1.5s infinite" }}>▶ 冒険をはじめる</button>
          </div>
        </div>
      )}
      <div className="absolute top-0 inset-x-0 bg-black" style={{ height: "7%", transformOrigin: "top", animation: "letterbox .6s ease-out" }} />
      <div className="absolute bottom-0 inset-x-0 bg-black" style={{ height: "7%", transformOrigin: "bottom", animation: "letterbox .6s ease-out" }} />
      <button onClick={onDone} className="absolute right-4 text-slate-400 text-sm hover:text-slate-200" style={{ top: "8.5%", zIndex: 30 }}>スキップ →</button>
    </div>
  );
}

// ================= キャラ =================
function Sage({ mood = "happy", size = 56 }) {
  const brow = mood === "warn" ? { l: "M38 46 L46 44", r: "M54 44 L62 46" } : mood === "think" ? { l: "M38 45 L46 45", r: "M54 45 L62 43" } : { l: "M38 45 L46 46", r: "M54 46 L62 45" };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ animation: "floatY 3.2s ease-in-out infinite" }}>
      <polygon points="50,6 28,44 72,44" fill="#059669" /><polygon points="50,6 40,24 50,20 60,24" fill="#34d399" opacity="0.7" /><circle cx="50" cy="10" r="3" fill="#fbbf24" /><rect x="27" y="41" width="46" height="6" rx="3" fill="#065f46" />
      <circle cx="50" cy="58" r="19" fill="#f2d3a7" /><path d="M33 60 Q34 88 50 90 Q66 88 67 60 Q60 78 50 79 Q40 78 33 60 Z" fill="#e2e8f0" /><path d="M44 74 Q50 80 56 74 L56 60 Q50 64 44 60 Z" fill="#f1f5f9" />
      <circle cx="43" cy="56" r="6" fill="none" stroke="#fbbf24" strokeWidth="2" /><circle cx="57" cy="56" r="6" fill="none" stroke="#fbbf24" strokeWidth="2" /><line x1="49" y1="56" x2="51" y2="56" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="43" cy="56" r="2" fill="#1e293b" /><circle cx="57" cy="56" r="2" fill="#1e293b" />
      <path d={brow.l} stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" /><path d={brow.r} stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
function Monster({ cfg, defeated = false, size = 120 }) {
  const eyePos = cfg.eyes === 1 ? [[50, 47]] : cfg.eyes === 3 ? [[36, 46], [50, 42], [64, 46]] : [[41, 46], [59, 46]];
  const mouth = defeated ? "M42 64 Q50 60 58 64" : cfg.mood === "angry" ? "M40 66 L45 61 L50 66 L55 61 L60 66" : cfg.mood === "think" ? "M44 65 Q52 65 56 61" : "M40 62 Q50 71 60 62";
  const idle = defeated ? "koFall .6s ease forwards" : cfg.mood === "angry" ? "floatY 2.4s ease-in-out infinite, sway 1.4s ease-in-out infinite" : "floatY 2.6s ease-in-out infinite";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ animation: idle }}>
      {cfg.horns && (<><polygon points="30,26 24,8 40,22" fill={cfg.accent} /><polygon points="70,26 76,8 60,22" fill={cfg.accent} /></>)}
      <ellipse cx="50" cy="90" rx="26" ry="5" fill="rgba(0,0,0,0.35)" /><ellipse cx="38" cy="82" rx="8" ry="6" fill={cfg.accent} /><ellipse cx="62" cy="82" rx="8" ry="6" fill={cfg.accent} />
      {cfg.square ? <rect x="22" y="26" width="56" height="56" rx="12" fill={cfg.body} /> : <ellipse cx="50" cy="54" rx="30" ry="29" fill={cfg.body} />}
      {cfg.square && (<><circle cx="30" cy="36" r="2.5" fill={cfg.accent} /><circle cx="70" cy="36" r="2.5" fill={cfg.accent} /><circle cx="30" cy="72" r="2.5" fill={cfg.accent} /><circle cx="70" cy="72" r="2.5" fill={cfg.accent} /></>)}
      <ellipse cx="40" cy="40" rx="10" ry="7" fill="#ffffff" opacity="0.18" /><ellipse cx="20" cy="56" rx="6" ry="9" fill={cfg.body} /><ellipse cx="80" cy="56" rx="6" ry="9" fill={cfg.body} />
      {eyePos.map(([x, y], i) => defeated ? (<g key={i} stroke="#1e293b" strokeWidth="2.4" strokeLinecap="round"><line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} /><line x1={x + 4} y1={y - 4} x2={x - 4} y2={y + 4} /></g>) : (<g key={i}><circle cx={x} cy={y} r="6.5" fill="#ffffff" /><circle cx={x} cy={y + (cfg.mood === "angry" ? 1 : 0)} r="3" fill="#1e293b" /></g>))}
      {cfg.mood === "angry" && !defeated && (<><line x1="30" y1="40" x2="42" y2="44" stroke={cfg.accent} strokeWidth="3" strokeLinecap="round" /><line x1="70" y1="40" x2="58" y2="44" stroke={cfg.accent} strokeWidth="3" strokeLinecap="round" /></>)}
      <path d={mouth} fill="none" stroke="#1e293b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Impact({ fx }) {
  if (!fx || fx.key === 0) return null;
  const isCrit = fx.type === "crit"; const ringColor = isCrit ? "#fbbf24" : "#94a3b8"; const pColor = isCrit ? "#fde68a" : "#cbd5e1";
  return (
    <div key={fx.key} className="absolute inset-0 pointer-events-none">
      <div className="absolute" style={{ left: "50%", top: "50%", width: 90, height: 90, marginLeft: -45, marginTop: -45, borderRadius: "9999px", border: `3px solid ${ringColor}`, animation: "ring .5s ease-out forwards" }} />
      {isCrit && (<div className="absolute" style={{ left: "50%", top: "44%", width: 190, height: 12, marginLeft: -95, borderRadius: 9999, background: "linear-gradient(90deg,transparent,#ffffff,transparent)", animation: "slash .4s ease-out forwards" }} />)}
      {BURST_DIRS.map(([tx, ty], i) => (<span key={i} className="absolute" style={{ left: "50%", top: "50%", width: isCrit ? 9 : 6, height: isCrit ? 9 : 6, borderRadius: "9999px", background: pColor, ["--tx"]: `${isCrit ? tx : tx * 0.65}px`, ["--ty"]: `${isCrit ? ty : ty * 0.65}px`, animation: "burst .6s ease-out forwards" }} />))}
      <span className="absolute font-black" style={{ left: "50%", top: "36%", fontSize: isCrit ? 32 : 20, color: isCrit ? "#fbbf24" : "#94a3b8", textShadow: "0 2px 6px rgba(0,0,0,.6)", animation: "dmgFly .9s ease-out forwards" }}>{isCrit ? `-${fx.dmg}` : "MISS"}</span>
    </div>
  );
}
function CobolPanel({ code }) {
  return (
    <div className="relative rounded-lg p-4 overflow-hidden" style={panelStyle}>
      <div className="absolute inset-0 pointer-events-none rounded-lg" style={scanlines} />
      <div className="relative flex items-center gap-2 mb-2 text-emerald-300 text-xs uppercase tracking-widest"><span>▍COBOL 巻物</span></div>
      <pre className="relative text-sm leading-6 whitespace-pre-wrap">{code}<span style={{ animation: "blink 1s step-end infinite" }}>▊</span></pre>
    </div>
  );
}
function Sparkles() {
  const spots = [{ l: "8%", t: "20%", d: "0ms", s: "✦" }, { l: "88%", t: "16%", d: "80ms", s: "✧" }, { l: "20%", t: "70%", d: "160ms", s: "⭐" }, { l: "78%", t: "66%", d: "120ms", s: "✦" }, { l: "50%", t: "6%", d: "40ms", s: "✧" }];
  return (<div className="absolute inset-0 pointer-events-none">{spots.map((sp, i) => (<span key={i} className="absolute text-amber-300 text-lg" style={{ left: sp.l, top: sp.t, animation: "sparkle .7s ease-out forwards", animationDelay: sp.d }}>{sp.s}</span>))}</div>);
}
function Feedback({ correct, explanation, xp, onNext }) {
  return (
    <div className={"relative mt-4 rounded-lg p-4 border overflow-hidden " + (correct ? "border-emerald-500 bg-emerald-950" : "border-rose-500 bg-rose-950")} style={{ animation: "popIn .3s ease-out" }}>
      {correct && <Sparkles />}{correct && <span className="absolute right-3 top-2 text-amber-300 font-black" style={{ animation: "riseFade 1s ease-out forwards" }}>＋{xp} XP</span>}
      <div className={"relative font-bold mb-1 " + (correct ? "text-emerald-300" : "text-rose-300")}>{correct ? "⚔️ クリティカル！！！" : "🛡️ 反撃をくらった…"}</div>
      <p className="relative text-sm text-slate-200 leading-relaxed">{explanation}</p>
      <button onClick={onNext} className="relative mt-3 w-full py-2.5 rounded-lg bg-amber-400 text-slate-900 font-bold hover:bg-amber-300">つぎへ →</button>
    </div>
  );
}
function ChoiceQuestion({ q, onResult, onNext }) {
  const [picked, setPicked] = useState(null);
  const submitted = picked !== null; const correct = submitted && picked === q.answer;
  function choose(i) { if (submitted) return; setPicked(i); onResult(i === q.answer); }
  return (
    <div style={submitted && !correct ? { animation: "shakeX .4s" } : undefined}>
      {q.javaTemplate && (<div className="rounded-md px-4 py-3 mb-4 text-sm" style={{ ...panelStyle, color: "#fde68a" }}>{q.javaTemplate.split("⬚").map((part, idx, arr) => (<span key={idx}>{part}{idx < arr.length - 1 && (<span className="inline-block px-2 mx-1 rounded" style={{ background: submitted ? (correct ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)") : "rgba(253,230,138,0.18)" }}>{submitted ? q.options[picked] : "＿＿"}</span>)}</span>))}</div>)}
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          let cls = "w-full text-left px-4 py-3 rounded-lg border transition-colors font-mono text-sm ";
          if (!submitted) cls += "border-slate-600 bg-slate-800 text-slate-100 hover:border-amber-400 hover:bg-slate-700";
          else if (i === q.answer) cls += "border-emerald-400 bg-emerald-900 text-emerald-100";
          else if (i === picked) cls += "border-rose-400 bg-rose-900 text-rose-100";
          else cls += "border-slate-700 bg-slate-800 text-slate-400";
          return (<button key={i} className={cls} onClick={() => choose(i)} style={{ animation: "fadeUp .3s both", animationDelay: `${i * 45}ms` }}>{opt}</button>);
        })}
      </div>
      {submitted && <Feedback correct={correct} explanation={q.explanation} xp={q.xp} onNext={onNext} />}
    </div>
  );
}
function MatchingQuestion({ q, onResult, onNext }) {
  const rights = useMemo(() => shuffle(q.pairs.map((p) => p.right)).map((x) => x.v), [q.id]);
  const [assign, setAssign] = useState({}); const [submitted, setSubmitted] = useState(false);
  const allSet = q.pairs.every((_, i) => assign[i] != null && assign[i] !== ""); const correct = submitted && q.pairs.every((p, i) => assign[i] === p.right);
  function check() { if (!allSet) return; setSubmitted(true); onResult(q.pairs.every((p, i) => assign[i] === p.right)); }
  return (
    <div style={submitted && !correct ? { animation: "shakeX .4s" } : undefined}>
      <div className="grid gap-2">
        {q.pairs.map((p, i) => { const ok = submitted && assign[i] === p.right; const bad = submitted && assign[i] !== p.right;
          return (<div key={i} className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2" style={{ animation: "fadeUp .3s both", animationDelay: `${i * 45}ms` }}>
            <span className="flex-1 font-mono text-sm text-emerald-200">{p.left}</span><span className="text-slate-500">→</span>
            <select disabled={submitted} value={assign[i] ?? ""} onChange={(e) => setAssign({ ...assign, [i]: e.target.value })} className={"rounded-md px-2 py-2 text-sm font-mono border bg-slate-900 " + (ok ? "border-emerald-400 text-emerald-200" : bad ? "border-rose-400 text-rose-200" : "border-slate-600 text-slate-100")}>
              <option value="">— えらぶ —</option>{rights.map((r) => (<option key={r} value={r}>{r}</option>))}</select>
          </div>);
        })}
      </div>
      {submitted && !correct && (<div className="mt-2 text-xs text-slate-400 font-mono">正解: {q.pairs.map((p) => `${p.left}→${p.right}`).join(" / ")}</div>)}
      {!submitted ? (<button onClick={check} disabled={!allSet} className={"mt-4 w-full py-3 rounded-lg font-bold " + (allSet ? "bg-amber-400 text-slate-900 hover:bg-amber-300" : "bg-slate-700 text-slate-500")}>こうげき！</button>) : (<Feedback correct={correct} explanation={q.explanation} xp={q.xp} onNext={onNext} />)}
    </div>
  );
}
function OrderingQuestion({ q, onResult, onNext }) {
  const shuffled = useMemo(() => shuffle(q.items).map((x) => ({ text: x.v, orig: x.i })), [q.id]);
  const [seq, setSeq] = useState([]); const [submitted, setSubmitted] = useState(false);
  const done = seq.length === q.items.length; const correct = submitted && seq.every((origIdx, pos) => origIdx === pos);
  function pick(orig) { if (submitted || seq.includes(orig)) return; setSeq([...seq, orig]); }
  function check() { if (!done) return; setSubmitted(true); onResult(seq.every((origIdx, pos) => origIdx === pos)); }
  return (
    <div style={submitted && !correct ? { animation: "shakeX .4s" } : undefined}>
      <div className="grid gap-2 mb-3">
        {shuffled.map((it) => { const chosen = seq.includes(it.orig); const posIdx = seq.indexOf(it.orig); const order = posIdx + 1; const okPos = submitted && chosen && posIdx === it.orig;
          return (<button key={it.orig} onClick={() => pick(it.orig)} disabled={chosen || submitted} className={"w-full text-left px-4 py-3 rounded-lg border font-mono text-sm flex items-center gap-3 " + (chosen ? (submitted ? (okPos ? "border-emerald-400 bg-emerald-900 text-emerald-100" : "border-rose-400 bg-rose-900 text-rose-100") : "border-amber-400 bg-slate-700 text-amber-100") : "border-slate-600 bg-slate-800 text-slate-100 hover:border-amber-400")}>
            <span className={"w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold " + (chosen ? "bg-amber-400 text-slate-900" : "bg-slate-600 text-slate-300")}>{chosen ? order : "・"}</span>{it.text}
          </button>);
        })}
      </div>
      {submitted && !correct && (<div className="mb-2 text-xs text-slate-400 font-mono">正しい順: {q.items.map((t, i) => `${i + 1}.${t}`).join("  ")}</div>)}
      {!submitted ? (<div className="flex gap-2"><button onClick={() => setSeq([])} className="px-4 py-3 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600">やり直す</button><button onClick={check} disabled={!done} className={"flex-1 py-3 rounded-lg font-bold " + (done ? "bg-amber-400 text-slate-900 hover:bg-amber-300" : "bg-slate-700 text-slate-500")}>こうげき！</button></div>) : (<Feedback correct={correct} explanation={q.explanation} xp={q.xp} onNext={onNext} />)}
    </div>
  );
}
function Hud({ xp, skills }) {
  const level = levelOf(xp); const into = xp % XP_PER_LEVEL; const pct = (into / XP_PER_LEVEL) * 100;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 mb-4 relative" style={{ zIndex: 10 }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-amber-400 text-slate-900 font-black text-lg shrink-0">Lv{level}</div>
        <div className="flex-1"><div className="flex justify-between text-xs text-slate-400 mb-1 font-mono"><span>XP</span><span>{into} / {XP_PER_LEVEL}</span></div><div className="h-2.5 rounded-full bg-slate-700 overflow-hidden"><div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%`, transition: "width .6s ease" }} /></div></div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-3">
        {Object.entries(SKILLS).map(([key, s]) => (<div key={key} className="rounded-lg bg-slate-800 border border-slate-700 px-2 py-1.5 text-center"><div className="text-base leading-none">{s.emoji}</div><div className="text-xs text-slate-400 mt-0.5">{s.label}</div><div key={skills[key] || 0} className="flex justify-center gap-0.5 mt-1" style={{ animation: (skills[key] || 0) > 0 ? "popIn .3s" : undefined }}>{[0, 1, 2].map((n) => (<span key={n} className={"w-1.5 h-1.5 rounded-full " + (n < (skills[key] || 0) ? "bg-sky-400" : "bg-slate-600")} />))}</div></div>))}
      </div>
    </div>
  );
}
function Home({ chapters, completed, onStart }) {
  const nextIdx = chapters.findIndex((c, i) => !completed.has(c.id) && (i === 0 || completed.has(chapters[i - 1].id)));
  return (
    <div>
      <div className="flex flex-col items-center mb-5" style={{ animation: "titlePop .6s ease-out" }}><Logo scale={0.82} /></div>
      <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-3 mb-5 flex gap-3 items-start" style={{ animation: "fadeUp .5s ease-out .3s both" }}>
        <div className="shrink-0"><Sage size={44} /></div>
        <p className="text-sm text-emerald-100 leading-relaxed">さあ、ダンジョンの主(モンスター)を倒しながらJavaへ移すのじゃ。挑むダンジョンを選ぶがよい！</p>
      </div>
      <div className="space-y-3">
        {chapters.map((c, i) => { const cleared = completed.has(c.id); const unlocked = i === 0 || completed.has(chapters[i - 1].id); const isNext = i === nextIdx;
          return (<button key={c.id} disabled={!unlocked} onClick={() => onStart(i)} className={"w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors " + (unlocked ? "border-slate-600 bg-slate-800 hover:border-amber-400 hover:bg-slate-700" : "border-slate-800 bg-slate-900 opacity-60")} style={{ animation: `fadeUp .45s ease-out ${0.45 + i * 0.12}s both` }}>
            <div className="w-14 h-14 shrink-0 flex items-center justify-center" style={isNext ? { animation: "ctaPulse 1.8s ease-in-out infinite", borderRadius: 12 } : undefined}>{unlocked ? <Monster cfg={c.monster} defeated={cleared} size={56} /> : <span className="text-3xl">🔒</span>}</div>
            <div className="flex-1"><div className="text-xs text-slate-400 font-mono">{c.no}・{SKILLS[c.skill].label}</div><div className="font-bold text-slate-100">{c.title}</div><div className="text-xs text-slate-500">{unlocked ? c.monster.name : c.dungeon}</div></div>
            {cleared ? <span className="text-emerald-400 text-sm font-bold">✓ 撃破</span> : isNext ? <span className="text-amber-300 text-sm font-bold" style={{ animation: "floatY 1.6s ease-in-out infinite" }}>▶</span> : null}
          </button>);
        })}
      </div>
    </div>
  );
}

// ---------- ダイブ演出(問題画面への長い遷移) ----------
function BattleIntro({ chapter, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, []);
  const m = chapter.monster;
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 30, background: "#04060d" }} onClick={onDone}>
      <CodeRain heavy fast />
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 58%, ${m.accent}33, transparent 60%)` }} />
      <div className="absolute inset-0" style={{ animation: "diveZoom 1s ease-in 2.2s both" }}>
        {/* 章タイトル */}
        <div className="absolute inset-x-0 text-center px-6" style={{ top: "22%" }}>
          <div className="font-black text-amber-300" style={{ fontSize: 40, textShadow: "0 0 22px rgba(251,191,36,.6)", animation: "dropIn .7s ease-out both" }}>{chapter.no}</div>
          <div className="font-black text-slate-100 mt-1" style={{ fontSize: 24, animation: "fadeUp .6s ease-out .45s both" }}>{chapter.title}</div>
        </div>
        {/* ポータル */}
        <div className="absolute" style={{ left: "50%", top: "60%", animation: "portalIn .9s ease-out 1.1s both" }}>
          <div className="relative" style={{ width: 180, height: 180, marginLeft: -90, marginTop: -90 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(from 0deg, ${m.accent}, transparent, ${m.body}, transparent, ${m.accent})`, opacity: 0.6, animation: "spin 2.4s linear infinite" }} />
            <div className="absolute inset-4 rounded-full" style={{ border: `3px solid ${m.body}`, boxShadow: `0 0 30px ${m.accent}` }} />
            <div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${m.accent}`, animation: "orbPulse 1.6s ease-in-out infinite" }} />
            <div className="absolute inset-0 flex items-center justify-center text-white font-black" style={{ fontSize: 15, textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>{chapter.dungeon}</div>
          </div>
        </div>
        <div className="absolute inset-x-0 text-center" style={{ bottom: "16%", animation: "fadeUp .5s ease-out 1.8s both" }}>
          <span className="font-serif text-slate-200" style={{ fontStyle: "italic", fontSize: 16, textShadow: "0 2px 8px rgba(0,0,0,.8)" }}>いざ、{chapter.dungeon}へ——</span>
        </div>
      </div>
      <div className="absolute right-4 text-slate-400 text-sm" style={{ top: "6%", zIndex: 32 }}>タップでスキップ →</div>
    </div>
  );
}

function Encounter({ chapter, onFight }) {
  useEffect(() => { const t = setTimeout(onFight, 2200); return () => clearTimeout(t); }, []);
  const m = chapter.monster;
  return (
    <div style={{ animation: "fadeUp .3s" }}>
      <div key="flash" className="fixed inset-0 pointer-events-none" style={{ zIndex: 40, background: "#fff", animation: "whiteFlash .5s ease-out forwards" }} />
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 mb-4 relative overflow-hidden" style={{ animation: "bigShake .5s ease-out" }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, ${m.accent}44, transparent 65%)` }} />
        <div className="relative text-center mb-2"><span className="inline-block text-lg font-black text-slate-100" style={{ animation: "bannerIn .5s ease-out .15s both" }}>⚔ {m.name} が あらわれた！</span></div>
        <div className="relative flex justify-center" style={{ minHeight: 170 }}>
          <div className="absolute" style={{ left: "50%", top: "55%", width: 80, height: 80, marginLeft: -40, marginTop: -40, borderRadius: 9999, border: `4px solid ${m.accent}`, animation: "shock .6s ease-out .25s forwards" }} />
          <div style={{ animation: "slamIn .6s ease-out" }}><Monster cfg={m} size={150} /></div>
        </div>
      </div>
      <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-3 mb-4 flex gap-3 items-start" style={{ animation: "fadeUp .4s ease-out .4s both" }}>
        <div className="shrink-0"><Sage size={40} mood={chapter.id === "ch4" ? "warn" : "happy"} /></div>
        <p className="text-sm text-emerald-100 leading-relaxed">{chapter.intro}</p>
      </div>
      <button onClick={onFight} className="w-full py-3.5 rounded-xl bg-rose-500 text-white font-black text-lg hover:bg-rose-400" style={{ animation: "fadeUp .4s ease-out .55s both, ctaPulse 1.6s ease-in-out 1s infinite" }}>⚔ たたかう！</button>
    </div>
  );
}
function Stage({ chapter, onScore, onComplete, onHome }) {
  const [phase, setPhase] = useState("dive");
  const [qi, setQi] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [fx, setFx] = useState({ key: 0, type: "crit", dmg: 0 });
  const [pop, setPop] = useState(null);
  const [combo, setCombo] = useState(0);
  const q = chapter.questions[qi];
  const total = chapter.questions.length;
  const hpPct = ((total - answered) / total) * 100;
  const defeated = answered >= total;

  function result(correct) {
    setAnswered((a) => a + 1); setFx({ key: fx.key + 1, type: correct ? "crit" : "miss", dmg: q.xp });
    if (correct) { onScore(q.id, chapter.skill, q.xp); setPop({ key: (pop?.key || 0) + 1, xp: q.xp }); setCombo((c) => c + 1); } else setCombo(0);
  }
  function next() { if (qi + 1 < total) setQi(qi + 1); else onComplete(); }

  if (phase === "dive") return <BattleIntro chapter={chapter} onDone={() => setPhase("encounter")} />;
  if (phase === "encounter") return (<div><button onClick={onHome} className="text-slate-400 text-sm mb-2 hover:text-slate-200">← マップへ</button><Encounter chapter={chapter} onFight={() => setPhase("battle")} /></div>);

  const shakeAnim = fx.key > 0 ? (fx.type === "crit" ? "screenShake .4s" : "bigShake .45s") : undefined;
  const punchAnim = fx.key > 0 && fx.type === "crit" ? "punch .32s ease-out" : undefined;

  return (
    <div>
      {fx.key > 0 && (<div key={"flash" + fx.key} className="fixed inset-0 pointer-events-none" style={{ zIndex: 40, background: defeated ? "#fff" : fx.type === "crit" ? "radial-gradient(circle at 50% 40%, rgba(251,191,36,.55), transparent 60%)" : "radial-gradient(circle at 50% 45%, transparent 45%, rgba(244,63,94,.65))", animation: defeated ? "whiteFlash .55s ease-out forwards" : fx.type === "crit" ? "critFlash .5s ease-out forwards" : "redPulse .55s ease-out forwards" }} />)}
      <button onClick={onHome} className="text-slate-400 text-sm mb-2 hover:text-slate-200">← マップへ</button>
      <div key={"shake" + fx.key} className="rounded-xl border border-slate-700 bg-slate-900 p-3 mb-4 relative overflow-hidden" style={{ animation: shakeAnim }}>
        <div key={"punch" + fx.key} style={{ animation: punchAnim }}>
          <div className="flex justify-between items-center mb-1"><span className="text-sm font-bold text-slate-100">{chapter.monster.name}</span><span className="text-xs font-mono text-slate-400">{chapter.no}・{chapter.dungeon}</span></div>
          <div className="relative h-2.5 rounded-full bg-slate-700 overflow-hidden mb-3"><div className="absolute inset-y-0 left-0 rounded-full bg-amber-300" style={{ width: `${hpPct}%`, transition: "width .7s ease .25s" }} /><div className="absolute inset-y-0 left-0 rounded-full bg-rose-500" style={{ width: `${hpPct}%`, transition: "width .18s ease" }} /></div>
          <div className="flex justify-center relative" style={{ minHeight: 132 }}>
            <div key={"mon" + fx.key} style={fx.key > 0 && !defeated ? { animation: "knockback .45s ease-out, hardFlash .5s ease-out" } : undefined}><Monster cfg={chapter.monster} defeated={defeated} size={124} /></div>
            <Impact fx={fx} />
            {combo >= 2 && !defeated && (<span key={"combo" + fx.key} className="absolute font-black text-amber-300" style={{ left: "8%", top: "4%", fontSize: 18, textShadow: "0 2px 6px rgba(0,0,0,.6)", animation: "comboPop .4s ease-out" }}>{combo} COMBO!</span>)}
            {pop && (<span key={"xp" + pop.key} className="absolute font-black text-lg text-emerald-300" style={{ left: "64%", top: "8%", animation: "riseFade 1s ease-out forwards", textShadow: "0 2px 6px rgba(0,0,0,.6)" }}>＋{pop.xp} XP</span>)}
            {defeated && (<div className="absolute inset-0 flex items-center justify-center" style={{ animation: "bigText .5s ease-out" }}><span className="text-rose-300 font-black text-3xl" style={{ textShadow: "0 0 18px rgba(244,63,94,.8)" }}>撃破！！！</span></div>)}
          </div>
        </div>
      </div>
      <div className="mb-4"><CobolPanel code={chapter.cobol} /></div>
      <div className="flex justify-between items-center mb-2"><span className="text-xs text-slate-400 font-mono">問 {qi + 1} / {total}</span><span className="text-xs text-amber-300 font-mono">＋{q.xp} XP</span></div>
      <h2 className="font-bold text-slate-100 mb-3">{q.prompt}</h2>
      {q.type === "choice" || q.type === "fill" ? (<ChoiceQuestion key={q.id} q={q} onResult={result} onNext={next} />) : q.type === "matching" ? (<MatchingQuestion key={q.id} q={q} onResult={result} onNext={next} />) : (<OrderingQuestion key={q.id} q={q} onResult={result} onNext={next} />)}
    </div>
  );
}
function ChapterResult({ chapter, gained, onHome, allCleared }) {
  return (
    <div className="text-center py-6" style={{ animation: "fadeUp .35s ease-out" }}>
      <div className="flex justify-center mb-2"><Monster cfg={chapter.monster} defeated size={110} /></div>
      <h2 className="text-xl font-black text-amber-300">モジュール移行、成功！</h2>
      <p className="text-slate-300 mt-1">{chapter.no}「{chapter.title}」の主を撃破した</p>
      <div className="inline-block rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 mt-4 text-sm font-mono text-emerald-300">獲得 XP ＋{gained}／{SKILLS[chapter.skill].label} アップ ↑</div>
      <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-3 my-5 flex gap-3 items-start text-left"><div className="shrink-0"><Sage size={40} /></div><p className="text-sm text-emerald-100 leading-relaxed">{allCleared ? "見事じゃ！全モジュールの移行が完了した。お主はもう立派な移行の勇者じゃ！" : "その調子じゃ！次のダンジョンへ進むのじゃ。"}</p></div>
      <button onClick={onHome} className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 font-bold hover:bg-amber-300">{allCleared ? "マップへもどる" : "マップへもどって次へ →"}</button>
    </div>
  );
}
function Victory({ xp, onReset }) {
  return (
    <div className="text-center py-8" style={{ animation: "fadeUp .35s ease-out" }}>
      <div key="vflash" className="fixed inset-0 pointer-events-none" style={{ zIndex: 40, background: "#fff", animation: "whiteFlash .6s ease-out forwards" }} />
      <div className="text-6xl mb-2" style={{ animation: "floatY 2.6s ease-in-out infinite" }}>🏆</div>
      <div className="flex justify-center gap-1 mb-3">{CHAPTERS.map((c) => (<div key={c.id} className="w-9 h-9"><Monster cfg={c.monster} defeated size={36} /></div>))}</div>
      <div className="flex justify-center mb-2"><Logo scale={0.7} /></div>
      <h2 className="text-xl font-black text-amber-300 mt-2">クエスト完了！</h2>
      <p className="text-slate-300 mt-2">COBOL基幹システムをJavaへ移行しきった。</p>
      <p className="text-slate-400 text-sm mt-1 font-mono">最終レベル Lv{levelOf(xp)}／総XP {xp}</p>
      <button onClick={onReset} className="mt-6 px-6 py-3 rounded-lg bg-slate-700 text-slate-100 font-bold hover:bg-slate-600">もう一度あそぶ</button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [xp, setXp] = useState(0);
  const [skills, setSkills] = useState({ syntax: 0, design: 0, process: 0, practice: 0 });
  const [completed, setCompleted] = useState(new Set());
  const [scored, setScored] = useState(new Set());
  const [lastGain, setLastGain] = useState(0);
  const [levelUp, setLevelUp] = useState(null);

  function addScore(id, skill, amount) {
    if (scored.has(id)) return;
    setScored((prev) => new Set(prev).add(id));
    setXp((v) => { const nv = v + amount; if (levelOf(nv) > levelOf(v)) { setLevelUp(levelOf(nv)); setTimeout(() => setLevelUp(null), 1900); } return nv; });
    setSkills((s) => ({ ...s, [skill]: Math.min(3, (s[skill] || 0) + 1) }));
    setLastGain((g) => g + amount);
  }
  function startStage(i) { setCurrent(i); setLastGain(0); setScreen("stage"); }
  function completeStage() { const ch = CHAPTERS[current]; const next = new Set(completed); next.add(ch.id); setCompleted(next); setScreen(next.size === CHAPTERS.length ? "victory" : "result"); }
  function reset() { setScreen("home"); setCurrent(0); setXp(0); setSkills({ syntax: 0, design: 0, process: 0, practice: 0 }); setCompleted(new Set()); setScored(new Set()); setLastGain(0); }

  return (
    <div className="min-h-screen w-full py-6 px-4 relative" style={{ background: "radial-gradient(1100px 500px at 50% -8%, #1e1b4b, #0b1020 55%, #070a12)" }}>
      <GameStyles />
      {screen === "home" && <CodeRain />}
      {screen === "intro" && <Intro onDone={() => setScreen("home")} />}

      {levelUp && (<div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 50 }}><div className="rounded-2xl bg-amber-400 text-slate-900 px-8 py-5 text-center" style={{ animation: "popIn .4s, glowPulse 1.6s ease-in-out" }}><div className="text-2xl font-black">LEVEL UP!</div><div className="font-mono font-bold">Lv{levelUp} になった！</div></div></div>)}

      {screen !== "intro" && (
        <div className="max-w-md mx-auto relative" style={{ zIndex: 10 }}>
          <Hud xp={xp} skills={skills} />
          <div key={screen}>
            {screen === "home" && <Home chapters={CHAPTERS} completed={completed} onStart={startStage} />}
            {screen === "stage" && <Stage chapter={CHAPTERS[current]} onScore={addScore} onComplete={completeStage} onHome={() => setScreen("home")} />}
            {screen === "result" && <ChapterResult chapter={CHAPTERS[current]} gained={lastGain} allCleared={completed.size === CHAPTERS.length} onHome={() => setScreen("home")} />}
            {screen === "victory" && <Victory xp={xp} onReset={reset} />}
          </div>
          <p className="text-center text-xs text-slate-600 mt-8 font-mono">MVPプロトタイプ v6 / 進捗はメモリ内保持（実装版はlocalStorage）</p>
        </div>
      )}
    </div>
  );
}
