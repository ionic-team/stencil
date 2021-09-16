import type * as d from '../declarations';

export function hasDebug(config: d.Config) {
  return config.flags.debug;
}

export function hasVerbose(config: d.Config) {
  return config.flags.verbose && hasDebug(config);
}
