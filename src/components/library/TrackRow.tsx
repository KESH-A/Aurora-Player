import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {Track} from '@domain/track';
import {useTheme} from '@hooks/useTheme';
import {PressableScale} from '@components/common/PressableScale';

interface Props {track: Track; index: number; onPress: () => void}
export function TrackRow({track, index, onPress}: Props): React.JSX.Element {
  const {theme} = useTheme();
  return (
    <PressableScale onPress={onPress} style={styles.wrapper} accessibilityRole="button" accessibilityLabel={`Play ${track.title}`}>
      <View style={[styles.number, {backgroundColor: theme.colors.surfaceAlt}]}><Text style={[styles.index, {color: theme.colors.textMuted}]}>{String(index + 1).padStart(2, '0')}</Text></View>
      {track.artwork ? <Image source={{uri: track.artwork}} style={styles.art} /> : <View style={[styles.art, styles.fallback, {backgroundColor: theme.colors.surfaceAlt}]}><Text style={{color: theme.colors.accent}}>♪</Text></View>}
      <View style={styles.info}><Text numberOfLines={1} style={[styles.title, {color: theme.colors.text}]}>{track.title}</Text><Text numberOfLines={1} style={[styles.meta, {color: theme.colors.textMuted}]}>{track.artist} · {track.album}</Text></View>
      <Text style={[styles.duration, {color: theme.colors.textMuted}]}>{formatDuration(track.duration)}</Text>
    </PressableScale>
  );
}
function formatDuration(seconds: number): string {const m = Math.floor(seconds / 60); const s = Math.floor(seconds % 60).toString().padStart(2, '0'); return `${m}:${s}`;}
const styles = StyleSheet.create({wrapper: {minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 8}, number: {width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8}, index: {fontSize: 11, fontVariant: ['tabular-nums']}, art: {width: 52, height: 52, borderRadius: 10}, fallback: {alignItems: 'center', justifyContent: 'center'}, info: {flex: 1, gap: 5}, title: {fontSize: 15, fontWeight: '700'}, meta: {fontSize: 12}, duration: {fontSize: 12, fontVariant: ['tabular-nums']}});
