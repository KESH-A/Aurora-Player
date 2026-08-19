import {create} from 'zustand';
import type {Track} from '@domain/track';

/**
 * Runtime playback state.
 *
 * This store is the React-facing mirror of the native player. It is NOT
 * persisted — it's reconstructed from TrackPlayer events on launch. The event
 * bridge that keeps this in sync (Event.PlaybackActiveTrackChanged, State, etc.)
 * is installed by useNowPlaying so the store stays a pure state container.
 */
export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped';

interface PlayerState {
  status: PlaybackStatus;
  currentTrack: Track | null;
  currentIndex: number;
  /** Live position/duration in seconds (updated by usePlayerProgress). */
  position: number;
  duration: number;

  setStatus: (status: PlaybackStatus) => void;
  setCurrent: (track: Track | null, index: number) => void;
  setProgress: (position: number, duration: number) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>(set => ({
  status: 'idle',
  currentTrack: null,
  currentIndex: -1,
  position: 0,
  duration: 0,

  setStatus: status => set({status}),
  setCurrent: (currentTrack, currentIndex) => set({currentTrack, currentIndex}),
  setProgress: (position, duration) => set({position, duration}),
  reset: () =>
    set({
      status: 'idle',
      currentTrack: null,
      currentIndex: -1,
      position: 0,
      duration: 0,
    }),
}));
