import React, {useCallback, useEffect} from 'react';
import {RefreshControl, StyleSheet, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useNavigation} from '@react-navigation/native';
import {ScreenBackground} from '@components/backgrounds/ScreenBackground';
import {ThemedText} from '@components/common/ThemedText';
import {TrackRow} from '@components/library/TrackRow';
import {MiniPlayer} from '@components/miniplayer/MiniPlayer';
import {useTheme} from '@hooks/useTheme';
import {useMediaLibrary} from '@hooks/useMediaLibrary';
import {useLibraryStore} from '@store/useLibraryStore';
import {useQueueStore} from '@store/useQueueStore';

export function LibraryScreen(): React.JSX.Element {
  const {theme} = useTheme(); const navigation = useNavigation<any>(); const {scan, scanStatus} = useMediaLibrary();
  const scanning = scanStatus === 'requesting-permission' || scanStatus === 'scanning'; const tracks = useLibraryStore(s => s.tracks); const setQueue = useQueueStore(s => s.setQueue);
  useEffect(() => {if (tracks.length === 0) void scan();}, [scan, tracks.length]);
  const playTrack = useCallback((index: number) => {setQueue(tracks.slice(index)); navigation.navigate('Player');}, [navigation, setQueue, tracks]);
  return <ScreenBackground><View style={styles.container}><View style={styles.header}><View><Text style={[styles.eyebrow, {color: theme.colors.accent}]}>OFFLINE LIBRARY</Text><ThemedText variant="title">Your collection</ThemedText></View><Text style={[styles.count, {color: theme.colors.textMuted}]}>{tracks.length} tracks</Text></View>{tracks.length === 0 && !scanning ? <View style={styles.empty}><Text style={[styles.emptyTitle, {color: theme.colors.text}]}>No local music yet</Text><Text style={[styles.emptyBody, {color: theme.colors.textMuted}]}>Grant media access and scan your device to build the library.</Text></View> : <FlashList data={tracks} renderItem={({item, index}) => <TrackRow track={item} index={index} onPress={() => playTrack(index)} />} keyExtractor={item => item.id} refreshControl={<RefreshControl refreshing={scanning} onRefresh={() => void scan()} tintColor={theme.colors.accent} />} contentContainerStyle={styles.list} estimatedItemSize={72} />}<MiniPlayer /></View></ScreenBackground>;
}
const styles = StyleSheet.create({container: {flex: 1}, header: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}, eyebrow: {fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8}, count: {fontSize: 12, marginBottom: 4}, list: {paddingBottom: 18}, empty: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 44, gap: 10}, emptyTitle: {fontSize: 20, fontWeight: '800'}, emptyBody: {fontSize: 14, lineHeight: 21, textAlign: 'center'}});
