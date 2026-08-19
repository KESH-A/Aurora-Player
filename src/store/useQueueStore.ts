import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {RepeatMode} from 'react-native-track-player';
import type {Track} from '@domain/track';
import {mmkvPersistStorage} from './middleware/mmkvPersist';
import {StorageKeys} from '@storage/storageKeys';

/**
 * The active play queue + shuffle/repeat preferences.
 *
 * Queue contents and the user's shuffle/repeat choice are persisted (via MMKV)
 * so the session is restorable after an app kill. The native player queue is
 * rebuilt from this on launch by the playback controller.
 */
interface QueueState {
  queue: Track[];
  shuffle: boolean;
  repeatMode: RepeatMode;

  setQueue: (tracks: Track[]) => void;
  clear: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
}

const REPEAT_CYCLE: RepeatMode[] = [
  RepeatMode.Off,
  RepeatMode.Queue,
  RepeatMode.Track,
];

export const useQueueStore = create<QueueState>()(
  persist(
    set => ({
      queue: [],
      shuffle: false,
      repeatMode: RepeatMode.Off,

      setQueue: queue => set({queue}),
      clear: () => set({queue: []}),
      toggleShuffle: () => set(s => ({shuffle: !s.shuffle})),
      cycleRepeat: () =>
        set(s => {
          const idx = REPEAT_CYCLE.indexOf(s.repeatMode);
          return {repeatMode: REPEAT_CYCLE[(idx + 1) % REPEAT_CYCLE.length]};
        }),
    }),
    {
      name: StorageKeys.QUEUE,
      storage: createJSONStorage(() => mmkvPersistStorage),
    },
  ),
);
