import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import type {ThemeId} from '@themes/tokens/tokenSchema';
import {DEFAULT_THEME_ID} from '@themes/registry';
import {mmkvPersistStorage} from './middleware/mmkvPersist';
import {StorageKeys} from '@storage/storageKeys';

interface ThemeState {
  themeId: ThemeId;
  /** Optional wallpaper URI used by the Transparent theme's blur backing. */
  wallpaperUri: string | null;
  setTheme: (id: ThemeId) => void;
  setWallpaper: (uri: string | null) => void;
}

/**
 * Active-theme store. Persisted to MMKV so the correct theme is present on
 * frame zero (synchronous rehydrate → no flash of default theme).
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      themeId: DEFAULT_THEME_ID,
      wallpaperUri: null,
      setTheme: id => set({themeId: id}),
      setWallpaper: uri => set({wallpaperUri: uri}),
    }),
    {
      name: StorageKeys.THEME,
      storage: createJSONStorage(() => mmkvPersistStorage),
    },
  ),
);
