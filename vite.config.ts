import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

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
});
