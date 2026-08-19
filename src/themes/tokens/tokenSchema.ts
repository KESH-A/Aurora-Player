import type {ThemeId, SurfaceKind} from '@domain/theme';

/**
 * THE THEME CONTRACT
 * ------------------
 * Every theme in `themes/registry` implements this exact interface. Because the
 * shape is fixed, components read tokens by name (never hardcoded colors) and a
 * 7th–10th theme is purely additive: one new file, zero component changes.
 *
 * This is a superset of the Phase 1 `ThemeTokens` stub — it adds typography,
 * spacing, elevation and surface-effect params so the six visual directions
 * (glass / blur / gradient / solid) are fully expressible from tokens alone.
 */

export type {ThemeId, SurfaceKind};

export interface ColorTokens {
  /** App root backdrop. */
  background: string;
  /** Primary card/panel fill. */
  surface: string;
  /** Secondary fill (rows, insets, pressed states). */
  surfaceAlt: string;
  /** Brand color — active controls, progress fill, selection. */
  primary: string;
  /** Contrast color on top of `primary`. */
  onPrimary: string;
  /** Secondary highlight — glow, secondary CTAs. */
  accent: string;
  /** Primary readable text. */
  text: string;
  /** De-emphasized text (subtitles, metadata). */
  textMuted: string;
  /** Hairline borders / dividers. */
  border: string;
  /** Overlay scrim behind modals/sheets. */
  scrim: string;
}

export interface TypographyScale {
  /** Font family for display/headers. */
  displayFamily: string;
  /** Font family for body/UI text. */
  bodyFamily: string;
  sizes: {
    caption: number;
    body: number;
    subtitle: number;
    title: number;
    display: number;
  };
  weights: {
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
  };
  /** Multiplier applied to font size for line height. */
  lineHeight: number;
  /** Extra letter spacing (Retro/Cyber lean positive). */
  tracking: number;
}

export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface RadiusScale {
  sm: number;
  md: number;
  lg: number;
  pill: number;
}

/** Parameters consumed by the surface-backing primitives (Phase 3 components). */
export interface SurfaceEffect {
  /** Blur intensity for glass/blur surfaces (0 = none). */
  blurAmount: number;
  /** Blur tint for iOS/Android BlurView. */
  blurTint: 'light' | 'dark' | 'default';
  /** Fill opacity applied over the blur (glassmorphism sheen). */
  surfaceOpacity: number;
  /** Border opacity — glass themes use a bright hairline for the "edge" look. */
  borderOpacity: number;
  /** Whether this theme paints an animated gradient behind content. */
  animatedGradient: boolean;
}

export interface ElevationToken {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: {width: number; height: number};
  elevation: number;
}

export interface ThemeTokens {
  id: ThemeId;
  name: string;
  /** Short human description shown in the theme picker. */
  description: string;
  isDark: boolean;
  /** Default backing kind for primary surfaces in this theme. */
  surface: SurfaceKind;
  colors: ColorTokens;
  typography: TypographyScale;
  spacing: SpacingScale;
  radius: RadiusScale;
  effect: SurfaceEffect;
  elevation: {low: ElevationToken; high: ElevationToken};
  /** Gradient stops — required for `gradient`, optional accent elsewhere. */
  gradient: string[];
  /** Direction hint for gradients: [startX,startY]→[endX,endY] (0..1). */
  gradientDirection: {start: [number, number]; end: [number, number]};
}
