import RNFS from 'react-native-fs';
import {ARTWORK_DIR, ensureCacheDirs} from './cachePaths';
import {log} from '@utils/logger';

/**
 * In-memory LRU index over the on-disk artwork cache.
 *
 * The bytes live on disk (written by artworkExtractor); this class only tracks
 * which ids are resident so we can answer "do we have artwork?" without a
 * filesystem hit, and prune the oldest files when the cache grows too large.
 * Deeper tuning (size budgets, eviction policy) happens in Phase 6.
 */
class ArtworkCacheImpl {
  private order: string[] = []; // most-recently-used at the end
  private resident = new Map<string, string>(); // id -> file uri
  private maxEntries = 500;
  private evictionInFlight = false;

  has(id: string): boolean {
    return this.resident.has(id);
  }

  get(id: string): string | undefined {
    const uri = this.resident.get(id);
    if (uri) {
      this.touch(id);
    }
    return uri;
  }

  set(id: string, uri: string): void {
    this.resident.set(id, uri);
    this.touch(id);
    if (this.resident.size > this.maxEntries && !this.evictionInFlight) {
      void this.evictToBudget();
    }
  }

  private touch(id: string): void {
    const idx = this.order.indexOf(id);
    if (idx >= 0) {
      this.order.splice(idx, 1);
    }
    this.order.push(id);
  }

  private async evictToBudget(): Promise<void> {
    this.evictionInFlight = true;
    try {
      while (this.resident.size > this.maxEntries) {
        await this.evictOldest();
      }
    } finally {
      this.evictionInFlight = false;
    }
  }

  private async evictOldest(): Promise<void> {
    const oldest = this.order.shift();
    if (!oldest) {
      return;
    }
    const uri = this.resident.get(oldest);
    this.resident.delete(oldest);
    if (uri) {
      try {
        const path = uri.replace('file://', '');
        if (await RNFS.exists(path)) {
          await RNFS.unlink(path);
        }
      } catch (err) {
        log.warn('fs', 'artwork eviction failed', oldest, err);
      }
    }
  }

  /** Drop the entire on-disk artwork cache (used by "clear cache" in settings). */
  async clear(): Promise<void> {
    this.order = [];
    this.resident.clear();
    try {
      if (await RNFS.exists(ARTWORK_DIR)) {
        await RNFS.unlink(ARTWORK_DIR);
      }
      await ensureCacheDirs();
    } catch (err) {
      log.warn('fs', 'artwork cache clear failed', err);
    }
  }
}

export const ArtworkCache = new ArtworkCacheImpl();
