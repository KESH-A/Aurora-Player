import {createTheme} from '@themes/utils/createTheme';

/**
 * RETRO SYNTH — 80s synthwave.
 * Deep indigo night, hot magenta + cyan, sunset gradient. Wider tracking and a
 * bolder display face evoke the era. The gradient is the load-bearing signature.
 */
export const retroSynthTheme = createTheme({
  id: 'retroSynth',
  name: 'Retro Synth',
  description: 'Neon 80s synthwave with a sunset horizon.',
  isDark: true,
  surface: 'gradient',
  colors: {
    background: '#160B2E',
    surface: 'rgba(42, 18, 66, 0.72)',
    surfaceAlt: 'rgba(62, 26, 92, 0.8)',
    primary: '#FF2D95',
    onPrimary: '#12061F',
    accent: '#00E0FF',
    text: '#FDE9FF',
    textMuted: 'rgba(253, 233, 255, 0.66)',
    border: 'rgba(255, 45, 149, 0.5)',
    scrim: 'rgba(22, 11, 46, 0.6)',
  },
  gradient: ['#FF2D95', '#7A2BE2', '#160B2E'],
  gradientDirection: {start: [0, 0], end: [0, 1]},
  typography: {
    displayFamily: 'System',
    bodyFamily: 'System',
    tracking: 1,
  },
  effect: {
    blurAmount: 0,
    surfaceOpacity: 0.85,
    borderOpacity: 0.8,
    animatedGradient: true,
  },
});
