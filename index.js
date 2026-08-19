/**
 * App entry point.
 *
 * Order matters here:
 *  1. gesture-handler import must come first.
 *  2. The TrackPlayer playback service is registered BEFORE the React tree
 *     mounts so lock-screen / notification / headset controls are wired the
 *     moment audio starts — and it survives JS reloads + background execution.
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {registerPlaybackService} from '@app/bootstrap/registerPlaybackService';

registerPlaybackService();

AppRegistry.registerComponent(appName, () => App);
