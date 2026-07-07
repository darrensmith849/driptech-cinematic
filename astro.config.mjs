import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Editorial template — plain CSS (no Tailwind); the aesthetic lives in src/styles/global.css.
// `site` is overwritten per-build by the worker (the CF Pages preview URL) before `astro build`.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://driptech-cinematic.pages.dev',
  integrations: [sitemap()],
});
