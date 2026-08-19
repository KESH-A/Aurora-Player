import type {
  SpacingScale,
  RadiusScale,
  TypographyScale,
} from './tokenSchema';

/**
 * Shared scales. Themes inherit these by default and override only what makes
 * them visually distinct (e.g. Retro Synth swaps the display family and bumps
 * tracking; Simple flattens the radius). Keeping the rhythm consistent across
 * themes is what makes theme-switching feel like a reskin, not a relayout.
 */

export const baseSpacing: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const baseRadius: RadiusScale = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};

export const baseWeights: TypographyScale['weights'] = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const baseSizes: TypographyScale['sizes'] = {
  caption: 12,
  body: 15,
  subtitle: 17,
  title: 22,
  display: 34,
};

/** System-font defaults; individual themes may swap the families. */
export const baseTypography: TypographyScale = {
  displayFamily: 'System',
  bodyFamily: 'System',
  sizes: baseSizes,
  weights: baseWeights,
  lineHeight: 1.45,
  tracking: 0,
};
