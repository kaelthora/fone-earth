import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [tailwind(), sitemap()],
  output: 'server',
  adapter: vercel(),
  site: 'https://www.fone.earth',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});