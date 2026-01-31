# bunchoniki Store

Apple Silicon対応デバイス向けの公証済みアプリを集めたカタログサイト。AltStore日本語ラッパーポータルとして、iPhoneやiPadのサイドローディング文化を応援します。

## 🐦 コンセプト

文鳥（bunchoniki）をモチーフにした、白・ライトブルー基調の清潔感あるデザイン。Apple Notarization対応アプリのみを厳選して掲載しています。

## ✨ 主な機能

- **アプリカタログ**: 6つの公証済みアプリを掲載
  - Delta Emulator
  - UTM SE
  - Sidestore
  - Filza File Manager
  - iSH Shell
  - Vinyls

- **検索・フィルタリング**: キーワード検索、カテゴリーフィルタリング
- **アプリ詳細ページ**: 詳細情報、必要環境、関連記事へのリンク
- **教育記事**: 法律、セキュリティ、アプリ紹介など10記事

## 📁 ファイル構造

```
altStore-jp/
├── index.html                    # トップページ
├── apps.html                     # アプリカタログ
├── app-detail.html              # アプリ詳細
├── 404.html                     # カスタムエラーページ
├── _config.yml                  # GitHub Pages設定
├── .nojekyll                    # Jekyll無効化
│
├── assets/
│   ├── css/main.css            # Tailwind CSSスタイル
│   ├── js/                      # JavaScriptモジュール
│   │   ├── components.js       # UIコンポーネント
│   │   ├── app-catalog.js      # カタログロジック
│   │   ├── modal.js            # モーダル処理
│   │   ├── seo.js              # 構造化データ
│   │   └── main.js             # メイン処理
│   └── data/apps.json          # アプリメタデータ
│
├── articles/                    # 教育記事
│   ├── index.html              # 記事一覧
│   ├── smartphone-law-explained.html
│   ├── apple-notarization.html
│   ├── our-policy.html
│   ├── commission-cut.html
│   ├── payment-freedom.html
│   ├── direct-support.html
│   ├── delta-utm-guide.html
│   ├── sidestore-guide.html
│   ├── top3-apps-2026.html
│   └── faq.html
│
├── privacy-policy.html          # プライバシーポリシー
├── terms.html                   # 利用規約
└── package.json                 # npm設定
```

## 🚀 デプロイ

このプロジェクトはGitHub Pagesでホストされています。

**ライブURL**: `https://sazanamiNiki.github.io/altStore/` (master ブランチ)
**デプロイプレビュー**: `https://sazanamiNiki.github.io/altStore-dev/` (develop ブランチ)

### セットアップ

```bash
git clone https://github.com/sazanamiNiki/altStore.git
cd altStore
```

ローカルでテストする場合は、任意のHTTPサーバーで `index.html` を開いてください。

```bash
python3 -m http.server 8000
# ブラウザで http://localhost:8000 にアクセス
```

## 🛠 技術スタック

- **HTML5** - セマンティックマークアップ
- **Tailwind CSS** - CDN版（GitHub Pages対応）
- **Vanilla JavaScript** - フレームワークなし
- **JSON** - アプリメタデータ

## 📋 ブランチ戦略

git-flow モデルに準拠：

- `main` - 本番環境（GitHub Pagesデプロイ）
- `develop` - 開発環境
- `feature/*` - 機能開発ブランチ

## 🤝 コントリビューション

記事の詳細な本文追加、新しいアプリの掲載提案などは、feature ブランチで実装し、PR を作成してください。

## 📄 ライセンス

MIT License - 詳細は LICENSE ファイルを参照

## ⚠️ 免責事項

本サイトは非公式です。掲載情報は最善の努力で確認していますが、正確性を保証しません。アプリの使用は自己責任でお願いします。

---

**最終更新**: 2026年1月31日
