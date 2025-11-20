import { createTheme, ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#FF69B4' : '#FFD700', // Hot Pink for light, Gold/Yellow for dark
      light: mode === 'light' ? '#FFB6D9' : '#FFE55C',
      dark: mode === 'light' ? '#C93A7F' : '#CCA300',
      contrastText: mode === 'light' ? '#fff' : '#0A1929',
    },
    secondary: {
      main: mode === 'light' ? '#9C27B0' : '#FFA726', // Purple for light, Orange for dark
      light: mode === 'light' ? '#BA68C8' : '#FFB74D',
      dark: mode === 'light' ? '#7B1FA2' : '#F57C00',
      contrastText: '#fff',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: mode === 'light' ? '#ff9800' : '#FFD700',
    },
    info: {
      main: mode === 'light' ? '#2196f3' : '#4FC3F7',
    },
    background: {
      default: mode === 'light' ? '#FFF5F8' : '#0A1929', // Dark Navy Blue for dark mode
      paper: mode === 'light' ? '#ffffff' : '#132F4C', // Slightly lighter navy for papers
    },
    text: {
      primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#E3F2FD',
      secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : '#B0BEC5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0 4px 12px rgba(255, 105, 180, 0.3)'
              : '0 4px 12px rgba(255, 215, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 4px 20px rgba(0, 0, 0, 0.08)'
            : '0 4px 20px rgba(0, 0, 0, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light' 
              ? '0 8px 30px rgba(0, 0, 0, 0.12)'
              : '0 8px 30px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#1ac4d0ff' : '#0A1929',
          color: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#E3F2FD',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#0A1929',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default MUI dark mode gradient
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getThemeOptions(mode));
};

// Default light theme for backwards compatibility
export const theme = createAppTheme('light');

export default theme;
