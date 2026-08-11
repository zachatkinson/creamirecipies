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
  // Keep Astro v6 whitespace behavior; the v7 'jsx' default can change
  // spacing between inline elements in prose-heavy pages
  compressHTML: true,
  adapter: vercel(),
  integrations: [react()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'de', 'pt'],
    routing: 'manual',
  },
  image: {
    domains: ['*.supabase.co'],
  },
  vite: {
    plugins: [tailwindcss(), ...(process.env.NO_SSL ? [] : [basicSsl()])],
  },
});
