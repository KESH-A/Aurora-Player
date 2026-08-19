import {useAnimationStore} from '@store/useAnimationStore';
import type {AnimationKey} from '@domain/animation';

/**
 * Reactively read a SINGLE animation flag.
 *
 * Uses a Zustand selector so the calling component only re-renders when *that
 * specific* flag changes — toggling any other animation is a no-op for it.
 * This selector-scoping is what makes the granular system cheap at scale.
 *
 *   const rotate = useAnimationFlag('playerArtRotation');
 *   if (rotate) { ...animate... }
 */
export function useAnimationFlag(key: AnimationKey): boolean {
  return useAnimationStore(state => state.flags[key]);
}
