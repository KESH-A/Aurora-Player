import React from 'react';
import {View, type ViewProps} from 'react-native';
import {useTheme} from '@hooks/useTheme';

interface ThemedViewProps extends ViewProps {
  /** Fill with the theme background color (default false = transparent). */
  background?: boolean;
}

/**
 * Minimal themed container. Transparent by default so it composes over the
 * ScreenBackground / Surface layers without painting an opaque rectangle.
 */
export function ThemedView({background = false, style, ...rest}: ThemedViewProps) {
  const {theme} = useTheme();
  return (
    <View
      style={[background && {backgroundColor: theme.colors.background}, style]}
      {...rest}
    />
  );
}
