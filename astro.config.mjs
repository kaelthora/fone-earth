import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless'; // AJOUTE '/serverless' ici

export default defineConfig({
  integrations: [tailwind()],
  output: 'server', // CHANGE 'static' par 'server'
  adapter: vercel(),
  site: 'https://fone.earth', // Mets ton vrai domaine ici
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});