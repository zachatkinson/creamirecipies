// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://creamirecipies.com',
  output: 'server',
  adapter: vercel(),
  integrations: [react(), sitemap()],
  image: {
    domains: ['*.supabase.co'],
  },
  vite: {
    plugins: [tailwindcss(), ...(process.env.NO_SSL ? [] : [basicSsl()])],
  },
});
