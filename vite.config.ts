import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

import type { UserConfig } from 'vitest/config';

const test = {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['src/__tests__/setupTests.ts'],
  threads: false,
  watch: false,
} as UserConfig['test'];

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window',
  },
  plugins: [react()],
  server: {
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: '0.0.0.0',
    },
  },
  build: {
    minify: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './public/index.html'),
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  root: '',
  // @ts-ignore
  test,
});
