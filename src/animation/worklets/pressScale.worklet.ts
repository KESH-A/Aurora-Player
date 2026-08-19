import {withSpring, type SharedValue} from 'react-native-reanimated';
import {Springs} from '@animation/config/springPresets';

/** Scale target when a control is pressed in. Consumed by PressableScale. */
export const PRESS_SCALE_IN = 0.94;
export const PRESS_SCALE_OUT = 1;

export function pressIn(scale: SharedValue<number>): void {
  'worklet';
  scale.value = withSpring(PRESS_SCALE_IN, Springs.snappy);
}

export function pressOut(scale: SharedValue<number>): void {
  'worklet';
  scale.value = withSpring(PRESS_SCALE_OUT, Springs.snappy);
}
