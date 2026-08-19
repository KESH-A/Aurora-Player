import React, {type ReactNode} from 'react';
import {View, StyleSheet, type ViewStyle, type StyleProp} from 'react-native';
import {useTheme} from '@hooks/useTheme';

interface SolidSurfaceProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Use the alternate (secondary) surface fill. */
  alt?: boolean;
  bordered?: boolean;
}

/**
 * Flat, opaque panel — the backing for the Simple and Dark Cyber themes and the
 * cheapest surface to render (no blur/gradient layers).
 */
export function SolidSurface({
  children,
  style,
  alt = false,
  bordered = true,
}: SolidSurfaceProps) {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: alt ? theme.colors.surfaceAlt : theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderColor: theme.colors.border,
          borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {overflow: 'hidden'},
});
