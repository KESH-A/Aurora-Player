import type {AnimationFlags, FpsTarget} from '@domain/animation';

/**
 * Default enabled-state for every animation atom. All on by default — the app
 * ships fluid; users opt OUT of individual effects, never a single master kill.
 */
export const DEFAULT_ANIMATION_FLAGS: AnimationFlags = {
  playerArtRotation: true,
  listItemSlideIn: true,
  liquidWaveTransition: true,
  buttonPressScale: true,
  screenTransition: true,
  miniPlayerExpand: true,
  gradientFlow: true,
};

/**
 * Default render target. 60 is the safe universal default; users on 120Hz
 * panels can opt up in Performance settings.
 */
export const DEFAULT_FPS_TARGET: FpsTarget = 60;
