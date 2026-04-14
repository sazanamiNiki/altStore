# Google Search Console 運用手順

> このドキュメントは運営者（bunchoniki）向けの運用メモ。
> Google Index 遅延時・新記事公開時・重要修正後などに参照する。

## 前提確認

### サイトマップ送信の確認

1. [Google Search Console](https://search.google.com/search-console) にログイン
2. プロパティ: `altstore-jp.bunchoniki.com` を選択
3. 左メニュー「**サイトマップ**」を開く
4. `https://altstore-jp.bunchoniki.com/sitemap-index.xml` が送信済みであることを確認
5. **未送信なら**: 上部の入力欄に `sitemap-index.xml` を入力して「送信」

### robots.txt の確認

1. `https://altstore-jp.bunchoniki.com/robots.txt` を直接ブラウザで開く
2. 以下の内容が表示されることを確認:
   ```
   User-agent: *
   Disallow: /dev/

   Sitemap: https://altstore-jp.bunchoniki.com/sitemap-index.xml
   ```

---

## 新規記事公開時・重要修正後の手順

### ステップ1: URL検査でインデックスリクエスト

1. Search Console 上部の検索欄に **記事のフルURL** を入力（例: `https://altstore-jp.bunchoniki.com/articles/altstore-pal-guide/`）
2. 「URL 検査」機能が自動起動
3. 結果を待つ（数秒〜1分）
4. 表示メッセージ別の対応:

| 表示 | 意味 | 対応 |
|---|---|---|
| ✅ 「URL は Google に登録されています」 | インデック済み | 「公開 URL をテスト」で最新状態確認 |
| ⚠️ 「URL は Google に登録されていません」 | 未インデックス | 下の「**インデックス登録をリクエスト**」ボタン押下 |
| ❌ 「URL は Google に登録できません」 | ブロック/エラー | ブロック理由を表示、修正して再リクエスト |

### ステップ2: インデックス登録リクエスト

1. 「**インデックス登録をリクエスト**」ボタンをクリック
2. Google がページをテスト（1-2分）
3. 「インデックス登録をリクエスト済み」表示を確認
4. **反映には数時間〜数週間かかる**。焦らず待つ

> ⚠️ 24時間以内に同じURLを何度もリクエストしない（スパム扱いのリスク）

### ステップ3: 対応が必要なページを洗い出す

今回の改修で特にリクエストしたいURL:

```
# 新規3記事（2026-04-11公開）
https://altstore-jp.bunchoniki.com/articles/altstore-pal-guide/
https://altstore-jp.bunchoniki.com/articles/altstore-pal-apps/
https://altstore-jp.bunchoniki.com/articles/alternative-marketplace/

# 大幅改修（PAL推し対応）
https://altstore-jp.bunchoniki.com/
https://altstore-jp.bunchoniki.com/articles/
https://altstore-jp.bunchoniki.com/articles/install-app-step-by-step/
https://altstore-jp.bunchoniki.com/articles/how-to-use-altstore/
https://altstore-jp.bunchoniki.com/articles/altstore-complete-guide/
https://altstore-jp.bunchoniki.com/articles/our-policy/
```

---

## インデックス拒否時の調査手順

### 「クロール済み - インデックス未登録」の場合

**原因候補**:
- コンテンツ品質が低いとみなされた
- 類似コンテンツが既に存在（キーワードカニバリゼーション）
- E-E-A-T シグナル不足

**対応**:
1. 記事の本文を増やす（+300-500字）
2. 独自の体験談・検証データを追加
3. 内部リンク/外部リンクを増やす
4. 運営者情報を充実させる

### 「代替ページ（正規ページあり）」の場合

**原因**: 別の似たページが正規版として認識された

**対応**:
1. 該当URLと"似ている"ページを特定
2. 記事のタイトル・h1・内容を明確に差別化
3. canonical URLが正しいか確認

### 「検出 - インデックス未登録」の場合

**原因**: クロール予算不足、優先度低

**対応**:
1. サイトマップを再送信
2. URL検査でリクエスト
3. 内部リンク経由でクロールを促す

---

## 定期チェック項目（月1回推奨）

### 1. カバレッジレポート

- 「有効」ページ数が記事数と一致するか
- 「エラー」「警告」が発生していないか

### 2. 検索パフォーマンス

- 表示回数が増えているか
- CTR が 2% 以上か（低ければ title/description 改善）
- 平均掲載順位の推移

### 3. Core Web Vitals

- 「モバイル」タブで LCP/INP/CLS が「良好」か
- 問題URLがあれば PageSpeed Insights で詳細確認

### 4. モバイルユーザビリティ

- エラーがある場合は該当ページを修正

---

## 参考リンク

- [Google Search Console](https://search.google.com/search-console)
- [Google 検索セントラル](https://developers.google.com/search/docs?hl=ja)
- [Rich Results Test](https://search.google.com/test/rich-results)（構造化データ検証）
- [PageSpeed Insights](https://pagespeed.web.dev/)（Core Web Vitals）
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
