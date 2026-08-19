import {withTiming, withDelay, Easing} from 'react-native-reanimated';
import type {EntryAnimationsValues, EntryExitAnimationFunction} from 'react-native-reanimated';

/**
 * Staggered list-row entrance. Returns a Reanimated *layout entering* function
 * so it composes with FlashList item mounts. Gated by 'listItemSlideIn'.
 *
 * The stagger is derived from the row index (capped) so a fast scroll doesn't
 * queue hundreds of long delays.
 */
export function makeSlideIn(index: number): EntryExitAnimationFunction {
  const delay = Math.min(index, 12) * 28; // cap stagger to avoid long tails

  return (_values: EntryAnimationsValues) => {
    'worklet';
    return {
      initialValues: {
        opacity: 0,
        transform: [{translateY: 18}],
      },
      animations: {
        opacity: withDelay(delay, withTiming(1, {duration: 220})),
        transform: [
          {
            translateY: withDelay(
              delay,
              withTiming(0, {duration: 260, easing: Easing.out(Easing.cubic)}),
            ),
          },
        ],
      },
    };
  };
}
