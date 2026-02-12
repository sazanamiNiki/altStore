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

## ファイル構成

```
altStore-jp/
├── src/
│   ├── components/            # Astroコンポーネント
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── StatusBar.astro
│   │   ├── Accordion.astro
│   │   ├── AccordionGroup.astro
│   │   ├── Card.astro
│   │   ├── CardGrid.astro
│   │   ├── InfoBox.astro
│   │   ├── Section.astro
│   │   ├── Step.astro
│   │   ├── StepList.astro
│   │   ├── MethodCard.astro
│   │   └── RelatedArticles.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro   # 基本レイアウト
│   │   └── ArticleLayout.astro # 記事レイアウト（h1 props対応）
│   ├── pages/
│   │   ├── index.astro        # トップページ
│   │   ├── apps.astro         # アプリカタログ
│   │   └── articles/
│   │       ├── index.astro    # 記事一覧
│   │       ├── [slug].astro   # 動的ルート（未使用）
│   │       └── *.mdx          # 各記事（17ファイル）
│   ├── content/
│   │   └── config.ts          # Content Collections定義（現在未使用）
│   └── styles/
│       └── global.css         # グローバルスタイル（Tailwind）
├── public/
│   └── assets/
│       ├── js/                # クライアントサイドJS
│       ├── img/               # 画像・ロゴ
│       └── data/apps.json     # アプリメタデータ
├── tools/
│   ├── extract_sections.py    # セクション抽出スクリプト
│   ├── extract_article_text.py
│   ├── generate_article_html.py
│   ├── update_design.py
│   └── README.md
├── .claude/
│   ├── rule/
│   │   ├── articles_style_guide.md  # 記事スタイルガイド
│   │   └── article_sections.md      # セクション管理ルール
│   ├── mcp.json
│   └── settings.local.json
├── astro.config.mjs           # Astro設定
├── tailwind.config.mjs        # Tailwind設定
├── package.json
└── CLAUDE.md                  # このファイル
```

## 編集ルール

記事ページ（`src/pages/articles/*.mdx`）の編集・作成ルールは `./.claude/rule/articles_style_guide.md` を参照してください。

主なポイント：
- Tailwind CSSベースの統一デザイン
- **アイコン**: 原則として絵文字ではなくMaterial Symbols Outlined（MUI）のアイコンを色付きで使用
- 青・黄・緑のカラースキーム
- 導入セクション→メインコンテンツ→よくある質問→まとめの構成
- 記事はMDX形式で記述し、`src/components/` のAstroコンポーネントを活用する
- **セクション属性**: 全セクションに `id` と `data-section` 属性を付与（トークン消費削減のため）

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

詳細な編集ルールは `./.claude/rule/articles_style_guide.md` を参照してください。
