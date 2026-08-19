import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import type {AnimationKey, AnimationFlags, FpsTarget} from '@domain/animation';
import {
  DEFAULT_ANIMATION_FLAGS,
  DEFAULT_FPS_TARGET,
} from '@animation/config/animationDefaults';
import {mmkvPersistStorage} from './middleware/mmkvPersist';
import {StorageKeys} from '@storage/storageKeys';

interface AnimationStoreState {
  flags: AnimationFlags;
  fpsTarget: FpsTarget;
  /** Toggle a single animation atom. There is intentionally no "set all". */
  toggle: (key: AnimationKey) => void;
  /** Explicit set (used by Settings switches). */
  setFlag: (key: AnimationKey, value: boolean) => void;
  setFpsTarget: (target: FpsTarget) => void;
}

/**
 * Per-animation flag store.
 *
 * Persisted to MMKV so flags are correct on frame zero — a worklet reading a
 * flag at first render never sees a wrong value then flip. Components subscribe
 * to ONE flag via a selector (see useAnimationFlag) so toggling "Art Rotation"
 * never re-renders a list row that only cares about "Slide-in".
 */
export const useAnimationStore = create<AnimationStoreState>()(
  persist(
    set => ({
      flags: DEFAULT_ANIMATION_FLAGS,
      fpsTarget: DEFAULT_FPS_TARGET,
      toggle: key =>
        set(state => ({
          flags: {...state.flags, [key]: !state.flags[key]},
        })),
      setFlag: (key, value) =>
        set(state => ({
          flags: {...state.flags, [key]: value},
        })),
      setFpsTarget: target => set({fpsTarget: target}),
    }),
    {
      name: StorageKeys.ANIMATION,
      storage: createJSONStorage(() => mmkvPersistStorage),
      /**
       * Merge persisted flags over defaults so that adding a NEW animation key
       * in a later app version is enabled-by-default rather than undefined.
       */
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AnimationStoreState>;
        return {
          ...current,
          ...p,
          flags: {...current.flags, ...(p.flags ?? {})},
        };
      },
    },
  ),
);
