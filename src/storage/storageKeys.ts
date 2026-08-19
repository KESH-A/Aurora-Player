/**
 * Centralized storage keys. Never inline string keys at call sites — collisions
 * and typos here are silent data-loss bugs.
 */
export const StorageKeys = {
  THEME: 'persist:theme',
  ANIMATION: 'persist:animation',
  SETTINGS: 'persist:settings',
  QUEUE: 'persist:queue',
  LIBRARY_CACHE: 'data:library',
  SCHEMA_VERSION: 'meta:schemaVersion',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

/** Bump when a persisted shape changes; drives src/storage/migrations.ts. */
export const SCHEMA_VERSION = 1;
