import {useCallback} from 'react';
import {
  withTiming,
  withSpring,
  type WithTimingConfig,
  type WithSpringConfig,
} from 'react-native-reanimated';
import type {AnimationKey} from '@domain/animation';
import {useAnimationFlag} from './useAnimationFlag';

export interface ConditionalAnim {
  /** True when this animation atom is enabled by the user. */
  enabled: boolean;
  /**
   * Animate to a value with timing IF enabled, otherwise jump instantly.
   * Either way the shared value ends at `toValue` — disabling an animation
   * never leaves the UI in a wrong visual state, it only removes the motion.
   */
  timing: (toValue: number, config?: WithTimingConfig) => number;
  /** Same contract as `timing`, using spring physics. */
  spring: (toValue: number, config?: WithSpringConfig) => number;
}

/**
 * Bridges a granular animation flag into worklet-safe motion helpers.
 *
 * The `enabled` boolean is captured at render; when the user toggles the flag
 * the component re-renders and the worklet closures re-derive with the new
 * value. Consumers write motion once and get correct static fallback for free:
 *
 *   const art = useConditionalAnim('playerArtRotation');
 *   rotate.value = art.timing(360, Timings.loop);
 */
export function useConditionalAnim(key: AnimationKey): ConditionalAnim {
  const enabled = useAnimationFlag(key);

  const timing = useCallback(
    (toValue: number, config?: WithTimingConfig): number => {
      'worklet';
      return enabled ? withTiming(toValue, config) : toValue;
    },
    [enabled],
  );

  const spring = useCallback(
    (toValue: number, config?: WithSpringConfig): number => {
      'worklet';
      return enabled ? withSpring(toValue, config) : toValue;
    },
    [enabled],
  );

  return {enabled, timing, spring};
}
