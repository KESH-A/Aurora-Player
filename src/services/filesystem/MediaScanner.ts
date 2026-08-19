import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {SUPPORTED_AUDIO_EXTENSIONS} from '@constants/playback';
import type {Track} from '@domain/track';
import {parseMetadata} from './metadataParser';
import {extractArtwork} from './artworkExtractor';
import {log} from '@utils/logger';
import {shouldYieldBatch} from '@utils/perf';

/**
 * Recursive local audio scanner.
 *
 * Walks a set of root directories, finds supported audio files, then enriches
 * each with ID3 metadata + cached artwork. Metadata parsing is the expensive
 * part, so we stream results through an `onTrack` callback (and yield to the
 * event loop between files) to keep the UI responsive during large scans.
 */

const SUPPORTED = new Set<string>(SUPPORTED_AUDIO_EXTENSIONS);

function extOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/** Stable id from path so re-scans don't duplicate/relocate tracks. */
function idFromPath(path: string): string {
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = (hash << 5) - hash + path.charCodeAt(i);
    hash |= 0;
  }
  return `t_${(hash >>> 0).toString(36)}`;
}

function titleFromFilename(name: string): string {
  const dot = name.lastIndexOf('.');
  return (dot >= 0 ? name.slice(0, dot) : name).replace(/_/g, ' ').trim();
}

/** Default roots to scan when none are supplied. */
export function defaultScanRoots(): string[] {
  if (Platform.OS === 'android') {
    return [
      RNFS.ExternalStorageDirectoryPath
        ? `${RNFS.ExternalStorageDirectoryPath}/Music`
        : RNFS.DownloadDirectoryPath,
      RNFS.DownloadDirectoryPath,
    ].filter(Boolean);
  }
  return [RNFS.DocumentDirectoryPath];
}

async function collectAudioFiles(
  dir: string,
  out: RNFS.ReadDirItem[],
  depth: number,
): Promise<void> {
  if (depth > 8) {
    return; // guard against pathological nesting / symlink loops
  }
  let entries: RNFS.ReadDirItem[] = [];
  try {
    entries = await RNFS.readDir(dir);
  } catch {
    return; // unreadable directory; skip silently
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await collectAudioFiles(entry.path, out, depth + 1);
    } else if (entry.isFile() && SUPPORTED.has(extOf(entry.name))) {
      out.push(entry);
    }
  }
}

export interface ScanOptions {
  roots?: string[];
  onTrack?: (track: Track) => void;
  onProgress?: (done: number, total: number) => void;
  signal?: {readonly aborted: boolean};
}

export async function scanLibrary(options: ScanOptions = {}): Promise<Track[]> {
  const roots = options.roots ?? defaultScanRoots();
  const files: RNFS.ReadDirItem[] = [];

  for (const root of roots) {
    if (await RNFS.exists(root)) {
      await collectAudioFiles(root, files, 0);
    }
  }

  log.info('fs', `discovered ${files.length} audio files`);
  const tracks: Track[] = [];

  for (let i = 0; i < files.length; i++) {
    if (options.signal?.aborted) {
      log.info('fs', 'scan cancelled');
      break;
    }
    const file = files[i];
    const id = idFromPath(file.path);
    const meta = await parseMetadata(file.path);
    const artwork = await extractArtwork(id, meta);

    const track: Track = {
      id,
      uri: `file://${file.path}`,
      title: meta.title || titleFromFilename(file.name),
      artist: meta.artist || 'Unknown Artist',
      album: meta.album || 'Unknown Album',
      duration: 0, // resolved lazily by the player on load
      artwork,
      trackNumber: meta.trackNumber,
      genre: meta.genre,
      size: Number(file.size) || undefined,
    };

    tracks.push(track);
    options.onTrack?.(track);
    options.onProgress?.(i + 1, files.length);

    // Yield every few files so the JS thread can paint.
    if (shouldYieldBatch(i)) {
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    }
  }

  log.info('fs', `scan complete: ${tracks.length} tracks`);
  return tracks;
}
