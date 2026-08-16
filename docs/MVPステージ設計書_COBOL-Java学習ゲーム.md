# MVPステージ設計書：COBOL→Java モダナイズ学習ゲーム（v0.2）

作成日：2026-08-04
更新日：2026-08-16（実装済みデータ形式と画面演出を追記）
対象：MVP（全4章 各1ステージ）
前提：要件定義書 v0.2 に準拠（移行元＝IBM Enterprise COBOL標準構文／移行先＝Spring Batch・Spring Boot）

各ステージは4〜7問の設問で構成する。すべて選択操作。
正解には ✓ を付す。JSONはそのまま実装データとして利用できる形式。

---

## 実装ステータス

本設計の全4章・全23問は `src/data/chapters.json` に実装済み。基本問題に加え、REDEFINES、OCCURS、FILLER、COPY句、サブルーチン、外字、COMP-3内部表現、日本語EBCDIC、SBCS／DBCS、SI/SOを扱う。実装では画面コンポーネントが扱いやすいよう、以下の名称へ正規化している。

| 設計書 | 実装JSON | 備考 |
| --- | --- | --- |
| `fill_blank_choice` | `fill` | `javaTemplate` 内の `⬚` を選択肢で補完 |
| `xpReward` | `xp` | 正解時の獲得XP |
| `chapterId` / `stageId` | 章の `id` / 問題の `id` | MVPは各章1ステージのため階層を簡略化 |

ステージ開始前には章専用背景を使った突入・遭遇演出を表示し、問題プールから最大5問をランダム出題する。回答ごとにボスHP、正誤エフェクト、コンボ、XP獲得、問題別回答履歴を更新し、セッション終了後は章クリア画面へ遷移する。全章は最初から選択でき、誤答した問題には復習クエストから再挑戦できる。学習レポートではトピック別の理解度・回答範囲・累計正答率を表示し、任意のトピックだけを特訓できる。

---

## 共通データ仕様（設問タイプ）

- `fill_blank_choice`：コードの空欄に入る記述を選択肢から選ぶ
- `choice`：正しい説明・判断を選択肢から選ぶ
- `matching`：左右の対応を選んでつなぐ（`pairs` が正解の組）
- `ordering`：正しい順序に並べる（`items` を正しい順で保持、実行時にシャッフル表示）
- 全形式共通：`topic`（学習テーマ）と `difficulty`（初級・中級・上級・実践）を保持
- 全形式共通：`migrationTip` にJava移行時の実務ポイントを保持
- 選択式・穴埋め：`wrongReasons` に各選択肢が誤りである理由を保持し、選択肢と一緒にシャッフル
- 対応付け・並べ替え：`wrongReason` に典型的な誤りの考え方を保持

---

## 第1章「ことばを覚える」：MOVE文と型の対応

- moduleType：batch
- 学習目標：MOVEが代入であること、PIC句とJava型の対応を理解する
- スキル：syntax

### 表示するCOBOL
```cobol
       WORKING-STORAGE SECTION.
       01 WS-NAME   PIC X(10).
       01 WS-COUNT  PIC 9(3).

       MOVE 'HELLO' TO WS-NAME.
       MOVE 100     TO WS-COUNT.
```

### 設問
**Q1（fill_blank_choice）** `MOVE 'HELLO' TO WS-NAME.` に対応するJava：`String wsName = ___;`
- ✓ `"HELLO"`
- `'HELLO'`
- `HELLO`
- `new String(HELLO)`

解説：MOVEは代入。Javaでは `=` を使い、文字列はダブルクォートで囲む。COBOLはシングルクォートも使えるが、Javaの文字列は必ず `" "`。

**Q2（choice）** `WS-COUNT PIC 9(3)` に最も適したJavaの型は？
- ✓ `int`
- `String`
- `double`
- `boolean`

解説：`PIC 9(n)` は数字のみの項目なので整数型（int等）が対応。`PIC X(n)` は文字なのでString。

**Q3（matching）** COBOLのPIC句とJava型を対応づけよ
- `PIC X(10)` ↔ ✓ `String`
- `PIC 9(3)` ↔ ✓ `int`
- `PIC S9(7)V99 COMP-3` ↔ ✓ `BigDecimal`

解説：文字はString、整数はint、小数を含む金額などのCOMP-3はBigDecimal（第4章で詳しく扱う）。

