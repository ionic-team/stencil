import type { ConfigFlags } from '../../cli/config-flags';
import type * as d from '../../declarations';
export declare const getAbsolutePath: (config: d.ValidatedConfig, dir: string) => string;
/**
 * This function does two things:
 *
 * 1. If you pass a `flagName`, it will hoist that `flagName` out of the
 *    `ConfigFlags` object and onto the 'root' level (if you will) of the
 *    `config` under the `configName` (`keyof d.Config`) that you pass.
 * 2. If you _don't_  pass a `flagName` it will just set the value you supply
 *    on the config.
 *
 * @param config the config that we want to update
 * @param configName the key we're setting on the config
 * @param flagName either the name of a ConfigFlag prop we want to hoist up or null
 * @param defaultValue the default value we should set!
 */
export declare const setBooleanConfig: <K extends keyof d.Config>(config: d.UnvalidatedConfig, configName: K | (K & keyof ConfigFlags), flagName: keyof ConfigFlags | null, defaultValue: d.Config[K]) => void;
