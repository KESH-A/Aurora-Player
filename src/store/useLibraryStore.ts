import {create} from 'zustand';
import type {Track, Album, Artist} from '@domain/track';

/**
 * The scanned media library + derived album/artist groupings.
 *
 * Not persisted via zustand/persist: the track list can be large and is cheap
 * to re-derive, so we keep the hot copy in memory here and let MediaScanner /
 * an explicit cache (Phase 6) own durability. Albums and artists are computed
 * once per scan to avoid recomputing groupings on every render.
 */
export type ScanStatus = 'idle' | 'requesting-permission' | 'scanning' | 'ready' | 'error';

interface LibraryState {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  scanStatus: ScanStatus;
  scanProgress: number; // 0..1
  error?: string;

  setScanStatus: (status: ScanStatus, error?: string) => void;
  setScanProgress: (progress: number) => void;
  setTracks: (tracks: Track[]) => void;
}

function deriveGroupings(tracks: Track[]): {albums: Album[]; artists: Artist[]} {
  const albumMap = new Map<string, Album>();
  const artistMap = new Map<string, Artist>();

  for (const t of tracks) {
    const albumId = `${t.artist}::${t.album}`;
    let album = albumMap.get(albumId);
    if (!album) {
      album = {
        id: albumId,
        title: t.album,
        artist: t.artist,
        artwork: t.artwork,
        trackIds: [],
      };
      albumMap.set(albumId, album);
    }
    album.trackIds.push(t.id);
    if (!album.artwork && t.artwork) {
      album.artwork = t.artwork;
    }

    let artist = artistMap.get(t.artist);
    if (!artist) {
      artist = {id: t.artist, name: t.artist, albumIds: [], trackIds: []};
      artistMap.set(t.artist, artist);
    }
    artist.trackIds.push(t.id);
    if (!artist.albumIds.includes(albumId)) {
      artist.albumIds.push(albumId);
    }
  }

  return {
    albums: Array.from(albumMap.values()),
    artists: Array.from(artistMap.values()),
  };
}

export const useLibraryStore = create<LibraryState>(set => ({
  tracks: [],
  albums: [],
  artists: [],
  scanStatus: 'idle',
  scanProgress: 0,

  setScanStatus: (scanStatus, error) => set({scanStatus, error}),
  setScanProgress: scanProgress => set({scanProgress}),
  setTracks: tracks => {
    const {albums, artists} = deriveGroupings(tracks);
    set({tracks, albums, artists});
  },
}));