### JSON
```json
{
  "chapterId": "ch1",
  "stageId": "ch1-s1",
  "moduleType": "batch",
  "title": "ことばを覚える：MOVEと型",
  "skill": "syntax",
  "cobol": "01 WS-NAME  PIC X(10).\n01 WS-COUNT PIC 9(3).\nMOVE 'HELLO' TO WS-NAME.\nMOVE 100 TO WS-COUNT.",
  "questions": [
    {
      "id": "ch1-s1-q1",
      "type": "fill_blank_choice",
      "prompt": "MOVE 'HELLO' TO WS-NAME. に対応するJava",
      "javaTemplate": "String wsName = ___;",
      "options": ["\"HELLO\"", "'HELLO'", "HELLO", "new String(HELLO)"],
      "answerIndex": 0,
      "explanation": "MOVEは代入。Javaは = を使い、文字列は \" \" で囲む。",
      "xpReward": 10
    },
    {
      "id": "ch1-s1-q2",
      "type": "choice",
      "prompt": "WS-COUNT PIC 9(3) に最も適したJavaの型は？",
      "options": ["int", "String", "double", "boolean"],
      "answerIndex": 0,
      "explanation": "PIC 9(n) は数字項目なので整数型。PIC X(n) は文字なのでString。",
      "xpReward": 10
    },
    {
      "id": "ch1-s1-q3",
      "type": "matching",
      "prompt": "PIC句とJava型を対応づけよ",
      "pairs": [
        {"left": "PIC X(10)", "right": "String"},
        {"left": "PIC 9(3)", "right": "int"},
        {"left": "PIC S9(7)V99 COMP-3", "right": "BigDecimal"}
      ],
      "explanation": "文字はString、整数はint、金額などのCOMP-3はBigDecimal。",
      "xpReward": 15
    }
  ]
}
```

---

## 第2章「構造を読み解く」：バッチをSpring Batchに分解

- moduleType：batch
- 学習目標：COBOLバッチの「読む・加工する・書く」をSpring Batchの Reader / Processor / Writer に対応づける
- スキル：design

### 表示するCOBOL
```cobol
       PERFORM UNTIL WS-EOF = 'Y'
           READ IN-FILE
               AT END     MOVE 'Y' TO WS-EOF
               NOT AT END PERFORM CALC-TAX
                          WRITE OUT-REC
           END-READ
       END-PERFORM.
```

### 設問
**Q1（matching）** バッチの役割をSpring Batchの部品に対応づけよ
- 入力ファイルを1件読む ↔ ✓ `ItemReader`
- 1件を加工する（税計算） ↔ ✓ `ItemProcessor`
- 結果を書き出す ↔ ✓ `ItemWriter`
- COMMIT（まとめて確定）の単位 ↔ ✓ `chunkサイズ`

解説：Spring Batchはchunk指向。1件ずつReaderで読み、Processorで加工し、chunkサイズ分をまとめてWriterで書き出し・確定する。

**Q2（choice）** `CALC-TAX`（1レコードごとに税を計算して金額を書き換える処理）は、Spring Batchのどこに置くのが適切？
- ✓ `ItemProcessor`
- `ItemReader`
- `ItemWriter`
- `JobLauncher`

解説：入力を受け取り加工して次へ渡す処理はProcessorの役割。

**Q3（ordering）** Spring Batchのchunk指向処理の流れを正しい順に並べよ
1. ✓ Readerで1件読む
2. ✓ Processorで加工する
3. ✓ chunkサイズに達したらWriterでまとめて書き出す
4. ✓ トランザクションを確定（commit）する

解説：read→process を chunk サイズ分繰り返し、まとめて write して commit するのが基本サイクル。

