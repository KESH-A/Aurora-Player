import {useMemo} from 'react';
import {useAnimationStore} from '@store/useAnimationStore';
import type {FpsTarget} from '@domain/animation';

export interface FpsProfile {
  target: FpsTarget;
  /** Milliseconds budget per frame (16.67ms @60, 8.33ms @120). */
  frameBudgetMs: number;
  /**
   * Throttle interval for JS-thread state mirrors (e.g. progress bar). At 120
   * we allow twice as many updates per second before dropping to keep the JS
   * thread from starving the UI thread.
   */
  jsUpdateIntervalMs: number;
}

/**
 * Resolve the active FPS target into a concrete pacing profile.
 *
 * The 60/120 selection does NOT force the display refresh rate (that is driven
 * by the OS + `maxFrameRate` in native config). What it controls here is how
 * aggressively we schedule JS-thread work: at 60 we throttle non-critical
 * updates harder to protect the frame budget; at 120 we loosen throttling.
 */
export function useFpsTarget(): FpsProfile {
  const target = useAnimationStore(state => state.fpsTarget);

  return useMemo<FpsProfile>(() => {
    const frameBudgetMs = 1000 / target;
    return {
      target,
      frameBudgetMs,
      // ~1 update/frame for progress-style mirrors, floored for safety.
      jsUpdateIntervalMs: target === 120 ? 250 : 500,
    };
  }, [target]);
}
