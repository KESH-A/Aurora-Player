import React, {type ReactNode} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {BootGate} from './BootGate';
import {ThemeProvider} from '@themes/ThemeProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Single composition point for all app-wide providers.
 *
 * Order matters:
 *  1. GestureHandlerRootView — required at the very root for Reanimated/RNGH.
 *  2. SafeAreaProvider       — insets available to everything below.
 *  3. BootGate               — gates render on hydration/migration.
 *
 * The ThemeProvider (Phase 3) will slot in directly inside BootGate so themed
 * tokens are available to every screen.
 */
export function AppProviders({children}: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <BootGate>
          <ThemeProvider>{children}</ThemeProvider>
        </BootGate>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
});
