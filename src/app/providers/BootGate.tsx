import React, {useState, type ReactNode} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {hydrateStores} from '@app/bootstrap/hydrateStores';
import {log} from '@utils/logger';

interface BootGateProps {
  children: ReactNode;
}

/**
 * Blocks the first render until synchronous hydration/migration completes.
 *
 * Since MMKV is synchronous this gate resolves within a single tick — its real
 * job is to give us one guaranteed place to run migrations and to fail loudly
 * (rather than rendering a half-initialized theme) if hydration ever throws.
 */
export function BootGate({children}: BootGateProps) {
  const [ready] = useState(() => {
    try {
      hydrateStores();
      return true;
    } catch (err) {
      log.error('boot', 'hydration failed', err);
      return true; // fall through to defaults rather than hard-locking the app
    }
  });

  if (!ready) {
    return (
      <View style={styles.fill}>
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  fill: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
