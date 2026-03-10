# altStore-jp - サイドローディングの総合情報サイト

このプロジェクトは、iPhoneのサイドローディングツール（AltStore、SideStore等）の使い方、法的側面、安全性に関する日本語情報を集約したWebサイトです。

## 概要

- **目的**: サイドローディングに関する正確で分かりやすい日本語情報を提供
- **対象ユーザー**: iPhoneユーザー、開発者、セキュリティに関心のある人
- **主なコンテンツ**:
  - AltStore/SideStore等のセットアップガイド
  - サイドローディングの技術解説
  - 法的・セキュリティ面での安全性情報
  - ユースケース別のアプリ紹介

## プロジェクト構成

詳細は @.claude/rules/project-map.md を参照。

## 編集ルール

### デザイン・レスポンシブ規約

**UI・レスポンシブ設計のルールは `./.claude/rules/design.md` を参照してください。**

- **モバイルファースト**: padding/margin/font-size は必ず `sm:` プレフィックス付きのレスポンシブ値を併記
- 固定値ベタ書き（`p-8`, `text-4xl` 等）は禁止。必ず `p-4 sm:p-8` のように記述
- `border-gray-100` は白背景で視認不可のため禁止。`border-gray-200` 以上を使用
- 見出しのflex配置は `items-center` ではなく `items-start` + アイコンに `flex-shrink-0`

### 記事スタイルガイド

記事ページ（`src/pages/articles/*.mdx`）の編集・作成ルールは `./.claude/rules/articles_style_guide.md` を参照してください。

主なポイント：
- Tailwind CSSベースの統一デザイン
- **アイコン**: 原則として絵文字ではなくMaterial Symbols Outlined（MUI）のアイコンを色付きで使用
- 青・黄・緑のカラースキーム
- 導入セクション→メインコンテンツ→よくある質問→まとめの構成
- 記事はMDX形式で記述し、`src/components/` のAstroコンポーネントを活用する
- **セクション属性**: 全セクションに `id` と `data-section` 属性を付与（トークン消費削減のため）

### 画像使用ガイド

記事・コンポーネントで画像を使用する際のルールは `./.claude/rules/image-usage-guide.md` を参照してください。

主なポイント：
- **画像配置**: すべての画像は `src/assets/images/` に配置
- **自動最適化**: Astroの`<Image />`コンポーネントで自動的にWebP形式に変換
- **記事での使用**: 画像をインポートして使用（インポート形式推奨）
- **最適化設定**: `format="webp"` / `quality={85}` を推奨

### 記事レビュー（必須）

**記事の作成・編集後は、必ず `article-reviewer` サブエージェントを実行してください。**

サブエージェント定義: `.claude/agents/article-reviewer.md`

呼び出し方法：
```
article-reviewer サブエージェントを使って [記事ファイルパス] をレビューしてください
```

または Task ツールで直接呼び出し：
```
subagent_type: "article-reviewer"
prompt: "[記事ファイルパス] をレビューしてください"
```

**特徴:**
- **model: haiku** でコスト削減（1記事あたり約1円以下）
- 読み取り専用（Read, Glob, Grep のみ）
- スタイルガイドのチェックリストを自動検証

**重要**: レビュー結果が「要修正」の場合、修正を行い再度レビューを実行すること。

## 技術スタック

- Astro 4.16 + MDX（静的サイト生成）
- Tailwind CSS 3.4（`@astrojs/tailwind`）
- TypeScript（型安全）
- Material Symbols Outlined（アイコン）
- Python 3.7+（セクション抽出ツール）

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド（dist/ に出力）
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 記事のフロントマター

各MDX記事の先頭に以下のフロントマターを記述してください：

```mdx
---
title: "記事タイトル"
description: "記事の説明（SEO用）"
date: "2026-01-01"
icon: "shield"
iconColor: "text-blue-500"
---
```

## デプロイフロー

ユーザーから「作業内容を反映してください」と指示された場合、以下の手順を実行してください：

1. **変更をコミット**
   - 変更ファイルをステージング（`git add`）
   - 適切なコミットメッセージで変更をコミット
   - コミットメッセージには `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>` を含める

2. **developブランチにマージ**
   - `git checkout develop`
   - `git merge master`（または作業ブランチをマージ）
   - `git push origin develop`

3. **PRを作成してマージ**
   - `gh pr create --base master --head develop` でPRを作成
   - `gh pr merge [PR番号] --merge` でマージ
   - マージ後、`git checkout master && git pull origin master` で最新を取得

**注意**: この一連の流れを自動で実行してください。途中で確認を求める必要はありません。

---

詳細な編集ルールは `./.claude/rules/articles_style_guide.md` を参照してください。
