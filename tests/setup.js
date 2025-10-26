import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Electron API
global.electronAPI = {
  saveAgent: vi.fn(),
  loadAgents: vi.fn(),
  getExistingAgents: vi.fn(),
  processPDF: vi.fn(),
  loadSettings: vi.fn(),
  saveSettings: vi.fn(),
  consultAgent: vi.fn(),
  loadTemplate: vi.fn(),
  getAppVersion: vi.fn(),
};

// Mock window object for Electron
global.window = global.window || {};
global.window.electronAPI = global.electronAPI;

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
