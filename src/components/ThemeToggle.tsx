'use client';

import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useThemeContext } from '@/contexts/ThemeContext';

/**
 * Reusable theme mode toggle button.
 * Displays a sun icon when in dark mode (to switch to light) and a moon icon when in light mode (to switch to dark).
 * Can be dropped into any toolbar / app bar.
 */
export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} enterDelay={400}>
      <IconButton
        onClick={toggleTheme}
        aria-label="Toggle color theme"
        color="primary"
        size="small"
        sx={{
          bgcolor: 'action.hover',
          '&:hover': { bgcolor: 'action.selected' },
          transition: 'background-color 0.2s',
        }}
      >
        {mode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