### JSON
```json
{
  "chapterId": "ch2",
  "stageId": "ch2-s1",
  "moduleType": "batch",
  "title": "構造を読み解く：バッチをSpring Batchへ",
  "skill": "design",
  "cobol": "PERFORM UNTIL WS-EOF = 'Y'\n  READ IN-FILE\n    AT END MOVE 'Y' TO WS-EOF\n    NOT AT END PERFORM CALC-TAX\n               WRITE OUT-REC\n  END-READ\nEND-PERFORM.",
  "questions": [
    {
      "id": "ch2-s1-q1",
      "type": "matching",
      "prompt": "バッチの役割をSpring Batchの部品に対応づけよ",
      "pairs": [
        {"left": "入力ファイルを1件読む", "right": "ItemReader"},
        {"left": "1件を加工する（税計算）", "right": "ItemProcessor"},
        {"left": "結果を書き出す", "right": "ItemWriter"},
        {"left": "COMMITの単位", "right": "chunkサイズ"}
      ],
      "explanation": "Spring Batchはchunk指向。read→process→（chunk分まとめて）writeの流れ。",
      "xpReward": 15
    },
    {
      "id": "ch2-s1-q2",
      "type": "choice",
      "prompt": "1レコードごとに税を計算して書き換える処理を置く場所は？",
      "options": ["ItemProcessor", "ItemReader", "ItemWriter", "JobLauncher"],
      "answerIndex": 0,
      "explanation": "入力を受け取り加工して次へ渡すのはProcessorの役割。",
      "xpReward": 10
    },
    {
      "id": "ch2-s1-q3",
      "type": "ordering",
      "prompt": "chunk指向処理の流れを正しい順に並べよ",
      "items": [
        "Readerで1件読む",
        "Processorで加工する",
        "chunkサイズに達したらWriterでまとめて書き出す",
        "トランザクションを確定（commit）する"
      ],
      "explanation": "read→processをchunk分繰り返し、まとめてwriteしてcommitする。",
      "xpReward": 15
    }
  ]
}
```

---

## 第3章「計画を立てる」：移行工程の並べ替え

- moduleType：（プロセス全体のため指定なし）
- 学習目標：移行の標準工程の順序と、段階的移行（リスク低減）の考え方を理解する
- スキル：process

### シナリオ（表示テキスト）
> 巨大なCOBOL基幹システムをJavaへ移行することになった。何から手をつける？

### 設問
**Q1（ordering）** 移行工程を正しい順に並べよ
1. ✓ 現状分析（資産の棚卸し・依存関係の把握）
2. ✓ 移行方針の決定（どう変換するか、範囲を決める）
3. ✓ 変換（Javaへの実装）
4. ✓ テスト（旧システムと結果を突き合わせる）
5. ✓ 本番切替

解説：まず「今あるものを知る」ことから始め、方針を決めてから変換・テスト・切替へ進む。

**Q2（choice）** COBOL資産の量や、プログラム間の依存関係を把握するのはどの工程？
- ✓ 現状分析（棚卸し）
- テスト
- 本番切替
- 変換

解説：規模と依存を把握しないと方針も見積もりも立てられない。移行の土台となる工程。

**Q3（choice）** 大規模システムでリスクを抑える移行の進め方として適切なのは？
- ✓ 機能やモジュールを一部ずつ移行し、都度検証しながら進める
- すべてを一度に作り替えて一斉に切り替える
- テストは本番切替の後にまとめて行う
- ドキュメントは作らず記憶を頼りに進める

解説：一度に全部を置き換える方式（ビッグバン）はリスクが高い。一部ずつ移して検証を重ねる段階的移行が安全。

### JSON
```json
{
  "chapterId": "ch3",
  "stageId": "ch3-s1",
  "moduleType": null,
  "title": "計画を立てる：移行の工程",
  "skill": "process",
  "scenario": "巨大なCOBOL基幹システムをJavaへ移行する。何から手をつける？",
  "questions": [
    {
      "id": "ch3-s1-q1",
      "type": "ordering",
      "prompt": "移行工程を正しい順に並べよ",
      "items": [
        "現状分析（資産の棚卸し・依存関係の把握）",
        "移行方針の決定",
        "変換（Javaへの実装）",
        "テスト（旧システムと結果を突き合わせ）",
        "本番切替"
      ],
      "explanation": "現状把握→方針決定→変換→テスト→切替の順で進める。",
      "xpReward": 15
    },
    {
      "id": "ch3-s1-q2",
      "type": "choice",
      "prompt": "資産の量や依存関係を把握する工程は？",
      "options": ["現状分析（棚卸し）", "テスト", "本番切替", "変換"],
      "answerIndex": 0,
      "explanation": "規模と依存を把握しないと方針も見積もりも立たない、移行の土台。",
      "xpReward": 10
    },
    {
      "id": "ch3-s1-q3",
      "type": "choice",
      "prompt": "大規模システムでリスクを抑える進め方は？",
      "options": [
        "一部ずつ移行し、都度検証しながら進める",
        "すべてを一度に作り替えて一斉切替する",
        "テストは本番切替の後にまとめて行う",
        "ドキュメントは作らず記憶で進める"
      ],
      "answerIndex": 0,
      "explanation": "ビッグバン移行はリスクが高い。段階的移行＋検証が安全。",
      "xpReward": 15
    }
  ]
}
```

