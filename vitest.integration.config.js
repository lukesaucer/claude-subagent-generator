import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/integration/**/*.{test,spec}.{js,jsx}'],
    globals: true,
    testTimeout: 30000, // Longer timeout for integration tests
    retry: 2, // More retries for integration tests
    sequence: {
      shuffle: false, // Run in order for integration tests
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@main': path.resolve(__dirname, './src/main'),
    },
  },
});
