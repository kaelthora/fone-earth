import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  site: 'https://fone.example.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
