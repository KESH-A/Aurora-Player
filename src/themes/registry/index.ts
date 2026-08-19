import type {ThemeId, ThemeTokens} from '@themes/tokens/tokenSchema';
import {liquidGlassTheme} from './liquidGlass.theme';
import {transparentTheme} from './transparent.theme';
import {gradientTheme} from './gradient.theme';
import {simpleTheme} from './simple.theme';
import {darkCyberTheme} from './darkCyber.theme';
import {retroSynthTheme} from './retroSynth.theme';

/**
 * THE THEME REGISTRY
 * The single source of truth mapping a ThemeId → its tokens. Adding a 7th–10th
 * theme means importing it here and adding it to `THEME_ORDER`; nothing else in
 * the app needs to change.
 */
export const THEMES: Record<ThemeId, ThemeTokens> = {
  liquidGlass: liquidGlassTheme,
  transparent: transparentTheme,
  gradient: gradientTheme,
  simple: simpleTheme,
  darkCyber: darkCyberTheme,
  retroSynth: retroSynthTheme,
};

/** Display order in the theme picker (Phase 5 settings). */
export const THEME_ORDER: ThemeId[] = [
  'liquidGlass',
  'transparent',
  'gradient',
  'simple',
  'darkCyber',
  'retroSynth',
];

/** Fallback used before hydration / if a persisted id is unknown. */
export const DEFAULT_THEME_ID: ThemeId = 'liquidGlass';

export function getTheme(id: ThemeId | undefined): ThemeTokens {
  return (id && THEMES[id]) || THEMES[DEFAULT_THEME_ID];
}

/** Lightweight metadata for rendering swatches without pulling full tokens. */
export interface ThemeMeta {
  id: ThemeId;
  name: string;
  description: string;
  swatch: string[];
}

export const THEME_META: ThemeMeta[] = THEME_ORDER.map(id => {
  const t = THEMES[id];
  return {
    id,
    name: t.name,
    description: t.description,
    swatch: [t.colors.primary, t.colors.accent, t.colors.background],
  };
});
