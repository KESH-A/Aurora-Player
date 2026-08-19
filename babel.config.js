/**
 * Babel configuration.
 *
 * IMPORTANT ordering rules:
 *  - `module-resolver` enables the "@/..." path aliases below (must match tsconfig.json).
 *  - `react-native-reanimated/plugin` MUST be the LAST plugin in the list, otherwise
 *    Reanimated worklets will silently fail to run on the UI thread.
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@app': './src/app',
          '@components': './src/components',
          '@screens': './src/screens',
          '@themes': './src/themes',
          '@animation': './src/animation',
          '@services': './src/services',
          '@store': './src/store',
          '@storage': './src/storage',
          '@hooks': './src/hooks',
          '@domain': './src/types',
          '@constants': './src/constants',
          '@utils': './src/utils',
          '@assets': './assets',
        },
      },
    ],
    // Keep this LAST.
    'react-native-reanimated/plugin',
  ],
};
