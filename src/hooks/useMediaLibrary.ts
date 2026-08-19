import {useCallback, useEffect, useRef} from 'react';
import {useLibraryStore} from '@store/useLibraryStore';
import {ensureAudioPermission} from '@services/permissions/mediaPermissions';
import {scanLibrary} from '@services/filesystem/MediaScanner';
import {log} from '@utils/logger';

/**
 * Orchestrates a full library scan: permission -> scan -> store.
 *
 * Returns the current library slice plus a `scan` trigger the UI can call from
 * a button or on first launch. All heavy work lives in the services; this hook
 * only sequences them and reflects progress/status into the library store.
 */
export function useMediaLibrary() {
  const tracks = useLibraryStore(s => s.tracks);
  const albums = useLibraryStore(s => s.albums);
  const artists = useLibraryStore(s => s.artists);
  const scanStatus = useLibraryStore(s => s.scanStatus);
  const scanProgress = useLibraryStore(s => s.scanProgress);
  const error = useLibraryStore(s => s.error);
  const scanController = useRef<AbortController | null>(null);

  const scan = useCallback(async () => {
    if (scanController.current) {
      return;
    }
    const controller = new AbortController();
    scanController.current = controller;
    const store = useLibraryStore.getState();
    store.setScanStatus('requesting-permission');

    const outcome = await ensureAudioPermission();
    if (outcome !== 'granted') {
      store.setScanStatus('error', `Permission ${outcome}`);
      log.warn('fs', 'scan aborted — permission not granted', outcome);
      scanController.current = null;
      return;
    }

    store.setScanStatus('scanning');
    store.setScanProgress(0);

    try {
      const result = await scanLibrary({
        signal: controller.signal,
        onProgress: (done, total) => {
          store.setScanProgress(total > 0 ? done / total : 0);
        },
      });
      store.setTracks(result);
      store.setScanStatus('ready');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      store.setScanStatus('error', message);
      log.error('fs', 'scan failed', message);
    } finally {
      scanController.current = null;
    }
  }, []);

  useEffect(() => () => scanController.current?.abort(), []);

  return {tracks, albums, artists, scanStatus, scanProgress, error, scan};
}
