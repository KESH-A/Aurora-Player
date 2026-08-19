import RNFS from 'react-native-fs';

/**
 * Centralized cache directory layout. Artwork is written here once during the
 * scan and referenced by path thereafter, so the UI never re-decodes embedded
 * image bytes on the JS thread during scroll.
 */
export const CACHE_ROOT = `${RNFS.CachesDirectoryPath}/v0-music`;
export const ARTWORK_DIR = `${CACHE_ROOT}/artwork`;

export async function ensureCacheDirs(): Promise<void> {
  const exists = await RNFS.exists(ARTWORK_DIR);
  if (!exists) {
    await RNFS.mkdir(ARTWORK_DIR);
  }
}

export function artworkPathFor(id: string, ext = 'jpg'): string {
  return `${ARTWORK_DIR}/${id}.${ext}`;
}
