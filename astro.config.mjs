import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://nstephg.github.io',
  base: '/portfolio-nicole',
  vite: {
    plugins: [tailwindcss()],
  },
});