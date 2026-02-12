import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

const rawBase = process.env.ASTRO_BASE || '/';

export default defineConfig({
  site: 'https://altstore-jp.bunchoniki.com',
  base: rawBase.endsWith('/') ? rawBase : rawBase + '/',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
  output: 'static',
});
