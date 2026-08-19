import {createContext} from 'react';
import type {ThemeTokens, ThemeId} from '@themes/tokens/tokenSchema';
import {getTheme, DEFAULT_THEME_ID} from '@themes/registry';

export interface ThemeContextValue {
  theme: ThemeTokens;
  themeId: ThemeId;
  wallpaperUri: string | null;
  setTheme: (id: ThemeId) => void;
}

/**
 * Context carries the fully-resolved token object (not just the id) so
 * consumers never touch the registry directly. Default keeps type-safety for
 * any component rendered outside the provider (should not happen in practice).
 */
export const ThemeContext = createContext<ThemeContextValue>({
  theme: getTheme(DEFAULT_THEME_ID),
  themeId: DEFAULT_THEME_ID,
  wallpaperUri: null,
  setTheme: () => undefined,
});
