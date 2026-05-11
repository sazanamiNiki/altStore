import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// 記事MDXファイルからdate属性を抽出してURL→日付のマッピングを生成
function getArticleDates() {
  const dates = {};
  const articlesDir = path.resolve('./src/pages/articles');

  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir);
    for (const file of files) {
      if (file.startsWith('_') || file === 'index.astro') continue;
      if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;

      const slug = file.replace(/\.(mdx?|md)$/, '');
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
      const dateMatch = content.match(/date="(\d{4}-\d{2}-\d{2})"/);
      if (dateMatch) {
        dates[`/articles/${slug}/`] = dateMatch[1];
      }
    }
  }
  return dates;
}

const articleDates = getArticleDates();
const rawBase = '';

// サイトマップに含める優先ページ（インデックス促進のため厳選）
// Google にまず信頼される少数の高品質ページを登録し、
// インデックス実績ができたら徐々に追加する。
const PRIORITY_PAGES = [
  '/',
  '/articles/',
  '/articles/what-is-sideloading/',
  '/articles/how-to-use-altstore/',
  '/articles/altstore-complete-guide/',
  '/articles/safety-guide/',
  '/articles/utm-guide/',
  '/articles/sidestore-guide/',
  '/articles/smartphone-law-explained/',
  '/articles/altstore-pal-guide/',
  '/articles/altstore-pal-apps/',
  '/articles/alternative-marketplace/',
];

export default defineConfig({
  site: 'https://altstore-jp.bunchoniki.com',
  base: rawBase || '/',
  trailingSlash: 'always',
  // 記事の移転・分割に伴う 301 リダイレクト（GitHub Pages では meta refresh で実装）
  redirects: {
    '/articles/delta-utm-guide/': '/articles/utm-guide/',
    '/articles/gb-operator-guide/': 'https://retrogame.bunchoniki.com/articles/gb-operator-guide/',
    '/articles/free-games-for-delta/': 'https://retrogame.bunchoniki.com/articles/free-games-for-delta/',
    '/articles/emulator-legal/': 'https://retrogame.bunchoniki.com/articles/emulator-legal/',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap({
      filter(page) {
        const url = new URL(page);
        return PRIORITY_PAGES.includes(url.pathname);
      },
      serialize(item) {
        // 記事ページはArticleLayoutのdate属性を使用、それ以外はビルド日時
        const urlPath = new URL(item.url).pathname;
        const articleDate = articleDates[urlPath];
        item.lastmod = articleDate ? new Date(articleDate) : new Date();
        return item;
      },
    }),
  ],
  output: 'static',
});