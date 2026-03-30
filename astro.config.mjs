// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// Note: sitemap is handled by custom API routes (sitemap.xml, sitemap-recipes.xml, etc.)
export default defineConfig({
  site: 'https://eatcreami.com',
  output: 'server',
  adapter: vercel({
    isr: true,
  }),
  integrations: [react()],
  image: {
    domains: ['*.supabase.co'],
  },
  vite: {
    plugins: [tailwindcss(), ...(process.env.NO_SSL ? [] : [basicSsl()])],
  },
});
