import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material';

// Semantic color tokens for the Cake Shop domain.
// Use these instead of hardcoded hex values in components.
export const getTokens = (theme: Theme) => {
  const { palette } = theme;
  return {
    brand: {
      primary: palette.primary.main,
      primaryLight: palette.primary.light,
      primaryDark: palette.primary.dark,
      secondary: palette.secondary.main,
      secondaryLight: palette.secondary.light,
      secondaryDark: palette.secondary.dark,
    },
    status: {
      success: palette.success.main,
      warning: palette.warning.main,
      error: palette.error.main,
      info: palette.info.main,
    },
    surfaces: {
      bodyBg: palette.background.default,
      paperBg: palette.background.paper,
      subtleOverlayLight: alpha('#ffffff', 0.1),
      subtleOverlayDark: alpha('#000000', 0.3),
    },
    gradients: {
      hero: palette.mode === 'dark'
        ? `linear-gradient(135deg, ${palette.background.default} 0%, ${palette.primary.dark} 100%)`
        : `linear-gradient(135deg, ${palette.primary.light} 0%, ${palette.primary.main} 50%, ${palette.primary.dark} 100%)`,
      accentPinkPurple: `linear-gradient(135deg, ${palette.secondary.light} 0%, ${palette.secondary.main} 100%)`,
      warningToSecondary: `linear-gradient(135deg, ${palette.warning.main}, ${palette.secondary.main})`,
    },
    shadows: {
      cardLift: palette.mode === 'dark'
        ? `0 8px 30px ${alpha(palette.primary.main, 0.6)}`
        : `0 8px 30px ${alpha(palette.primary.main, 0.25)}`,
      ratingBadge: (theme.palette.mode === 'dark'
        ? `0 10px 40px ${alpha(palette.warning.main, 0.6)}`
        : `0 10px 40px ${alpha(palette.warning.main, 0.4)}`),
    },
    alpha: (color: string, value: number) => alpha(color, value),
  };
};

export type Tokens = ReturnType<typeof getTokens>;
