import type {ThemeTokens, SurfaceKind} from '@themes/tokens/tokenSchema';

/**
 * Maps a theme's SurfaceKind → the props a backing primitive needs. This keeps
 * the branching logic in ONE place: the surface components (GlassSurface,
 * BlurBackdrop, GradientFlow, SolidSurface) stay dumb and prop-driven.
 */

export type ResolvedBacking =
  | {kind: 'glass'; blurAmount: number; tint: string; fill: string; borderColor: string}
  | {kind: 'blur'; blurAmount: number; fill: string; borderColor: string}
  | {kind: 'gradient'; colors: string[]; start: [number, number]; end: [number, number]; fill: string}
  | {kind: 'solid'; fill: string; borderColor: string};

/** Applies an alpha to a hex or passes through rgba() strings untouched. */
function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('rgba') || color.startsWith('rgb')) {
    return color;
  }
  const hex = color.replace('#', '');
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function resolveSurface(
  theme: ThemeTokens,
  override?: SurfaceKind,
): ResolvedBacking {
  const kind = override ?? theme.surface;
  const {colors, effect, gradient, gradientDirection} = theme;

  switch (kind) {
    case 'glass':
      return {
        kind: 'glass',
        blurAmount: effect.blurAmount,
        tint: effect.blurTint,
        fill: withAlpha(colors.surface, effect.surfaceOpacity),
        borderColor: withAlpha(colors.border, effect.borderOpacity),
      };
    case 'blur':
      return {
        kind: 'blur',
        blurAmount: effect.blurAmount,
        fill: withAlpha(colors.surface, effect.surfaceOpacity),
        borderColor: withAlpha(colors.border, effect.borderOpacity),
      };
    case 'gradient':
      return {
        kind: 'gradient',
        colors: gradient,
        start: gradientDirection.start,
        end: gradientDirection.end,
        fill: withAlpha(colors.surface, effect.surfaceOpacity),
      };
    case 'solid':
    default:
      return {
        kind: 'solid',
        fill: colors.surface,
        borderColor: colors.border,
      };
  }
}
