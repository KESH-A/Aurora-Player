import React from 'react';
import {Text, StyleSheet, type TextProps, type TextStyle} from 'react-native';
import {useTheme} from '@hooks/useTheme';

type Variant = 'caption' | 'body' | 'subtitle' | 'title' | 'display';
type Tone = 'default' | 'muted' | 'primary' | 'accent' | 'onPrimary';

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  display?: boolean;
}

/**
 * Typography primitive. Pulls size/line-height/tracking/family from the active
 * theme so every label stays visually consistent and re-themes for free. Never
 * hardcode font size or color — use variant/tone.
 */
export function ThemedText({
  variant = 'body',
  tone = 'default',
  weight = 'regular',
  display = false,
  style,
  ...rest
}: ThemedTextProps) {
  const {theme} = useTheme();
  const {typography, colors} = theme;

  const toneColor: Record<Tone, string> = {
    default: colors.text,
    muted: colors.textMuted,
    primary: colors.primary,
    accent: colors.accent,
    onPrimary: colors.onPrimary,
  };

  const size = typography.sizes[variant];
  const resolved: TextStyle = {
    color: toneColor[tone],
    fontSize: size,
    lineHeight: Math.round(size * typography.lineHeight),
    letterSpacing: typography.tracking,
    fontFamily: display ? typography.displayFamily : typography.bodyFamily,
    fontWeight: typography.weights[weight],
  };

  return <Text style={[styles.base, resolved, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {includeFontPadding: false},
});
