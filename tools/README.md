# 記事セクション抽出ツール

## 概要

このツールは、記事HTMLファイルから特定のセクションのみを抽出し、トークン消費を削減するために作成されました。

## 必要な環境

- Python 3.7以上（標準ライブラリのみ使用）

## セクションの種類

記事HTMLには以下のセクションが定義されています：

| セクション | 説明 |
|-----------|------|
| `header` | 記事のタイトルとサブタイトル |
| `intro` | 導入セクション（青背景） |
| `content` | メインコンテンツブロック（複数の場合あり） |
| `faq` | よくある質問 |
| `summary` | まとめ |
| `recommendation` | おすすめ記事 |
| `metadata` | 最終更新日などのメタ情報 |

## 使用方法

### 1. セクション一覧の表示

記事ファイルに含まれるセクションを確認：

```bash
python3 tools/extract_sections.py articles/what-is-sideloading.html --list
```

出力例：
```
articles/what-is-sideloading.html のセクション一覧:

ID                             data-section         data-content-type
======================================================================
article-header                 header
article-intro                  intro
article-content-1              content              definition
article-content-2              content              benefits
article-content-3              content              risks
article-content-4              content              responsibility
article-summary                summary
article-recommendation         recommendation
article-metadata               metadata
```

### 2. 特定のセクションを抽出

#### テキスト形式で抽出（デフォルト）

```bash
python3 tools/extract_sections.py articles/what-is-sideloading.html --sections header intro
```

#### マークダウン形式で抽出

```bash
python3 tools/extract_sections.py articles/what-is-sideloading.html --sections content summary --format markdown
```

#### HTML形式で抽出

```bash
python3 tools/extract_sections.py articles/what-is-sideloading.html --sections summary --format html
```

### 3. ファイルに出力

```bash
python3 tools/extract_sections.py articles/what-is-sideloading.html --sections summary --output summary.txt
```

### 4. 複数セクションの抽出

```bash
python3 tools/extract_sections.py articles/what-is-sideloading.html --sections header intro content summary
```

## 実用例

### Claude Codeでの活用

記事を編集する際に、必要なセクションだけを読み込んでトークンを節約：

```bash
# まとめセクションだけを確認
python3 tools/extract_sections.py articles/what-is-sideloading.html --sections summary --format text

# メインコンテンツのみを確認
python3 tools/extract_sections.py articles/what-is-sideloading.html --sections content --format markdown
```

### 記事の構造確認

すべての記事のセクション構造を一覧表示：

```bash
for file in articles/*.html; do
  echo "=== $file ==="
  python3 tools/extract_sections.py "$file" --list
  echo ""
done
```

## オプション

| オプション | 短縮形 | 説明 |
|-----------|-------|------|
| `--sections` | `-s` | 抽出するセクションタイプ（複数指定可） |
| `--format` | `-f` | 出力形式（`html`, `text`, `markdown`） |
| `--output` | `-o` | 出力ファイルパス |
| `--list` | `-l` | セクション一覧を表示 |

## トラブルシューティング

### セクションが見つからない

記事ファイルにセクション属性（`id`と`data-section`）が付与されているか確認してください。

付与されていない場合は、`./.claude/rule/article_sections.md`のルールに従ってセクション属性を追加してください。

### Material Symbols アイコンが表示される

`--format text`や`--format markdown`を使用した場合、HTMLタグは除去されますが、Material Symbolsのアイコン名（例：`smartphone`、`help_outline`）がテキストとして残ります。これは仕様です。

## 関連ドキュメント

- セクション分類ルール: `./.claude/rule/article_sections.md`
- 記事スタイルガイド: `./.claude/rule/articles_style_guide.md`
