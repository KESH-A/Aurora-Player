import React, {type ReactNode} from 'react';
import type {ViewStyle, StyleProp} from 'react-native';
import type {SurfaceKind} from '@themes/tokens/tokenSchema';
import {useTheme} from '@hooks/useTheme';
import {GlassSurface} from './GlassSurface';
import {BlurBackdrop} from './BlurBackdrop';
import {GradientFlow} from './GradientFlow';
import {SolidSurface} from './SolidSurface';

interface SurfaceProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Force a backing kind; defaults to the active theme's surface. */
  kind?: SurfaceKind;
  alt?: boolean;
}

/**
 * Theme-aware panel dispatcher. Components use <Surface> and automatically get
 * the correct backing (glass / blur / gradient / solid) for whatever theme is
 * active — this is the single seam between "a panel" and "how this theme paints
 * panels", so screens never branch on theme id.
 */
export function Surface({children, style, kind, alt}: SurfaceProps) {
  const {theme} = useTheme();
  const resolved = kind ?? theme.surface;

  switch (resolved) {
    case 'glass':
      return <GlassSurface style={style}>{children}</GlassSurface>;
    case 'blur':
      return <BlurBackdrop style={style}>{children}</BlurBackdrop>;
    case 'gradient':
      return <GradientFlow style={style}>{children}</GradientFlow>;
    case 'solid':
    default:
      return (
        <SolidSurface style={style} alt={alt}>
          {children}
        </SolidSurface>
      );
  }
}
