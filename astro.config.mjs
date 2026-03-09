import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

function generateRedirects() {
  const redirects = {};
  const articlesDir = path.resolve('./src/pages/articles');

  if (fs.existsSync(articlesDir)) {
    try {
      const files = fs.readdirSync(articlesDir);
      for (const file of files) {
        // 下書きファイル（_で始まる）やindex.astroを除外
        if (file.startsWith('_') || file === 'index.astro') {
          continue;
        }

        if (file.endsWith('.mdx') || file.endsWith('.md') || file.endsWith('.astro')) {
          const slug = file.replace(/\.(mdx?|astro)$/, '');
          redirects[`/articles/${slug}.html`] = `/articles/${slug}/`;
          console.log(`[Redirect] /articles/${slug}.html → /articles/${slug}/`);
        }
      }
      console.log(`[Redirect] ${Object.keys(redirects).length}件のリダイレクトを生成しました`);
    } catch (error) {
      console.error('[Redirect] リダイレクト生成中にエラーが発生しました:', error);
    }
  } else {
    console.warn('[Redirect] articlesディレクトリが見つかりません');
  }
  return redirects;
}

const rawBase = '';

export default defineConfig({
  site: 'https://altstore-jp.bunchoniki.com',
  base: rawBase || '/',
  trailingSlash: 'always',
  redirects: generateRedirects(), 
  integrations: [tailwind({ applyBaseStyles: false }), mdx(), sitemap()],
  output: 'static',
});