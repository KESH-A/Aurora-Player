import {
  withSequence,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

/**
 * Liquid "wave" pulse used between player states (e.g. track change). Drives a
 * 0→1→0 progress value that a component maps to scale/opacity/mask offset.
 * Gated by 'liquidWaveTransition'.
 */
export function triggerWave(progress: SharedValue<number>): void {
  'worklet';
  progress.value = withSequence(
    withTiming(1, {duration: 320, easing: Easing.out(Easing.quad)}),
    withTiming(0, {duration: 420, easing: Easing.in(Easing.quad)}),
  );
}
