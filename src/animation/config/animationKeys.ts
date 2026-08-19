import type {AnimationKey} from '@domain/animation';

/**
 * Presentation metadata for every toggleable animation.
 *
 * This is the single source the Settings panel maps over to render the granular
 * checkboxes — the UI never hardcodes the list, so adding an animation is:
 *   1. add the key to AnimationKey (types/animation.ts)
 *   2. add a default (animationDefaults.ts)
 *   3. add an entry here
 * ...and it appears in Settings automatically.
 */
export interface AnimationMeta {
  key: AnimationKey;
  label: string;
  description: string;
  /** Groups checkboxes into sections in the Settings UI. */
  group: 'Player' | 'Lists' | 'Transitions' | 'Interaction';
}

export const ANIMATION_META: readonly AnimationMeta[] = [
  {
    key: 'playerArtRotation',
    label: 'Player Art Rotation',
    description: 'Spin the album artwork while a track is playing.',
    group: 'Player',
  },
  {
    key: 'listItemSlideIn',
    label: 'List Item Slide-ins',
    description: 'Stagger-slide rows as the library list appears.',
    group: 'Lists',
  },
  {
    key: 'liquidWaveTransition',
    label: 'Liquid Wave Transitions',
    description: 'Ripple/wave effect between player states.',
    group: 'Transitions',
  },
  {
    key: 'buttonPressScale',
    label: 'Button Press Scale',
    description: 'Scale-down feedback when pressing controls.',
    group: 'Interaction',
  },
  {
    key: 'screenTransition',
    label: 'Screen Transitions',
    description: 'Animate navigation between screens.',
    group: 'Transitions',
  },
  {
    key: 'miniPlayerExpand',
    label: 'Mini-player Expand',
    description: 'Animate the mini-player expanding into the full player.',
    group: 'Player',
  },
  {
    key: 'gradientFlow',
    label: 'Gradient Flow',
    description: 'Continuously animate multi-color gradient backgrounds.',
    group: 'Transitions',
  },
] as const;

/** Ordered groups for section headers in the Settings panel. */
export const ANIMATION_GROUPS = [
  'Player',
  'Lists',
  'Transitions',
  'Interaction',
] as const;
