# LEGACY QUEST 〜COBOLからJavaへ〜

COBOL技術者がJavaへの移行スキルを学ぶ、RPG風のブラウザ学習ゲームです。
ダンジョン（章）の主を倒しながら、COBOLの巻物をJavaへ読み替えていきます。

オープニングからマップ、4章のボス戦、最終勝利画面まで、丸みのある2DファンタジーRPGの世界観で統一しています。4章合計28問の問題プールから、選択・穴埋め・対応付け・並べ替え形式の問題に挑戦し、XPと4種類のスキルを成長させます。REDEFINES、OCCURS、外字、日本語EBCDICなど、移行現場で問題になりやすい論点も扱います。

![LEGACY QUESTの章選択マップ](src/assets/game/map.webp)

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
| ビジュアル | WebP背景画像 + SVGキャラクター + CSSアニメーション |

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
├── assets/
│   ├── opening/               オープニング用イラスト5枚
│   └── game/                  マップ・4章・勝利画面の背景6枚（WebP）
├── data/                    ★コンテンツ（JSON）
│   ├── chapters.json          章・モンスター・COBOL例・問題
│   ├── skills.json            スキル4種の定義
│   ├── story.json             オープニングの各シーンとキャプション
│   ├── ui.json                XP設定・コードレインの語彙・賢者のセリフ
│   ├── bgm.json               BGM 4曲の譜面データ
│   └── sfx.json               効果音9種の定義
├── content/
│   ├── index.js               JSONの読み込み口（開発時は簡易バリデーション）
│   ├── openingImages.js       オープニング画像の登録・事前読み込み
│   └── gameImages.js          本編背景画像の登録
├── audio/
│   ├── AudioEngine.js         譜面JSON→Web Audioへの合成エンジン
│   ├── AudioProvider.jsx      React連携・音声設定の永続化
│   └── notes.js               音名→周波数
├── hooks/useGameProgress.js localStorageへの進捗保存と復元
├── lib/                     game.js（XP計算等）/ storage.js / theme.js
├── components/
│   ├── ui/                    ロゴ・背景・光粒子・衝撃・音声トグル
│   ├── characters/            賢者・モンスター（SVG）
│   ├── scenes/                オープニングの背景SVGとシーン登録表
│   ├── questions/             選択式・組み合わせ・並べ替えの出題UI
│   └── screens/               Intro / TitleFlight / Home / Stage / 結果 / Victory
└── styles/index.css         Tailwind読み込み、RPG共通UI、キーフレーム
```

## ゲームの流れ

1. 初回起動時に開始ゲート、物語、タイトル演出を再生
2. マップで好きな章を選択（全章を最初から選択可能）
3. ダンジョンへ突入し、章ごとのボスと遭遇
4. 問題プールからランダムに選ばれた最大5問に回答してボスのHPを減らす
5. 章クリアでXP・スキルを獲得
6. 間違えた問題はマップの「復習クエスト」から再挑戦
7. 「学習レポート」でトピック別・難易度別の理解度を確認し、分野や初級・中級・上級・実践を指定して特訓
8. 全4章クリアで最終勝利画面を表示

## オープニング

映画のオープニングを意識した5シーン構成です。初回のみ再生され、2回目以降はマップから始まります。

| 幕 | 実装 | 内容 |
| --- | --- | --- |
| 開始ゲート | `screens/IntroGate.jsx` | 雲海の中でタップを待つ。ここで音を鳴らす許可を得る |
| 物語 | `screens/Intro.jsx` | `story.json` の5シーンをイラストと字幕で送る |
| タイトル飛来 | `screens/TitleFlight.jsx` | 雲の奥からロゴが飛来し、稲妻とともに着地する |

演出の中身：

- **背景イラスト**（`assets/opening/*`）… 王国、世界、亀裂、危機、旅立ちの5場面を本編と同じ2Dゲームイラストで描画し、事前読み込みで切り替え時のちらつきを抑える
- **背景フォールバック**（`components/scenes/`）… 画像を利用できない場合もSVGシーンを表示する
- **火の粉**（`ui/Embers.jsx`）… 金色の粒がゆらぎながら舞い上がる
- **ロゴ飛来** … 遠方から `translateZ(-2600px)` で迫り、着地でグローが焼き切れて金属質が残る
- **音楽** … ホ短調・3拍子のチェレスタのワルツ（`bgm.json` の `title`）

タイミングの調整箇所：

- 1シーンの表示時間 → `src/data/story.json` の `sceneDurationMs`
- ロゴの飛来・着地・ボタン出現 → `TitleFlight.jsx` 冒頭の `FLIGHT_MS` / `IMPACT_MS` / `CTA_MS`

`prefers-reduced-motion` が有効な環境では、これらのアニメーションは自動的に停止します。

## 本編のビジュアルと演出

- `assets/game/map.webp`：章選択マップの背景
- `assets/game/battle-ch1.webp`〜`battle-ch4.webp`：各章のテーマに対応するダンジョン背景
- `assets/game/victory.webp`：全章クリア後の背景
- `GameBackdrop.jsx`：背景の視差移動、色付きオーラ、上昇するルーンを共通管理
- `styles/index.css`：RPGパネル、クエストカード、ボスHP、回答カード、勝利光線などを共通スタイル化
- 回答時のフラッシュ、画面振動、ノックバック、コンボ、XP上昇、レベルアップ演出を実装

画像は装飾目的で、ゲーム進行や問題データには依存しません。BGMと効果音は個別に無効化でき、アニメーションはOS／ブラウザの視差効果を減らす設定に従います。

## コンテンツの追加・編集

**問題や章を増やすときにJSXを触る必要はありません。** `src/data/*.json` を編集します。

### 章を追加する

`src/data/chapters.json` に要素を追加します。全章は最初から選択でき、配列の順番が推奨攻略順になります。

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

### 問題の4形式

| type | 説明 | 必要なキー |
| --- | --- | --- |
| `choice` | 4択 | `options`, `answer`（正解のindex） |
| `fill` | 穴埋め4択。Javaコードの `⬚` が空欄になる | `javaTemplate`, `options`, `answer` |
| `matching` | 左右の対応づけ | `pairs`（`left` / `right`） |
| `ordering` | 並べ替え。**配列の順序が正解** | `items` |

いずれも `id`（全問でユニーク）・`topic`・`difficulty`・`prompt`・`explanation`・`migrationTip`・`xp` が必要です。`difficulty` は `beginner` / `intermediate` / `advanced` / `practical` のいずれかです。選択式・穴埋めでは `options` と同じ長さの `wrongReasons`、対応付け・並べ替えでは `wrongReason` も設定します。
問題固有のCOBOL定義、16進バイト列、依存関係を見せる場合は `code` を追加します。未指定時は章共通の `cobol` が表示されます。
通常ステージでは章の問題プールから最大5問を選び、選択式・穴埋めの選択肢と誤答理由を対応させたまま毎回並べ替えます。回答後は正誤理由、全体解説、Java移行の実務ポイントを表示します。`npm run dev` 中はID重複、解説データを含むメタデータ不足、`answer` の範囲外を警告します。

実務形式の問題では、EBCDICのSI/SO区間、COMP-3の16進表現、FILLERを含む固定長offset、REDEFINESのレコード種別、COPY句を含む依存グラフを実データから判断します。

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
| `legacy-quest:progress` | XP・スキル・クリア済み章・正解済み問題ID・苦手問題ID・問題別回答履歴・オープニング視聴済み |
| `legacy-quest:audio` | BGM/効果音のオンオフ、音量 |

再訪時はオープニングを飛ばしてマップから再開します。マップ下部の「進捗をリセットして最初から」で消去できます。
同じ問題に再挑戦してもXPは二重に加算されません。誤答した問題は苦手リストへ追加され、通常プレイまたは復習クエストで正解するとリストから外れます。
回答履歴は問題ごとの挑戦回数・正解回数・最後の正誤を保持します。学習レポートでは最後に正解した問題の割合を「理解度」、全試行に対する正解の割合を「累計正答率」として表示します。トピックだけでなく、初級・中級・上級・実践の難易度を選び、そのレベルの問題だけをまとめて学習できます。

## 補足

- ブラウザの自動再生制限のため、最初のユーザー操作までは音を鳴らせません。
  オープニングが無音で流れてしまわないよう、冒頭に開始ゲートを置いています。
- `prefers-reduced-motion` が有効な環境ではアニメーションを停止します。
- BGMは自作です（既存楽曲の複製は含みません）。
- 元になった単一ファイルの試作版は [`docs/prototype/legacy-quest.jsx`](docs/prototype/legacy-quest.jsx) に残しています（現在はビルド対象外）。
