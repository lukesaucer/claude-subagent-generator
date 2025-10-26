import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@renderer/hooks/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.window.electronAPI.loadSettings = vi.fn().mockResolvedValue({
      success: true,
      settings: { theme: 'dark' },
    });

    global.window.electronAPI.saveSettings = vi.fn().mockResolvedValue({
      success: true,
    });
  });

  describe('initialization', () => {
    it('should default to dark mode', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(true);
    });

    it('should load theme preference from settings', async () => {
      global.window.electronAPI.loadSettings = vi.fn().mockResolvedValue({
        success: true,
        settings: { theme: 'light' },
      });

      const { result } = renderHook(() => useTheme());

      // Wait for useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isDarkMode).toBe(false);
    });

    it('should handle missing theme in settings', async () => {
      global.window.electronAPI.loadSettings = vi.fn().mockResolvedValue({
        success: true,
        settings: {},
      });

      const { result } = renderHook(() => useTheme());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should remain at default
      expect(result.current.isDarkMode).toBe(true);
    });

    it('should handle settings load failure', async () => {
      global.window.electronAPI.loadSettings = vi.fn().mockResolvedValue({
        success: false,
      });

      const { result } = renderHook(() => useTheme());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should remain at default
      expect(result.current.isDarkMode).toBe(true);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from dark to light', async () => {
      const { result } = renderHook(() => useTheme());

      await act(async () => {
        await result.current.toggleTheme();
      });

      expect(result.current.isDarkMode).toBe(false);
    });

    it('should toggle from light to dark', async () => {
      global.window.electronAPI.loadSettings = vi.fn().mockResolvedValue({
        success: true,
        settings: { theme: 'light' },
      });

      const { result } = renderHook(() => useTheme());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        await result.current.toggleTheme();
      });

      expect(result.current.isDarkMode).toBe(true);
    });

    it('should save theme preference', async () => {
      const { result } = renderHook(() => useTheme());

      await act(async () => {
        await result.current.toggleTheme();
      });

      expect(global.window.electronAPI.saveSettings).toHaveBeenCalledWith({
        theme: 'light',
      });
    });

    it('should handle save errors gracefully', async () => {
      global.window.electronAPI.saveSettings = vi.fn().mockResolvedValue({
        success: false,
        error: 'Save failed',
      });

      const { result } = renderHook(() => useTheme());

      await act(async () => {
        await result.current.toggleTheme();
      });

      // Theme should still toggle even if save fails
      expect(result.current.isDarkMode).toBe(false);
    });

    it('should toggle multiple times correctly', async () => {
      const { result } = renderHook(() => useTheme());

      const initialMode = result.current.isDarkMode;

      await act(async () => {
        await result.current.toggleTheme();
      });

      expect(result.current.isDarkMode).toBe(!initialMode);

      await act(async () => {
        await result.current.toggleTheme();
      });

      expect(result.current.isDarkMode).toBe(initialMode);
    });
  });

  describe('electronAPI integration', () => {
    it('should handle missing electronAPI', async () => {
      const originalAPI = global.window.electronAPI;
      global.window.electronAPI = undefined;

      const { result } = renderHook(() => useTheme());

      await act(async () => {
        await result.current.toggleTheme();
      });

      // Should not crash
      expect(result.current.isDarkMode).toBe(false);

      global.window.electronAPI = originalAPI;
    });
  });
});
