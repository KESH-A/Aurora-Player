import TrackPlayer, {Event} from 'react-native-track-player';
import {log} from '@utils/logger';

/**
 * Remote-control event service.
 *
 * This function is registered with TrackPlayer at the JS entry point and runs
 * in its own headless context so lock-screen / notification / headset controls
 * keep working even when the UI is backgrounded. It must NOT touch React state
 * directly — it only drives the native player. The Zustand stores subscribe to
 * playback events separately (see usePlayerStore).
 */
export async function PlaybackService(): Promise<void> {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    log.info('audio', 'remote: play');
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    log.info('audio', 'remote: pause');
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    log.info('audio', 'remote: stop');
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext().catch(() => {});
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious().catch(() => {});
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({position}) => {
    TrackPlayer.seekTo(position);
  });

  // Auto-pause on transient audio focus loss (calls, other apps).
  TrackPlayer.addEventListener(Event.RemoteDuck, async ({paused, permanent}) => {
    if (permanent) {
      await TrackPlayer.pause();
      return;
    }
    if (paused) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  });
}
