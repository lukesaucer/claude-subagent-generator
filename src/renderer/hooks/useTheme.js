import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      if (window.electronAPI) {
        const result = await window.electronAPI.loadSettings();
        if (result.success && result.settings.theme) {
          setIsDarkMode(result.settings.theme === 'dark');
        }
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Save theme preference
    if (window.electronAPI) {
      await window.electronAPI.saveSettings({
        theme: newMode ? 'dark' : 'light',
      });
    }
  };

  return { isDarkMode, toggleTheme };
}
