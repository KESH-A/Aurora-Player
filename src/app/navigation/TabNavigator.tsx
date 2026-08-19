import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useTheme} from '@hooks/useTheme';
import {RootNavigator} from './RootNavigator';
import type {RouteName} from './routes';

const tabs: Array<{route: RouteName; label: string; glyph: string}> = [
  {route: 'Library', label: 'Library', glyph: 'LIB'},
  {route: 'Player', label: 'Now Playing', glyph: 'PLAY'},
  {route: 'Settings', label: 'Settings', glyph: 'SET'},
];

export function TabNavigator(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const active = useNavigationState(state => state.routes[state.index]?.name as RouteName);
  const {theme} = useTheme();
  return (
    <View style={styles.shell}>
      <View style={styles.content}><RootNavigator /></View>
      <View style={[styles.tabs, {backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border}]}>
        {tabs.map(tab => {
          const selected = active === tab.route;
          return (
            <Pressable key={tab.route} accessibilityRole="tab" accessibilityState={{selected}} onPress={() => navigation.navigate(tab.route)} style={styles.tab}>
              <Text style={[styles.glyph, {color: selected ? theme.colors.accent : theme.colors.textMuted}]}>{tab.glyph}</Text>
              <Text style={[styles.label, {color: selected ? theme.colors.text : theme.colors.textMuted}]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({shell: {flex: 1}, content: {flex: 1}, tabs: {height: 76, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', paddingTop: 10}, tab: {flex: 1, alignItems: 'center', gap: 6}, glyph: {fontSize: 10, fontWeight: '800', letterSpacing: 1}, label: {fontSize: 11, fontWeight: '600'}},
);
