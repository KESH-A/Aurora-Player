import React, {type ReactNode} from 'react';
import {View, StyleSheet, type ViewStyle, type StyleProp} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@hooks/useTheme';
import {resolveSurface} from '@themes/utils/resolveSurface';

interface GlassSurfaceProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
}

/**
 * LIQUID GLASS panel. Three stacked layers create the frosted-glass read:
 *   1. BlurView            — frosts whatever is behind.
 *   2. Tinted fill         — the glass body (low-opacity theme surface).
 *   3. Top-edge highlight  — a subtle white gradient sheen + bright hairline,
 *                            which is what sells "glass" vs. "just blurry".
 */
export function GlassSurface({children, style, radius}: GlassSurfaceProps) {
  const {theme} = useTheme();
  const backing = resolveSurface(theme, 'glass');
  const r = radius ?? theme.radius.lg;
  const fill = backing.kind === 'glass' ? backing.fill : theme.colors.surface;
  const borderColor = backing.kind === 'glass' ? backing.borderColor : theme.colors.border;

  return (
    <View style={[styles.base, {borderRadius: r}, style]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={theme.effect.blurTint === 'light' ? 'light' : 'dark'}
        blurAmount={theme.effect.blurAmount}
        reducedTransparencyFallbackColor={theme.colors.surface}
      />
      <View style={[StyleSheet.absoluteFill, {backgroundColor: fill}]} />
      <LinearGradient
        colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']}
        locations={[0, 0.4, 1]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {borderRadius: r, borderColor, borderWidth: 1},
        ]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {overflow: 'hidden'},
});
