import TrackPlayer from 'react-native-track-player';
import {PlaybackService} from '@services/audio/PlaybackService';

/**
 * Registers the headless remote-control service with TrackPlayer.
 *
 * Must be called at the JS entry point (index.js), exactly once, and BEFORE the
 * React tree mounts — otherwise lock-screen controls won't be wired when audio
 * begins. Kept in its own module so the entry file stays declarative.
 */
export function registerPlaybackService(): void {
  TrackPlayer.registerPlaybackService(() => PlaybackService);
}
