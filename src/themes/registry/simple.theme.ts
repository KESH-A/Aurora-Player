import {createTheme} from '@themes/utils/createTheme';

/**
 * SIMPLE — minimalist / flat.
 * No blur, no gradient, no glow. Clean light surface, one calm brand color,
 * tightened radius. This is the "just play my music" theme and the performance
 * baseline (cheapest to render).
 */
export const simpleTheme = createTheme({
  id: 'simple',
  name: 'Simple',
  description: 'Clean, flat and distraction-free.',
  isDark: false,
  surface: 'solid',
  colors: {
    background: '#F7F7F8',
    surface: '#FFFFFF',
    surfaceAlt: '#EFEFF2',
    primary: '#2E7D67',
    onPrimary: '#FFFFFF',
    accent: '#2E7D67',
    text: '#16181C',
    textMuted: '#6B7078',
    border: '#E2E3E7',
    scrim: 'rgba(0, 0, 0, 0.25)',
  },
  gradient: ['#F7F7F8', '#F7F7F8'],
  gradientDirection: {start: [0, 0], end: [0, 1]},
  radius: {sm: 6, md: 10, lg: 14, pill: 999},
  effect: {
    blurAmount: 0,
    surfaceOpacity: 1,
    borderOpacity: 1,
  },
});
