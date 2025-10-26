import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.join(__dirname, 'src/renderer'),
  base: './',
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src/renderer'),
      '@components': path.join(__dirname, 'src/renderer/components'),
      '@services': path.join(__dirname, 'src/renderer/services'),
      '@hooks': path.join(__dirname, 'src/renderer/hooks'),
      '@theme': path.join(__dirname, 'src/renderer/theme'),
    },
  },
});
