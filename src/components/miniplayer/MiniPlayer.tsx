import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {usePlayerStore} from '@store/usePlayerStore';
import {useTheme} from '@hooks/useTheme';
import {play, pause} from '@services/audio/playbackController';
import {PressableScale} from '@components/common/PressableScale';

export function MiniPlayer(): React.JSX.Element | null {
  const track = usePlayerStore(s => s.currentTrack); const status = usePlayerStore(s => s.status); const navigation = useNavigation<any>(); const {theme} = useTheme();
  if (!track) return null;
  const playing = status === 'playing';
  return <PressableScale onPress={() => navigation.navigate('Player')} style={[styles.shell, {backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border}]}><View style={styles.content}>{track.artwork ? <Image source={{uri: track.artwork}} style={styles.art} /> : <View style={[styles.art, {backgroundColor: theme.colors.surface}]}><Text style={{color: theme.colors.accent}}>♪</Text></View>}<View style={styles.info}><Text numberOfLines={1} style={[styles.title, {color: theme.colors.text}]}>{track.title}</Text><Text numberOfLines={1} style={[styles.artist, {color: theme.colors.textMuted}]}>{track.artist}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Pause' : 'Play'} onPress={event => {event.stopPropagation(); void (playing ? pause() : play());}} style={styles.action}><Text style={[styles.play, {color: theme.colors.accent}]}>{playing ? 'Ⅱ' : '▶'}</Text></Pressable></View></PressableScale>;
}
const styles = StyleSheet.create({shell: {marginHorizontal: 14, marginBottom: 8, borderWidth: 1, borderRadius: 16}, content: {height: 64, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 10}, art: {width: 44, height: 44, borderRadius: 9, alignItems: 'center', justifyContent: 'center'}, info: {flex: 1, gap: 4}, title: {fontSize: 13, fontWeight: '800'}, artist: {fontSize: 11}, action: {width: 40, alignItems: 'center'}, play: {fontSize: 18, fontWeight: '800'}});
