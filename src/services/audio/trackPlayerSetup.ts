import TrackPlayer from 'react-native-track-player';
import {
  IOS_AUDIO_SESSION,
  PLAYER_SETUP_OPTIONS,
  UPDATE_OPTIONS,
} from '@constants/playback';
import {log} from '@utils/logger';

let isSetup = false;

/**
 * Idempotent TrackPlayer initialization.
 *
 * `setupPlayer` throws if called twice, and on fast JS reloads (Fast Refresh)
 * the module state can persist while the native player is already alive, so we
 * guard with both a module flag and a try/catch on the known "already
 * initialized" error.
 */
export async function setupTrackPlayer(): Promise<boolean> {
  if (isSetup) {
    return true;
  }

  try {
    await TrackPlayer.setupPlayer({
      minBuffer: PLAYER_SETUP_OPTIONS.minBuffer,
      maxBuffer: PLAYER_SETUP_OPTIONS.maxBuffer,
      playBuffer: PLAYER_SETUP_OPTIONS.playBuffer,
      backBuffer: PLAYER_SETUP_OPTIONS.backBuffer,
      ...IOS_AUDIO_SESSION,
    });

    await TrackPlayer.updateOptions({
      android: PLAYER_SETUP_OPTIONS.android,
      ...UPDATE_OPTIONS,
    });

    isSetup = true;
    log.info('audio', 'TrackPlayer initialized');
    return true;
  } catch (err) {
    // Error code 'player_already_initialized' means a previous setup survived.
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('already')) {
      isSetup = true;
      log.warn('audio', 'TrackPlayer was already initialized — reusing');
      return true;
    }
    log.error('audio', 'TrackPlayer setup failed', message);
    return false;
  }
}

export function isPlayerReady(): boolean {
  return isSetup;
}
