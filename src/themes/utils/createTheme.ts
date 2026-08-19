import type {
  ThemeTokens,
  TypographyScale,
  SurfaceEffect,
  ElevationToken,
} from '@themes/tokens/tokenSchema';
import {
  baseSpacing,
  baseRadius,
  baseTypography,
} from '@themes/tokens/baseTokens';

/**
 * Deep-ish merge tailored to the token shape. Each theme file supplies a small
 * override object; this factory fills the rest from the shared base scales so
 * theme authors focus purely on what makes the theme distinct.
 */

type ElevationOverride = Partial<{
  low: Partial<ElevationToken>;
  high: Partial<ElevationToken>;
}>;

export interface ThemeInput
  extends Omit<
    ThemeTokens,
    'typography' | 'spacing' | 'radius' | 'effect' | 'elevation'
  > {
  typography?: Partial<TypographyScale>;
  spacing?: Partial<ThemeTokens['spacing']>;
  radius?: Partial<ThemeTokens['radius']>;
  effect?: Partial<SurfaceEffect>;
  elevation?: ElevationOverride;
}

const defaultEffect: SurfaceEffect = {
  blurAmount: 0,
  blurTint: 'default',
  surfaceOpacity: 1,
  borderOpacity: 1,
  animatedGradient: false,
};

const makeElevation = (
  isDark: boolean,
  override?: ElevationOverride,
): ThemeTokens['elevation'] => {
  const shadowColor = isDark ? '#000000' : '#1A1A2E';
  const low: ElevationToken = {
    shadowColor,
    shadowOpacity: isDark ? 0.4 : 0.12,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
    ...override?.low,
  };
  const high: ElevationToken = {
    shadowColor,
    shadowOpacity: isDark ? 0.6 : 0.2,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 12},
    elevation: 12,
    ...override?.high,
  };
  return {low, high};
};

export function createTheme(input: ThemeInput): ThemeTokens {
  return {
    ...input,
    spacing: {...baseSpacing, ...input.spacing},
    radius: {...baseRadius, ...input.radius},
    typography: {
      ...baseTypography,
      ...input.typography,
      sizes: {...baseTypography.sizes, ...input.typography?.sizes},
      weights: baseTypography.weights,
    },
    effect: {...defaultEffect, ...input.effect},
    elevation: makeElevation(input.isDark, input.elevation),
  };
}
