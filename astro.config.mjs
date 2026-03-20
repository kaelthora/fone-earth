import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel'; // <--- ENLÈVE le '/serverless' ici

export default defineConfig({
  integrations: [tailwind()],
  output: 'server', // Garde bien 'server' ici
  adapter: vercel(),
  site: 'https://fone.earth',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});