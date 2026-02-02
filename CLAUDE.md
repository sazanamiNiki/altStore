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
├── index.html              # トップページ
├── articles/               # 記事ページ（HTML）
├── assets/
│   ├── css/               # スタイルシート
│   ├── js/                # JavaScriptコンポーネント
│   └── img/               # 画像・ロゴ
├── .claude/
│   ├── rule/              # Claude用編集ルール
│   ├── docments/          # 記事仕様書
│   └── settings.local.json
└── CLAUDE.md              # このファイル
```

## 編集ルール

記事ページ（`articles/*.html`）の編集・作成ルールは `./.claude/rule/articles_style_guide.md` を参照してください。

主なポイント：
- Tailwind CSSベースの統一デザイン
- **アイコン**: 原則として絵文字ではなくMaterial Symbols Outlined（MUI）のアイコンを色付きで使用
- 青・黄・緑のカラースキーム
- 導入セクション→メインコンテンツ→よくある質問→まとめの構成

## 技術スタック

- HTML5 + Tailwind CSS
- Material Symbols Outlined（アイコン）
- JavaScript（ナビゲーション、メニュー）
- Static Site（Node.jsやDBなし）

---

詳細な編集ルールは `./.claude/rule/articles_style_guide.md` を参照してください。
