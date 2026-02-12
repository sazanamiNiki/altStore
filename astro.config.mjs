import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://altstore-jp.bunchoniki.com',
  base: process.env.ASTRO_BASE || '/',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
  output: 'static',
});
