# OG画像（SNSシェア用サムネイル）配置ガイド

このディレクトリには、各記事用の OG画像（Open Graph 画像）を配置します。

## 推奨仕様

| 項目 | 値 |
|---|---|
| サイズ | **1200 × 630 px** (1.91:1 比率) |
| 形式 | PNG または JPEG |
| ファイルサイズ | 300KB 以下推奨 |
| ファイル名 | 記事の slug と同じ（例: `altstore-pal-guide.png`） |

## 配置済みの想定ファイル名

各記事 MDX で `ogImage` prop を指定すると、その画像が OG タグの `og:image` として使われます。以下のファイルを用意してください（slug = 記事URL末尾）：

- `altstore-pal-guide.png`
- `altstore-pal-apps.png`
- `alternative-marketplace.png`
- `top3-apps-2026.png`
- `delta-utm-guide.png`
- `install-app-step-by-step.png`
- `epic-games-store-japan.png`
- `what-is-sideloading.png`
- `faq.png`

（全記事分を作成する必要はなく、重要なものから順に用意すればOK）

## フォールバック

`ogImage` prop が未指定の記事は、`/assets/img/logo.png` が使われます（`BaseLayout.astro` のデフォルト）。

## デザインのヒント

- 記事タイトルを大きく表示（48-72px）
- サイト名「bunchoniki Store」をロゴとして右下に
- 記事カテゴリに応じた色（青=ガイド、緑=安全性、オレンジ=経済、紫=アプリ）
- Twitter/X の summary_large_image で綺麗に表示される構図にする

## 使い方（記事MDX側）

```mdx
---
<ArticleLayout
  title={title}
  h1={h1}
  description={description}
  ogImage="/assets/og/altstore-pal-guide.png"
>
```
