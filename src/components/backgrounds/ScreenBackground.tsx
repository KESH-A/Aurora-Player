import React, {type ReactNode} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import {useTheme} from '@hooks/useTheme';

interface ScreenBackgroundProps {
  children: ReactNode;
}

/**
 * Full-screen root backdrop that adapts per theme:
 *  - gradient themes (Gradient, Retro Synth) paint their gradient edge-to-edge;
 *  - the Transparent theme renders the user's wallpaper + a blur veil;
 *  - solid/glass themes fall back to the flat background color.
 *
 * The animated variant of the gradient is added in Phase 4; here it is static.
 */
export function ScreenBackground({children}: ScreenBackgroundProps) {
  const {theme, wallpaperUri} = useTheme();

  const renderBacking = () => {
    if (theme.id === 'transparent' && wallpaperUri) {
      return (
        <>
          <Image source={{uri: wallpaperUri}} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={theme.effect.blurTint === 'light' ? 'light' : 'dark'}
            blurAmount={theme.effect.blurAmount}
          />
          <View style={[StyleSheet.absoluteFill, {backgroundColor: theme.colors.scrim}]} />
        </>
      );
    }
    if (theme.surface === 'gradient' || theme.gradient.length > 1) {
      return (
        <LinearGradient
          colors={theme.gradient}
          start={{x: theme.gradientDirection.start[0], y: theme.gradientDirection.start[1]}}
          end={{x: theme.gradientDirection.end[0], y: theme.gradientDirection.end[1]}}
          style={StyleSheet.absoluteFill}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.root, {backgroundColor: theme.colors.background}]}>
      {renderBacking()}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});
