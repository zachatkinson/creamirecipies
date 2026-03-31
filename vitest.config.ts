import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      include: ['src/lib/**', 'src/hooks/**', 'src/components/**/*.tsx'],
      exclude: ['src/test/**'],
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
