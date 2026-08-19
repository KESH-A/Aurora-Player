import React, {useCallback} from 'react';
import {Pressable, type PressableProps, type ViewStyle, type StyleProp} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {useAnimationFlag} from '@animation/hooks/useAnimationFlag';
import {pressIn, pressOut} from '@animation/worklets/pressScale.worklet';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pressable with scale-down feedback, gated by the 'buttonPressScale' flag.
 *
 * This is the reference implementation of a granular animation consumer: it
 * subscribes to exactly ONE flag; when disabled the press handlers become
 * no-ops and the animated style resolves to scale 1 (a plain button), with zero
 * worklet scheduling. Toggling any other animation never re-renders this.
 */
export function PressableScale({
  children,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const enabled = useAnimationFlag('buttonPressScale');
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = useCallback<NonNullable<PressableProps['onPressIn']>>(
    event => {
      if (enabled) {
        pressIn(scale);
      }
      onPressIn?.(event);
    },
    [enabled, scale, onPressIn],
  );

  const handlePressOut = useCallback<NonNullable<PressableProps['onPressOut']>>(
    event => {
      if (enabled) {
        pressOut(scale);
      }
      onPressOut?.(event);
    },
    [enabled, scale, onPressOut],
  );

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}>
      {children}
    </AnimatedPressable>
  );
}
