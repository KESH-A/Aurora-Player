import React, {type ReactNode} from 'react';
import {View, StyleSheet, type ViewStyle, type StyleProp} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {useTheme} from '@hooks/useTheme';
import {resolveSurface} from '@themes/utils/resolveSurface';

interface BlurBackdropProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Force a specific radius; defaults to theme lg. */
  radius?: number;
}

/**
 * Translucent blurred panel — backing for the Transparent theme (wallpaper
 * reads through) and reused by GlassSurface. A tinted fill sits over the blur
 * to guarantee text contrast regardless of what's behind it.
 */
export function BlurBackdrop({children, style, radius}: BlurBackdropProps) {
  const {theme} = useTheme();
  const backing = resolveSurface(theme, 'blur');
  const r = radius ?? theme.radius.lg;

  return (
    <View style={[styles.base, {borderRadius: r}, style]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={theme.effect.blurTint === 'light' ? 'light' : 'dark'}
        blurAmount={theme.effect.blurAmount}
        reducedTransparencyFallbackColor={theme.colors.surface}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: backing.kind === 'blur' ? backing.fill : theme.colors.surface,
            borderRadius: r,
            borderColor: backing.kind === 'blur' ? backing.borderColor : theme.colors.border,
            borderWidth: StyleSheet.hairlineWidth,
          },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {overflow: 'hidden'},
});