---

## 第4章「現場の罠」：COMP-3（パック10進）とBigDecimal

- moduleType：batch
- 学習目標：金額のCOMP-3をBigDecimalで扱う理由と、`new BigDecimal(double)` の落とし穴を理解する
- スキル：practice

### 表示するCOBOL
```cobol
       01 WS-AMOUNT  PIC S9(7)V99 COMP-3.
       ...
       COMPUTE WS-AMOUNT = WS-PRICE * WS-QTY.
```

### 設問
**Q1（choice）** `WS-AMOUNT PIC S9(7)V99 COMP-3`（符号付き・小数2桁の金額）をJavaで正確に扱う型は？
- ✓ `BigDecimal`
- `double`
- `float`
- `int`

解説：COMP-3は10進の値を正確に保持する。金額計算で誤差を出さないにはBigDecimalが適切。

**Q2（choice）** 金額計算に `double` を使うと何が問題か？
- ✓ 2進浮動小数点は10進の小数を正確に表せず、丸め誤差が生じる
- COBOLより計算が遅くなるだけで結果は正確
- 負の数を扱えない
- 桁数の上限がなく無限にメモリを使う

解説：`0.1 + 0.2` が `0.3` にならないように、doubleは10進小数を正確に表現できない。金額では致命的。

**Q3（choice）** 金額 123.45 を誤差なく生成するJavaはどれ？
- ✓ `new BigDecimal("123.45")`
- `new BigDecimal(123.45)`
- `(BigDecimal) 123.45`
- `new BigDecimal(123.45f)`

解説：**落とし穴**。`new BigDecimal(123.45)` は引数がdoubleのため、その時点で誤差を持ち込む。文字列で渡す `new BigDecimal("123.45")`（または `BigDecimal.valueOf(123.45)`）が正しい。

### JSON
```json
{
  "chapterId": "ch4",
  "stageId": "ch4-s1",
  "moduleType": "batch",
  "title": "現場の罠：COMP-3とBigDecimal",
  "skill": "practice",
  "cobol": "01 WS-AMOUNT PIC S9(7)V99 COMP-3.\nCOMPUTE WS-AMOUNT = WS-PRICE * WS-QTY.",
  "questions": [
    {
      "id": "ch4-s1-q1",
      "type": "choice",
      "prompt": "COMP-3の金額をJavaで正確に扱う型は？",
      "options": ["BigDecimal", "double", "float", "int"],
      "answerIndex": 0,
      "explanation": "COMP-3は10進を正確に保持。金額はBigDecimalで扱う。",
      "xpReward": 10
    },
    {
      "id": "ch4-s1-q2",
      "type": "choice",
      "prompt": "金額計算にdoubleを使う問題は？",
      "options": [
        "2進浮動小数点は10進小数を正確に表せず丸め誤差が出る",
        "計算が遅いだけで結果は正確",
        "負の数を扱えない",
        "桁数上限がなく無限にメモリを使う"
      ],
      "answerIndex": 0,
      "explanation": "0.1+0.2が0.3にならないように、doubleは10進小数を正確に表せない。",
      "xpReward": 15
    },
    {
      "id": "ch4-s1-q3",
      "type": "choice",
      "prompt": "金額 123.45 を誤差なく生成するのは？",
      "options": [
        "new BigDecimal(\"123.45\")",
        "new BigDecimal(123.45)",
        "(BigDecimal) 123.45",
        "new BigDecimal(123.45f)"
      ],
      "answerIndex": 0,
      "explanation": "double引数のコンストラクタは誤差を持ち込む。文字列で渡すのが正解。",
      "xpReward": 20
    }
  ]
}
```

---

## 次のステップ
- この4ステージでMVPのコンテンツが揃う（合計23問）。
- プロトタイプ（第1章のコアループ）→ 全4章通しプレイ、の順で実装へ。
- 演出・図鑑・キャラクター等は拡充フェーズで追加。
