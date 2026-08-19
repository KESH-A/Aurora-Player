import {StateStorage} from 'zustand/middleware';
import {settingsStorage} from '@storage/mmkv';

/**
 * Zustand `persist` storage adapter backed by MMKV.
 *
 * Because MMKV is synchronous, hydration happens on the very first read — there
 * is no async gap where the UI renders un-persisted defaults. This is the
 * mechanism that lets the active theme and per-animation flags be correct on
 * frame zero.
 */
export const mmkvPersistStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return settingsStorage.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    settingsStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    settingsStorage.delete(name);
  },
};
