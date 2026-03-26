import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  // Global ignores
  { ignores: ['dist/', '.vercel/', '.astro/', 'node_modules/', '*.config.*', 'src/env.d.ts', 'src/components/ads/'] },

  // Base JS/TS rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro files
  ...astro.configs.recommended,

  // TypeScript overrides
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Allow `any` in specific cases (Supabase returns complex types)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow unused vars prefixed with _
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // No empty functions
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Consistent returns
      'no-unreachable': 'error',
      // No console.log in production (warn only)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // React TSX files
  {
    files: ['**/*.tsx'],
    rules: {
      // React specific
      'no-restricted-globals': ['error', 'event', 'fdescribe'],
    },
  },

  // Scripts (allow console.log)
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Astro files
  {
    files: ['**/*.astro'],
    rules: {
      // Astro components often have complex type assertions
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
