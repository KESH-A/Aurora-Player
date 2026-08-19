import {useEffect} from 'react';
import {useProgress} from 'react-native-track-player';
import {usePlayerStore} from '@store/usePlayerStore';

/**
 * Bridges TrackPlayer's progress into the Zustand store.
 *
 * `useProgress` polls on a fixed interval off the UI thread; we mirror it into
 * the store so any component can read position/duration via a cheap selector
 * without each one subscribing to the player. Mount this once near the root.
 *
 * @param intervalMs poll cadence — 250ms is smooth for a scrubber without
 *   spamming re-renders. Tighten to ~100ms only on the active Player screen.
 */
export function usePlayerProgress(intervalMs = 250): void {
  const {position, duration} = useProgress(intervalMs);
  const setProgress = usePlayerStore(s => s.setProgress);

  useEffect(() => {
    setProgress(position, duration);
  }, [position, duration, setProgress]);
}
