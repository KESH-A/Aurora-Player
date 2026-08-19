import TrackPlayer, {RepeatMode, Track as RNTrack} from 'react-native-track-player';
import type {Track} from '@domain/track';
import {log} from '@utils/logger';

/**
 * Thin, UI-friendly facade over TrackPlayer.
 *
 * Screens and stores call into this module instead of importing TrackPlayer
 * directly, so the playback backend can be swapped later without touching UI.
 * It also handles the mapping between our `Track` shape and TrackPlayer's.
 */

function toRNTrack(track: Track): RNTrack {
  return {
    id: track.id,
    url: track.uri,
    title: track.title,
    artist: track.artist,
    album: track.album,
    duration: track.duration,
    artwork: track.artwork,
  };
}

export const playback = {
  /** Replace the queue and start at a given index. */
  async setQueue(tracks: Track[], startIndex = 0): Promise<void> {
    await TrackPlayer.reset();
    await TrackPlayer.add(tracks.map(toRNTrack));
    if (startIndex > 0) {
      await TrackPlayer.skip(startIndex);
    }
    log.info('audio', `queue set: ${tracks.length} tracks, start ${startIndex}`);
  },

  async play(): Promise<void> {
    await TrackPlayer.play();
  },

  async pause(): Promise<void> {
    await TrackPlayer.pause();
  },

  async toggle(): Promise<void> {
    const state = await TrackPlayer.getPlaybackState();
    const playing = state.state === 'playing';
    if (playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  },

  async next(): Promise<void> {
    try {
      await TrackPlayer.skipToNext();
    } catch {
      // No next track; ignore.
    }
  },

  async previous(): Promise<void> {
    // Mirror common UX: restart current track if >3s elapsed.
    const position = await TrackPlayer.getPosition();
    if (position > 3) {
      await TrackPlayer.seekTo(0);
      return;
    }
    try {
      await TrackPlayer.skipToPrevious();
    } catch {
      await TrackPlayer.seekTo(0);
    }
  },

  async seekTo(seconds: number): Promise<void> {
    await TrackPlayer.seekTo(seconds);
  },

  async skipToIndex(index: number): Promise<void> {
    await TrackPlayer.skip(index);
  },

  async setRepeatMode(mode: RepeatMode): Promise<void> {
    await TrackPlayer.setRepeatMode(mode);
  },

  async stop(): Promise<void> {
    await TrackPlayer.stop();
  },
};

export const play = playback.play;
export const pause = playback.pause;
export const skipToNext = playback.next;
export const skipToPrevious = playback.previous;
export const seekTo = playback.seekTo;
