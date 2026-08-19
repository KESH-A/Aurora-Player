import {Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
  type Permission,
} from 'react-native-permissions';
import {log} from '@utils/logger';

/**
 * Cross-platform media-read permission handling.
 *
 * Android 13+ (API 33) replaced READ_EXTERNAL_STORAGE with the granular
 * READ_MEDIA_AUDIO. iOS reads the media library via MEDIA_LIBRARY. We resolve
 * the correct permission at runtime so the same call site works everywhere.
 */
function resolveAudioPermission(): Permission | null {
  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version as number;
    if (apiLevel >= 33) {
      return PERMISSIONS.ANDROID.READ_MEDIA_AUDIO;
    }
    return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  }
  if (Platform.OS === 'ios') {
    return PERMISSIONS.IOS.MEDIA_LIBRARY;
  }
  return null;
}

export type PermissionOutcome = 'granted' | 'denied' | 'blocked' | 'unavailable';

export async function ensureAudioPermission(): Promise<PermissionOutcome> {
  const permission = resolveAudioPermission();
  if (!permission) {
    return 'unavailable';
  }

  const current = await check(permission);
  if (current === RESULTS.GRANTED || current === RESULTS.LIMITED) {
    return 'granted';
  }
  if (current === RESULTS.BLOCKED) {
    log.warn('fs', 'audio permission is blocked — needs Settings');
    return 'blocked';
  }
  if (current === RESULTS.UNAVAILABLE) {
    return 'unavailable';
  }

  const result = await request(permission);
  if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
    log.info('fs', 'audio permission granted');
    return 'granted';
  }
  if (result === RESULTS.BLOCKED) {
    return 'blocked';
  }
  return 'denied';
}
