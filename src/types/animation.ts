/**
 * Every individually toggleable animation in the app.
 *
 * Per the spec there is intentionally NO global "disable all animations" flag.
 * Each key here is an independent atom that a single component subscribes to.
 * Adding a new animation = add a key here + a default in animationDefaults.
 */
export type AnimationKey =
  | 'playerArtRotation'
  | 'listItemSlideIn'
  | 'liquidWaveTransition'
  | 'buttonPressScale'
  | 'screenTransition'
  | 'miniPlayerExpand'
  | 'gradientFlow';

export type AnimationFlags = Record<AnimationKey, boolean>;

/** User-selectable render target. Drives frame pacing in Phase 4. */
export type FpsTarget = 60 | 120;

export interface AnimationState {
  flags: AnimationFlags;
  fpsTarget: FpsTarget;
}
