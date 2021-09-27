import type * as d from '../declarations';

/**
 * Does the command have the debug flag?
 * @param config The config passed into the Stencil command
 * @returns true if --debug has been passed, otherwise false
 */
export function hasDebug(config: d.Config) {
  return config.flags.debug;
}

/**
 * Does the command have the verbose and debug flags?
 * @param config The config passed into the Stencil command
 * @returns true if both --debug and --verbose have been passed, otherwise false
 */
export function hasVerbose(config: d.Config) {
  return config.flags.verbose && hasDebug(config);
}
