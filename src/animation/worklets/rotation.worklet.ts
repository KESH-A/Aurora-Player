import {
  withRepeat,
  withTiming,
  cancelAnimation,
  type SharedValue,
} from 'react-native-reanimated';
import {Timings} from '@animation/config/springPresets';

/**
 * Continuous album-art rotation. Runs a linear 0→360 loop entirely on the UI
 * thread. Gated by the 'playerArtRotation' flag at the call site.
 *
 * `speedScale` lets the caller slow/speed the loop (e.g. 1 = 8s per turn).
 */
export function startRotation(rotation: SharedValue<number>, speedScale = 1): void {
  'worklet';
  rotation.value = withRepeat(
    withTiming(360, {
      ...Timings.loop,
      duration: Timings.loop.duration * speedScale,
    }),
    -1, // infinite
    false, // no reverse — continuous spin
  );
}

/**
 * Stop rotation and reset. Called when playback pauses or the flag turns off,
 * so we never leave an orphaned infinite animation eating UI-thread cycles.
 */
export function stopRotation(rotation: SharedValue<number>, reset = false): void {
  'worklet';
  cancelAnimation(rotation);
  if (reset) {
    rotation.value = 0;
  }
}
