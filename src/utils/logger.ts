/**
 * Tiny tagged logger. Keeps a consistent prefix so logs are easy to filter
 * in Metro / Flipper, and gives us one place to disable logging in release.
 */
const ENABLED = __DEV__;

type Scope = 'boot' | 'audio' | 'theme' | 'anim' | 'fs' | 'perf' | 'store';

function format(scope: Scope, args: unknown[]) {
  return [`[v0:${scope}]`, ...args];
}

export const log = {
  info(scope: Scope, ...args: unknown[]) {
    if (ENABLED) {
      console.log(...format(scope, args));
    }
  },
  warn(scope: Scope, ...args: unknown[]) {
    if (ENABLED) {
      console.warn(...format(scope, args));
    }
  },
  error(scope: Scope, ...args: unknown[]) {
    console.error(...format(scope, args));
  },
};
