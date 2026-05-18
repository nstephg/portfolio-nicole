import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://nstephg.github.io',
  base: '/portfolio-nicole',
  integrations: [tailwind()],
});