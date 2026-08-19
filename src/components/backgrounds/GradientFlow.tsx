import React, {type ReactNode, useEffect} from 'react';
import {StyleSheet, type ViewStyle, type StyleProp} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import {useTheme} from '@hooks/useTheme';
import {useAnimationFlag} from '@animation/hooks/useAnimationFlag';

interface GradientFlowProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Render as a full-screen backdrop (absolute fill). */
  fill?: boolean;
}

/**
 * Multi-color gradient surface — backing for the Gradient and Retro Synth
 * themes.
 *
 * Motion is gated by TWO conditions: the theme must opt in
 * (effect.animatedGradient) AND the user's granular 'gradientFlow' flag must be
 * on. When either is false this collapses to a static, zero-cost gradient.
 *
 * The flow is achieved by translating an oversized gradient layer (transforms
 * run entirely on the UI thread) rather than animating gradient anchor props,
 * which would thrash the JS thread.
 */
export function GradientFlow({children, style, fill = false}: GradientFlowProps) {
  const {theme} = useTheme();
  const flagOn = useAnimationFlag('gradientFlow');
  const animate = theme.effect.animatedGradient && flagOn;

  const progress = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      progress.value = withRepeat(
        withTiming(1, {duration: 9000, easing: Easing.inOut(Easing.quad)}),
        -1,
        true, // reverse for a gentle back-and-forth flow
      );
    } else {
      cancelAnimation(progress);
      progress.value = 0;
    }
    return () => cancelAnimation(progress);
  }, [animate, progress]);

  const layerStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: interpolate(progress.value, [0, 1], [-0.15, 0.15]) * 100},
      {translateY: interpolate(progress.value, [0, 1], [0.1, -0.1]) * 100},
    ],
  }));

  const gradientEl = (
    <LinearGradient
      colors={theme.gradient}
      start={{x: theme.gradientDirection.start[0], y: theme.gradientDirection.start[1]}}
      end={{x: theme.gradientDirection.end[0], y: theme.gradientDirection.end[1]}}
      style={StyleSheet.absoluteFill}
    />
  );

  // Static fast-path: no animated wrapper, no overdraw.
  if (!animate) {
    return (
      <LinearGradient
        colors={theme.gradient}
        start={{x: theme.gradientDirection.start[0], y: theme.gradientDirection.start[1]}}
        end={{x: theme.gradientDirection.end[0], y: theme.gradientDirection.end[1]}}
        style={[fill ? StyleSheet.absoluteFill : undefined, style]}>
        {children}
      </LinearGradient>
    );
  }

  return (
    <Animated.View style={[fill ? StyleSheet.absoluteFill : undefined, styles.clip, style]}>
      <Animated.View style={[styles.oversized, layerStyle]}>{gradientEl}</Animated.View>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  clip: {overflow: 'hidden'},
  // Oversized so the translate never reveals an edge.
  oversized: {
    position: 'absolute',
    top: '-30%',
    left: '-30%',
    right: '-30%',
    bottom: '-30%',
  },
});
