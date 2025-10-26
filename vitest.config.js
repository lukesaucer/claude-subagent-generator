import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use happy-dom for fast DOM testing
    environment: 'happy-dom',

    // Setup files
    setupFiles: ['./tests/setup.js'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        'src/main/index.js', // Electron entry point
        '**/*.spec.js',
        '**/*.test.js',
        '**/mocks/**',
      ],
      // Require 80% coverage for v1.0.0
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },

    // Include patterns
    include: ['tests/unit/**/*.{test,spec}.{js,jsx}'],

    // Globals for easier test writing
    globals: true,

    // Timeout for async tests
    testTimeout: 10000,

    // Retry flaky tests once
    retry: 1,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@main': path.resolve(__dirname, './src/main'),
    },
  },
});
