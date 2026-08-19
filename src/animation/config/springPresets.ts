import type {WithSpringConfig, WithTimingConfig} from 'react-native-reanimated';
import {Easing} from 'react-native-reanimated';

/**
 * Centralized motion configs. Every worklet pulls from here so timing/feel is
 * consistent app-wide and tunable in one place during Phase 6 polish.
 *
 * These are plain serializable objects — safe to read from inside worklets.
 */
export const Springs = {
  /** Snappy UI feedback (button press, toggles). */
  snappy: {
    damping: 18,
    stiffness: 320,
    mass: 0.6,
    overshootClamping: false,
  } satisfies WithSpringConfig,

  /** Smooth, slightly bouncy (mini-player expand, cards). */
  gentle: {
    damping: 15,
    stiffness: 140,
    mass: 1,
  } satisfies WithSpringConfig,

  /** Heavy, deliberate (screen-level transitions). */
  heavy: {
    damping: 22,
    stiffness: 90,
    mass: 1.2,
  } satisfies WithSpringConfig,
} as const;

export const Timings = {
  fast: {duration: 160, easing: Easing.out(Easing.cubic)} satisfies WithTimingConfig,
  base: {duration: 260, easing: Easing.inOut(Easing.cubic)} satisfies WithTimingConfig,
  slow: {duration: 420, easing: Easing.inOut(Easing.cubic)} satisfies WithTimingConfig,
  /** Linear loop used by continuous motion (art rotation, gradient flow). */
  loop: {duration: 8000, easing: Easing.linear} satisfies WithTimingConfig,
} as const;
