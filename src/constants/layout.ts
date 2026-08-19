import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const Layout = {
  window: {width, height},
  /**
   * FlashList relies on a close estimate of row height to recycle smoothly.
   * Tune these per-list in Phase 5/6 against real measurements.
   */
  flashList: {
    trackRowHeight: 64,
    albumCardHeight: 220,
    artistRowHeight: 72,
  },
  miniPlayerHeight: 64,
  tabBarHeight: 56,
} as const;
