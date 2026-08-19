import React, {useMemo, type ReactNode} from 'react';
import {useThemeStore} from '@store/useThemeStore';
import {getTheme} from '@themes/registry';
import {ThemeContext, type ThemeContextValue} from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Bridges the persisted Zustand theme store into React context.
 *
 * Uses selector subscriptions so a theme change re-renders exactly once, and
 * memoizes the resolved token object by id/wallpaper so consumers relying on
 * referential stability (e.g. StyleSheet memoization) don't thrash.
 */
export function ThemeProvider({children}: ThemeProviderProps) {
  const themeId = useThemeStore(s => s.themeId);
  const wallpaperUri = useThemeStore(s => s.wallpaperUri);
  const setTheme = useThemeStore(s => s.setTheme);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: getTheme(themeId),
      themeId,
      wallpaperUri,
      setTheme,
    }),
    [themeId, wallpaperUri, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
