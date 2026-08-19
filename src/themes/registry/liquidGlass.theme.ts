import {createTheme} from '@themes/utils/createTheme';

/**
 * LIQUID GLASS — frosted glassmorphism.
 * Deep translucent panels, a bright hairline "edge", cool blue-violet light.
 * Surfaces render through BlurBackdrop + a low-opacity fill for the sheen.
 */
export const liquidGlassTheme = createTheme({
  id: 'liquidGlass',
  name: 'Liquid Glass',
  description: 'Frosted glass panels with a luminous edge.',
  isDark: true,
  surface: 'glass',
  colors: {
    background: '#0B1020',
    surface: 'rgba(255, 255, 255, 0.08)',
    surfaceAlt: 'rgba(255, 255, 255, 0.14)',
    primary: '#6EA8FE',
    onPrimary: '#04070F',
    accent: '#B692FF',
    text: '#F4F7FF',
    textMuted: 'rgba(244, 247, 255, 0.62)',
    border: 'rgba(255, 255, 255, 0.28)',
    scrim: 'rgba(6, 10, 24, 0.6)',
  },
  gradient: ['#1B2A4A', '#0B1020'],
  gradientDirection: {start: [0, 0], end: [1, 1]},
  effect: {
    blurAmount: 28,
    blurTint: 'dark',
    surfaceOpacity: 0.55,
    borderOpacity: 0.9,
  },
});
