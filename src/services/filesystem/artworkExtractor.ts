import RNFS from 'react-native-fs';
import {artworkPathFor, ensureCacheDirs} from '@services/cache/cachePaths';
import type {ParsedMetadata} from './metadataParser';
import {log} from '@utils/logger';
import {ArtworkCache} from '@services/cache/ArtworkCache';

/**
 * Writes embedded APIC artwork to the cache directory and returns a file path
 * the UI can render directly. We persist the bytes to disk (rather than holding
 * base64 in memory or in the store) so artwork survives reloads and never bloats
 * the JS heap — critical for keeping FlashList scrolling at target FPS.
 */
export async function extractArtwork(
  id: string,
  meta: ParsedMetadata,
): Promise<string | undefined> {
  if (!meta.artwork) {
    return undefined;
  }
  try {
    await ensureCacheDirs();
    const ext = meta.artwork.mime.includes('png') ? 'png' : 'jpg';
    const path = artworkPathFor(id, ext);

    // Skip rewrite if we already cached it on a previous scan.
    if (await RNFS.exists(path)) {
      const uri = `file://${path}`;
      ArtworkCache.set(id, uri);
      return uri;
    }

    await RNFS.writeFile(path, meta.artwork.data.toString('base64'), 'base64');
    const uri = `file://${path}`;
    ArtworkCache.set(id, uri);
    return uri;
  } catch (err) {
    log.warn('fs', 'artwork extraction failed', id, err);
    return undefined;
  }
}
