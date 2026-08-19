import {
  AppKilledPlaybackBehavior,
  Capability,
  IOSCategory,
  IOSCategoryMode,
  RepeatMode,
} from 'react-native-track-player';

/**
 * Centralized TrackPlayer configuration.
 *
 * These objects are intentionally declared once so the lock-screen / notification
 * controls, the iOS audio session, and the in-app controller all agree on a
 * single source of truth for capabilities.
 */

/** Audio file extensions the scanner is allowed to ingest. */
export const SUPPORTED_AUDIO_EXTENSIONS = [
  'mp3',
  'm4a',
  'aac',
  'wav',
  'flac',
  'ogg',
  'opus',
] as const;

/** Capabilities surfaced on the lock screen + notification. */
export const PLAYBACK_CAPABILITIES: Capability[] = [
  Capability.Play,
  Capability.Pause,
  Capability.SkipToNext,
  Capability.SkipToPrevious,
  Capability.SeekTo,
  Capability.Stop,
];

/** Compact subset shown when the notification is collapsed. */
export const COMPACT_CAPABILITIES: Capability[] = [
  Capability.Play,
  Capability.Pause,
  Capability.SkipToNext,
  Capability.SkipToPrevious,
];

export const PLAYER_SETUP_OPTIONS = {
  // Keep audio alive when the app is swiped away, but stop cleanly on kill.
  android: {
    appKilledPlaybackBehavior:
      AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
  },
  // Largest buffer we tolerate before playback can begin (ms). Low = snappy.
  minBuffer: 15,
  maxBuffer: 50,
  playBuffer: 2.5,
  backBuffer: 0,
} as const;

export const IOS_AUDIO_SESSION = {
  iosCategory: IOSCategory.Playback,
  iosCategoryMode: IOSCategoryMode.Default,
} as const;

export const UPDATE_OPTIONS = {
  capabilities: PLAYBACK_CAPABILITIES,
  compactCapabilities: COMPACT_CAPABILITIES,
  notificationCapabilities: PLAYBACK_CAPABILITIES,
  progressUpdateEventInterval: 1, // seconds; drives lock-screen scrubber
} as const;

export const DEFAULT_REPEAT_MODE = RepeatMode.Off;

/** Re-export so call sites import enums from one module. */
export {RepeatMode, Capability};
