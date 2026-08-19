/**
 * Theme identifiers. Each maps to a token implementation in themes/registry.
 * Range of 6 ships now; the schema scales cleanly to 10.
 */
export type ThemeId =
  | 'liquidGlass'
  | 'transparent'
  | 'gradient'
  | 'simple'
  | 'darkCyber'
  | 'retroSynth';

/**
 * How a surface should be visually backed. The renderer maps this to a concrete
 * backing component (glass/blur/gradient/solid) in Phase 3.
 */
export type SurfaceKind = 'glass' | 'blur' | 'gradient' | 'solid';

/** Full token contract every theme must implement (fleshed out in Phase 3). */
export interface ThemeTokens {
  id: ThemeId;
  name: string;
  isDark: boolean;
  surface: SurfaceKind;
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    primary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
  };
  gradient?: string[];
  radius: {sm: number; md: number; lg: number; pill: number};
  blurAmount?: number;
}
