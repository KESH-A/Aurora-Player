/**
 * The canonical shape of a local audio track after scanning + metadata parsing.
 * Populated by the filesystem services in Phase 2.
 */
export interface Track {
  id: string;
  /** Absolute local file path / content URI. */
  uri: string;
  title: string;
  artist: string;
  album: string;
  /** Duration in seconds. */
  duration: number;
  /** Local cached artwork path, if extracted. */
  artwork?: string;
  trackNumber?: number;
  genre?: string;
  /** File size in bytes (for cache/profiling decisions). */
  size?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  trackIds: string[];
}

export interface Artist {
  id: string;
  name: string;
  albumIds: string[];
  trackIds: string[];
}
