import type {Track} from '@domain/track';

export type RootStackParamList = {
  Library: undefined;
  Player: {track?: Track} | undefined;
  Settings: undefined;
};

export type TabParamList = {
  LibraryTab: undefined;
  PlayerTab: undefined;
  SettingsTab: undefined;
};

export const ROUTES = {
  library: 'Library',
  player: 'Player',
  settings: 'Settings',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
