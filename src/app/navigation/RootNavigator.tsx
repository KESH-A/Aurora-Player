import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './routes';
import {LibraryScreen} from '@screens/LibraryScreen/LibraryScreen';
import {PlayerScreen} from '@screens/PlayerScreen/PlayerScreen';
import {SettingsScreen} from '@screens/SettingsScreen/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
