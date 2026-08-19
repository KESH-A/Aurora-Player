import {Platform} from 'react-native';

export type FrameSample = {
  targetFps: 60 | 120;
  elapsedMs: number;
  droppedFrames: number;
  achievedFps: number;
};

export function frameBudgetMs(targetFps: 60 | 120): number {
  return 1000 / targetFps;
}

export function estimateFrameSample(
  targetFps: 60 | 120,
  elapsedMs: number,
): FrameSample {
  const budget = frameBudgetMs(targetFps);
  const frameCount = Math.max(1, Math.round(elapsedMs / budget));
  const droppedFrames = Math.max(0, frameCount - 1);
  return {
    targetFps,
    elapsedMs,
    droppedFrames,
    achievedFps: elapsedMs > 0 ? Math.min(targetFps, 1000 / elapsedMs) : targetFps,
  };
}

export function nativeHighRefreshRateAvailable(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export function shouldYieldBatch(index: number, batchSize = 8): boolean {
  return index > 0 && index % batchSize === 0;
}
