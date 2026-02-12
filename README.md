# bunchoniki Store

Apple Silicon対応デバイス向けの厳選アプリを集めたカタログサイト。AltStore日本語ラッパーポータルとして、iPhoneやiPadのサイドローディング文化を応援します。

## コンセプト

文鳥（bunchoniki）をモチーフにした、白・ライトブルー基調の清潔感あるデザイン。開発元が明確なアプリ（オープンソースまたはApple公証済み）のみを厳選して掲載しています。

## 主な機能

- **アプリカタログ**: 6つの厳選アプリを掲載
  - Delta Emulator
  - UTM SE
  - Sidestore
  - Filza File Manager
  - iSH Shell
  - Vinyls

- **検索・フィルタリング**: キーワード検索、カテゴリーフィルタリング
- **アプリ詳細ページ**: 詳細情報、必要環境、関連記事へのリンク
- **教育記事**: 法律、セキュリティ、アプリ紹介など17記事

## ファイル構造

```
altStore-jp/
├── src/
│   ├── components/            # Astroコンポーネント（UI部品）
│   ├── layouts/               # ページレイアウト
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── pages/
│   │   ├── index.astro        # トップページ
│   │   ├── apps.astro         # アプリカタログ
│   │   └── articles/          # 記事ページ（MDX）
│   ├── content/
│   │   └── config.ts          # Content Collections定義
│   └── styles/
│       └── global.css         # グローバルスタイル
│
├── public/
│   └── assets/
│       ├── js/                # クライアントサイドJS
│       ├── img/               # 画像・ロゴ
│       └── data/apps.json     # アプリメタデータ
│
├── astro.config.mjs           # Astro設定
├── tailwind.config.mjs        # Tailwind CSS設定
└── package.json
```

## デプロイ

このプロジェクトはGitHub Pages（Astro静的ビルド）でホストされています。

**ライブURL**: `https://altstore-jp.bunchoniki.com`

## セットアップ

```bash
git clone https://github.com/sazanamiNiki/altStore-jp.git
cd altStore-jp
npm install
```

### 開発サーバー

```bash
npm run dev
# ブラウザで http://localhost:4321 にアクセス
```

### ビルド

```bash
npm run build
# dist/ にHTMLが出力される
```

## 技術スタック

- **Astro 4.16** - 静的サイト生成（SSG）
- **MDX** - コンポーネント対応Markdown記事
- **Tailwind CSS 3.4** - ユーティリティCSSフレームワーク
- **TypeScript** - 型安全な開発
- **Material Symbols Outlined** - アイコン
- **Vanilla JavaScript** - クライアントサイド処理

## ブランチ戦略

git-flow モデルに準拠：

- `master` - 本番環境（GitHub Pagesデプロイ）
- `develop` - 開発環境
- `feature/*` - 機能開発ブランチ

## コントリビューション

記事の追加・修正、新しいアプリの掲載提案などは、feature ブランチで実装し、PR を作成してください。

## ライセンス

MIT License

## 免責事項

本サイトは非公式です。掲載情報は最善の努力で確認していますが、正確性を保証しません。アプリの使用は自己責任でお願いします。

---

**最終更新**: 2026年2月12日
