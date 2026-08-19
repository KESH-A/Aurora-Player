import {useEffect} from 'react';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {usePlayerStore, type PlaybackStatus} from '@store/usePlayerStore';
import {useQueueStore} from '@store/useQueueStore';

const EVENTS = [
  Event.PlaybackState,
  Event.PlaybackActiveTrackChanged,
  Event.PlaybackError,
];

function mapState(state: State | undefined): PlaybackStatus {
  switch (state) {
    case State.Playing:
      return 'playing';
    case State.Paused:
      return 'paused';
    case State.Stopped:
    case State.None:
      return 'stopped';
    case State.Loading:
    case State.Buffering:
      return 'loading';
    default:
      return 'idle';
  }
}

/**
 * Keeps usePlayerStore in sync with the native player.
 *
 * This is the single authoritative event bridge — it reacts to state changes
 * and active-track changes, then reads the corresponding Track out of the
 * persisted queue so the UI always reflects what the native player is doing,
 * even after a background kill/restore. Mount once near the root.
 */
export function useNowPlaying(): void {
  const setStatus = usePlayerStore(s => s.setStatus);
  const setCurrent = usePlayerStore(s => s.setCurrent);

  useTrackPlayerEvents(EVENTS, async event => {
    if (event.type === Event.PlaybackState) {
      setStatus(mapState(event.state));
    }

    if (event.type === Event.PlaybackActiveTrackChanged) {
      const index = event.index ?? -1;
      const queue = useQueueStore.getState().queue;
      const track = index >= 0 ? queue[index] ?? null : null;
      setCurrent(track, index);
    }
  });

  // On mount, sync once in case playback was already active (restore-from-kill).
  useEffect(() => {
    (async () => {
      const state = await TrackPlayer.getPlaybackState();
      setStatus(mapState(state.state));
      const index = await TrackPlayer.getActiveTrackIndex();
      if (index != null && index >= 0) {
        const queue = useQueueStore.getState().queue;
        setCurrent(queue[index] ?? null, index);
      }
    })().catch(() => {});
  }, [setStatus, setCurrent]);
}
