import {SCHEMA_VERSION, StorageKeys} from '@storage/storageKeys';
import {settingsStorage} from '@storage/mmkv';
import {log} from '@utils/logger';

/**
 * Runs once, synchronously, before the UI renders (see BootGate).
 *
 * Because Zustand+MMKV persistence is synchronous, store hydration already
 * happened at import time. This step exists for cross-cutting concerns that must
 * be settled before frame zero: schema migrations and integrity checks.
 *
 * Returns nothing; throwing here would be caught by BootGate.
 */
export function hydrateStores(): void {
  const persistedVersion = settingsStorage.getNumber(StorageKeys.SCHEMA_VERSION);

  if (persistedVersion === undefined) {
    log.info('boot', 'fresh install, seeding schema version', SCHEMA_VERSION);
    settingsStorage.set(StorageKeys.SCHEMA_VERSION, SCHEMA_VERSION);
  } else if (persistedVersion < SCHEMA_VERSION) {
    // Migrations land in src/storage/migrations.ts as the schema evolves.
    log.info('boot', `migrating schema ${persistedVersion} -> ${SCHEMA_VERSION}`);
    settingsStorage.set(StorageKeys.SCHEMA_VERSION, SCHEMA_VERSION);
  }

  log.info('boot', 'stores hydrated');
}
