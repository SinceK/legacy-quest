# LEGACY QUEST 〜COBOLからJavaへ〜

COBOL技術者がJavaへの移行スキルを学ぶ、RPG風のブラウザ学習ゲームです。
ダンジョン（章）の主を倒しながら、COBOLの巻物をJavaへ読み替えていきます。

- **移行元**：IBM Enterprise COBOL（z/OS）ベースの標準構文
- **移行先**：Spring Batch / Spring Boot
- 詳しい仕様は [`docs/要件定義書_COBOL-Java学習ゲーム.md`](docs/要件定義書_COBOL-Java学習ゲーム.md) と
  [`docs/MVPステージ設計書_COBOL-Java学習ゲーム.md`](docs/MVPステージ設計書_COBOL-Java学習ゲーム.md) を参照してください。

## 技術構成

要件定義書 8章の推奨構成に沿っています。

| 項目 | 採用 |
| --- | --- |
| ビルド | Vite 8 |
| UI | React 19 |
| スタイル | Tailwind CSS 4 |
| 進捗保存 | localStorage |
| BGM・効果音 | Web Audio API によるリアルタイム合成（音声ファイル不要） |

バックエンド・ログイン機能はありません。進捗はブラウザ内にのみ保存されます。

## セットアップ

```bash
npm install
npm run dev      # 開発サーバー (http://localhost:5173)
npm run build    # dist/ へ本番ビルド
npm run preview  # ビルド結果の確認
```

サブパス配信（GitHub Pages など）の場合は `VITE_BASE=/legacy-quest/ npm run build` のように指定します。

## ディレクトリ構成

```
src/
├── main.jsx                 エントリポイント（AudioProviderでApp を包む）
├── App.jsx                  画面遷移・レベルアップ演出・BGM切り替え
├── data/                    ★コンテンツ（JSON）
│   ├── chapters.json          章・モンスター・COBOL例・問題
│   ├── skills.json            スキル4種の定義
│   ├── story.json             オープニングの各シーンとキャプション
│   ├── ui.json                XP設定・コードレインの語彙・賢者のセリフ
│   ├── bgm.json               BGM 4曲の譜面データ
│   └── sfx.json               効果音9種の定義
├── content/index.js         JSONの読み込み口（開発時は簡易バリデーション）
├── audio/
│   ├── AudioEngine.js         譜面JSON→Web Audioへの合成エンジン
│   ├── AudioProvider.jsx      React連携・音声設定の永続化
│   └── notes.js               音名→周波数
├── hooks/useGameProgress.js localStorageへの進捗保存と復元
├── lib/                     game.js（XP計算等）/ storage.js / theme.js
├── components/
│   ├── ui/                    ロゴ・コードレイン・演出パーツ・音声トグル
│   ├── characters/            賢者・モンスター（SVG）
│   ├── scenes/                オープニングの背景SVGとシーン登録表
│   ├── questions/             選択式・組み合わせ・並べ替えの出題UI
│   └── screens/               Intro / Home / Stage / 結果 / Victory
└── styles/index.css         Tailwind読み込みとゲーム内キーフレーム
```

## コンテンツの追加・編集

**問題や章を増やすときにJSXを触る必要はありません。** `src/data/*.json` を編集します。

### 章を追加する

`src/data/chapters.json` に要素を追加します。配列の順番がそのまま攻略順（前章クリアで解放）になります。

```jsonc
{
  "id": "ch5",
  "no": "第5章",
  "title": "章タイトル",
  "dungeon": "ダンジョン名",
  "emoji": "🔥",
  "skill": "syntax",           // skills.json のキー
  "monster": {
    "name": "モンスター名",
    "body": "#34d399",          // 本体色
    "accent": "#065f46",        // 影・角の色
    "eyes": 2,                  // 1 / 2 / 3
    "horns": false,
    "mood": "calm",             // calm / think / angry
    "square": false             // true で四角い体型
  },
  "intro": "賢者のセリフ",
  "cobol": "COBOLの例（\\n で改行）",
  "questions": [ /* 下記 */ ]
}
```

### 問題の3形式

| type | 説明 | 必要なキー |
| --- | --- | --- |
| `choice` | 4択 | `options`, `answer`（正解のindex） |
| `fill` | 穴埋め4択。Javaコードの `⬚` が空欄になる | `javaTemplate`, `options`, `answer` |
| `matching` | 左右の対応づけ | `pairs`（`left` / `right`） |
| `ordering` | 並べ替え。**配列の順序が正解** | `items` |

いずれも `id`（全問でユニーク）・`prompt`・`explanation`・`xp` が必要です。
`npm run dev` 中はコンソールでID重複や `answer` の範囲外を警告します。

### BGM・効果音を変える

譜面も JSON です。`src/data/bgm.json` の1曲は `bpm` / `loopBeats` と、次の3種のチャンネルで構成します。

- `tone` … 主旋律。`notes` は `["音名", 開始拍, 長さ拍]`
- `arp` … アルペジオ/ベース。`chords` の音を `rate` 拍ごとに循環させる
- `kit` … ドラム。`kick` / `snare` / `hat` を `at`（拍の配列）か `every`（等間隔）で指定

効果音は `src/data/sfx.json` に、`tones`（矩形波などの単音）と `noise`（フィルタ掃引付きノイズ）の重ね合わせで定義します。
BGMは画面ごとに切り替わります（タイトル / マップ / バトル / 勝利）。対応は `App.jsx` の `BGM_BY_SCREEN` です。

## 保存されるデータ

| キー | 内容 |
| --- | --- |
| `legacy-quest:progress` | XP・スキル・クリア済み章・正解済み問題ID・オープニング視聴済み |
| `legacy-quest:audio` | BGM/効果音のオンオフ、音量 |

再訪時はオープニングを飛ばしてマップから再開します。マップ下部の「進捗をリセットして最初から」で消去できます。
同じ問題に再挑戦してもXPは二重に加算されません。

## 補足

- ブラウザの自動再生制限のため、**最初のクリック/キー操作までは音が鳴りません**（仕様）。
- `prefers-reduced-motion` が有効な環境ではアニメーションを停止します。
- 元になった単一ファイルの試作版は [`docs/prototype/legacy-quest.jsx`](docs/prototype/legacy-quest.jsx) に残しています（現在はビルド対象外）。
