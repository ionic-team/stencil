import type * as d from '../../declarations';
import { isAbsolute, join } from 'path';
import { isBoolean } from '@utils';

export const getAbsolutePath = (config: d.Config | d.UnvalidatedConfig, dir: string) => {
  if (!isAbsolute(dir)) {
    dir = join(config.rootDir, dir);
  }
  return dir;
};

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
export const setBooleanConfig = <K extends keyof d.Config>(
  config: d.UnvalidatedConfig,
  configName: K,
  flagName: keyof d.ConfigFlags | null,
  defaultValue: d.Config[K]
) => {
  if (flagName) {
    // I can't think of a great way to tell the compiler that `typeof Config[K]` is going
    // to be equal to `typeof ConfigFlags[K]`, so we lean on a little assertion 🫤
    let flagValue = config?.flags?.[flagName] as d.Config[K];
    if (isBoolean(flagValue)) {
      config[configName] = flagValue;
    }
  }

  const userConfigName = getUserConfigName(config, configName);

  if (typeof config[userConfigName] === 'function') {
    config[userConfigName] = !!config[userConfigName]();
  }

  if (isBoolean(config[userConfigName])) {
    config[configName] = config[userConfigName];
  } else {
    config[configName] = defaultValue;
  }
};

/**
 * Find any possibly mis-capitalized configuration names on the config, logging
 * a little warning for the user to let them know. This lets us recover values
 * set under (a subset of) improperly spelled configs and automatically hoist
 * them into the config under the right key.
 *
 * @param config d.Config
 * @param correctConfigName the configuration name that we're checking for right now
 * @returns a string container a mis-capitalized config name found on the
 * config object, if any.
 */
const getUserConfigName = (config: d.UnvalidatedConfig, correctConfigName: keyof d.Config): string => {
  const userConfigNames = Object.keys(config);

  for (const userConfigName of userConfigNames) {
    if (userConfigName.toLowerCase() === correctConfigName.toLowerCase()) {
      if (userConfigName !== correctConfigName) {
        config.logger?.warn(`config "${userConfigName}" should be "${correctConfigName}"`);
        return userConfigName;
      }
      break;
    }
  }

  return correctConfigName;
};
