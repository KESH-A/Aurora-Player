import {MMKV} from 'react-native-mmkv';

/**
 * The single synchronous key-value store for the whole app.
 *
 * MMKV is memory-mapped and synchronous, which is exactly what we want for the
 * theme + settings layer: values are readable at the very first frame with zero
 * async hydration delay (no theme flicker on launch).
 *
 * Separate instances are used so we can independently clear/migrate domains.
 */
export const settingsStorage = new MMKV({id: 'settings'});

/** Larger, churn-heavy data (scanned library cache, queue snapshots). */
export const dataStorage = new MMKV({id: 'data'});

/**
 * A tiny typed facade used by the Zustand persistence middleware.
 * It speaks the `StateStorage` shape Zustand expects but stays fully synchronous.
 */
export const mmkvJSON = {
  getItem(key: string, storage: MMKV = settingsStorage): string | null {
    return storage.getString(key) ?? null;
  },
  setItem(key: string, value: string, storage: MMKV = settingsStorage): void {
    storage.set(key, value);
  },
  removeItem(key: string, storage: MMKV = settingsStorage): void {
    storage.delete(key);
  },
};
