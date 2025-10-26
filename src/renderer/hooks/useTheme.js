import { useState, useEffect, useCallback, useRef } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');
  const initialLoadRef = useRef(true);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      if (window.electronAPI) {
        const result = await window.electronAPI.loadSettings();
        // Only apply initial load if user hasn't toggled yet
        if (result.success && result.settings.theme && initialLoadRef.current) {
          setTheme(result.settings.theme);
        }
        initialLoadRef.current = false;
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = useCallback(async () => {
    // Mark that user has interacted, prevent initial load from overwriting
    initialLoadRef.current = false;

    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // Save theme preference
    if (window.electronAPI) {
      await window.electronAPI.saveSettings({ theme: newTheme });
    }
  }, [theme]);

  return { isDarkMode, toggleTheme };
}
