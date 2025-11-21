import { createTheme, ThemeOptions } from '@mui/material/styles';

// Pink & Black dark theme + Light Green light theme
// Dark mode: vibrant yet refined pink accents on near-black surfaces with white text.
// Light mode: airy light green palette with dark-on-light readability.
const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#6FD694' : '#D81B60', // light green vs vibrant pink
      light: mode === 'light' ? '#8BE3A9' : '#EC407A',
      dark: mode === 'light' ? '#3E9257' : '#880E4F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: mode === 'light' ? '#3DAA5E' : '#FF8A80', // supporting accent
      light: mode === 'light' ? '#68C786' : '#FFABAB',
      dark: mode === 'light' ? '#2A7442' : '#FF5252',
      contrastText: '#FFFFFF',
    },
    success: {
      main: mode === 'light' ? '#3DAA5E' : '#43A047',
      light: mode === 'light' ? '#68C786' : '#66BB6A',
      dark: mode === 'light' ? '#2A7442' : '#2E7D32',
      contrastText: '#FFFFFF',
    },
    info: {
      main: mode === 'light' ? '#54B5C7' : '#F06292',
      light: mode === 'light' ? '#7FCADA' : '#F48FB1',
      dark: mode === 'light' ? '#2D7A88' : '#C2185B',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: mode === 'light' ? '#F2B33D' : '#FFB74D',
      light: mode === 'light' ? '#F6C871' : '#FFE9B3',
      dark: mode === 'light' ? '#B37919' : '#F57C00',
      contrastText: mode === 'light' ? '#1A1A1A' : '#1A1A1A',
    },
    error: {
      main: mode === 'light' ? '#E53935' : '#EF5350',
      light: mode === 'light' ? '#EF5350' : '#FF8A80',
      dark: mode === 'light' ? '#B71C1C' : '#C62828',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#FFFFFF' : '#0A0A0B',
      paper: mode === 'light' ? '#F6FFF7' : '#121314',
    },
    text: {
      primary: mode === 'light' ? '#0F1E16' : '#FFFFFF',
      secondary: mode === 'light' ? '#425448' : '#D3D3D3',
      disabled: mode === 'light' ? '#92A198' : '#6D6F72',
    },
  divider: mode === 'light' ? '#E2F4E8' : '#2A2A2C',
    action: {
      active: mode === 'light' ? '#0F1E16' : '#FFFFFF',
      hover: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
      selected: mode === 'light' ? 'rgba(111,214,148,0.18)' : 'rgba(216,27,96,0.25)',
      disabled: 'rgba(255,255,255,0.35)',
      disabledBackground: mode === 'light' ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.08)',
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
      color: '#FFFFFF',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#FFFFFF',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#FFFFFF',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#FFFFFF',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#FFFFFF',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#FFFFFF',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
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
          backgroundImage: mode === 'dark'
            ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)',
          '&:hover': {
            boxShadow: mode === 'dark' ? '0 4px 14px rgba(0,0,0,0.5)' : '0 4px 14px rgba(0,0,0,0.2)',
            filter: 'brightness(1.12)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: mode === 'light' ? '#3E9257' : '#880E4F',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: mode === 'light' ? '#2A7442' : '#FF5252',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#121314',
          border: mode === 'light' ? '1px solid #D5ECDC' : '1px solid #1F1F21',
          boxShadow: mode === 'light'
            ? '0 4px 18px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)'
            : '0 4px 20px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: mode === 'light'
              ? '0 10px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)'
              : '0 10px 34px rgba(0,0,0,0.7), 0 4px 14px rgba(0,0,0,0.5)',
            backgroundImage: mode === 'dark'
              ? 'linear-gradient(135deg, rgba(216,27,96,0.18) 0%, rgba(216,27,96,0) 65%)'
              : 'linear-gradient(135deg, rgba(111,214,148,0.25) 0%, rgba(111,214,148,0) 60%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#121314',
            '& fieldset': {
              borderColor: mode === 'light' ? '#D5ECDC' : '#1F1F21',
            },
            '&:hover fieldset': {
              borderColor: mode === 'light' ? '#B9DCC6' : '#2A2A2C',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'light' ? '#3E9257' : '#EC407A',
            },
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
        colorSuccess: {
          backgroundColor: '#43A047',
          color: '#ffffff',
        },
        colorError: {
          backgroundColor: '#E53935',
          color: '#ffffff',
        },
        colorWarning: {
          backgroundColor: '#FBC02D',
          color: '#1A1A1A',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#0A0A0B',
          color: mode === 'light' ? '#0F1E16' : '#FFFFFF',
          boxShadow: mode === 'light'
            ? '0 2px 6px rgba(0,0,0,0.06)'
            : '0 2px 6px rgba(0,0,0,0.7)',
          borderBottom: mode === 'light' ? '1px solid #D5ECDC' : '1px solid #1F1F21',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#0A0A0B',
          borderRight: mode === 'light' ? '1px solid #D5ECDC' : '1px solid #1F1F21',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#121314',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#F6FFF7' : '#121314',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: mode === 'light' ? '#0F1E16' : '#FFFFFF',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          color: mode === 'light' ? '#0F1E16' : '#FFFFFF',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(111,214,148,0.15)' : 'rgba(216,27,96,0.15)',
          },
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? 'rgba(111,214,148,0.28)' : 'rgba(216,27,96,0.28)',
            color: mode === 'light' ? '#3E9257' : '#EC407A',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(111,214,148,0.38)' : 'rgba(216,27,96,0.38)',
            },
          },
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getThemeOptions(mode));

// Default to dark mode for requested black background aesthetic
export const theme = createAppTheme('dark');

export default theme;