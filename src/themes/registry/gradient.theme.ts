import {createTheme} from '@themes/utils/createTheme';

/**
 * GRADIENT — dynamic multi-color flow.
 * A living gradient backdrop (animated in Phase 4 via GradientFlow) with solid,
 * confident panels floating on top. Warm sunset → violet spectrum.
 */
export const gradientTheme = createTheme({
  id: 'gradient',
  name: 'Gradient',
  description: 'Living multi-color gradient in constant motion.',
  isDark: true,
  surface: 'gradient',
  colors: {
    background: '#2A1145',
    surface: 'rgba(255, 255, 255, 0.10)',
    surfaceAlt: 'rgba(255, 255, 255, 0.18)',
    primary: '#FF6EC7',
    onPrimary: '#1A0525',
    accent: '#FFD86E',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.72)',
    border: 'rgba(255, 255, 255, 0.24)',
    scrim: 'rgba(26, 5, 37, 0.5)',
  },
  gradient: ['#FF6EC7', '#8A5CFF', '#3B7BFF', '#28C7B8'],
  gradientDirection: {start: [0, 0], end: [1, 1]},
  effect: {
    blurAmount: 0,
    surfaceOpacity: 0.9,
    borderOpacity: 0.6,
    animatedGradient: true,
  },
});
