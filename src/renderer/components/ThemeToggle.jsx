import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton onClick={toggleTheme} color="inherit">
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
