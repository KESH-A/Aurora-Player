import {createTheme} from '@themes/utils/createTheme';

/**
 * TRANSPARENT — wallpaper-backed blur.
 * Panels are near clear so the device wallpaper (rendered by BlurBackdrop with a
 * user image) reads through. Text carries its own contrast scrim.
 */
export const transparentTheme = createTheme({
  id: 'transparent',
  name: 'Transparent',
  description: 'See-through panels backed by your wallpaper.',
  isDark: true,
  surface: 'blur',
  colors: {
    background: '#000000',
    surface: 'rgba(20, 20, 28, 0.35)',
    surfaceAlt: 'rgba(40, 40, 52, 0.45)',
    primary: '#FFFFFF',
    onPrimary: '#000000',
    accent: '#8AE0FF',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.18)',
    scrim: 'rgba(0, 0, 0, 0.35)',
  },
  gradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.55)'],
  gradientDirection: {start: [0, 0], end: [0, 1]},
  effect: {
    blurAmount: 18,
    blurTint: 'default',
    surfaceOpacity: 0.35,
    borderOpacity: 0.6,
  },
});
