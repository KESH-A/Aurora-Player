import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {AppProviders} from '@app/providers/AppProviders';
import {TabNavigator} from '@app/navigation/TabNavigator';

const navigationTheme = {
  ...DarkTheme,
  colors: {...DarkTheme.colors, background: 'transparent', card: 'transparent', text: '#F6F7FB', border: 'transparent', primary: '#8CF7D2'},
};

function App(): React.JSX.Element {
  return <AppProviders><NavigationContainer theme={navigationTheme}><StatusBar barStyle="light-content" translucent backgroundColor="transparent" /><TabNavigator /></NavigationContainer></AppProviders>;
}

export default App;
