import {createTheme} from '@themes/utils/createTheme';

/**
 * DARK CYBER — near-black tech UI with a single electric-teal signal color.
 * Sharp corners, mono display face, tight tracking. Restrained: the neon is the
 * signature, everything else stays quiet.
 */
export const darkCyberTheme = createTheme({
  id: 'darkCyber',
  name: 'Dark Cyber',
  description: 'Blacked-out console with an electric signal accent.',
  isDark: true,
  surface: 'solid',
  colors: {
    background: '#08090C',
    surface: '#101319',
    surfaceAlt: '#171B23',
    primary: '#00E5C7',
    onPrimary: '#04120F',
    accent: '#FF2E88',
    text: '#E7ECF3',
    textMuted: '#7A828F',
    border: '#232936',
    scrim: 'rgba(4, 5, 8, 0.7)',
  },
  gradient: ['#0A1418', '#08090C'],
  gradientDirection: {start: [0, 0], end: [0, 1]},
  radius: {sm: 4, md: 6, lg: 10, pill: 999},
  typography: {
    displayFamily: 'System',
    bodyFamily: 'System',
    tracking: 0.5,
  },
  effect: {
    blurAmount: 0,
    surfaceOpacity: 1,
    borderOpacity: 1,
  },
});
