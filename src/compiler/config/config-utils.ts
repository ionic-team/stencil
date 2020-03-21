import * as d from '../../declarations';
import { isAbsolute, join } from 'path';

export const getAbsolutePath = (config: d.Config, dir: string) => {
  if (!isAbsolute(dir)) {
    dir = join(config.rootDir, dir);
  }
  return dir;
};

export const setBooleanConfig = (config: any, configName: string, flagName: string, defaultValue: boolean) => {
  if (flagName) {
    if (typeof config.flags[flagName] === 'boolean') {
      config[configName] = config.flags[flagName];
    }
  }

  const userConfigName = getUserConfigName(config, configName);

  if (typeof config[userConfigName] === 'function') {
    config[userConfigName] = !!config[userConfigName]();
  }

  if (typeof config[userConfigName] === 'boolean') {
    config[configName] = config[userConfigName];
  } else {
    config[configName] = defaultValue;
  }
};

export const setNumberConfig = (config: any, configName: string, _flagName: string, defaultValue: number) => {
  const userConfigName = getUserConfigName(config, configName);

  if (typeof config[userConfigName] === 'function') {
    config[userConfigName] = config[userConfigName]();
  }

  if (typeof config[userConfigName] === 'number') {
    config[configName] = config[userConfigName];
  } else {
    config[configName] = defaultValue;
  }
};

export const setStringConfig = (config: any, configName: string, defaultValue: string) => {
  const userConfigName = getUserConfigName(config, configName);

  if (typeof config[userConfigName] === 'function') {
    config[userConfigName] = config[userConfigName]();
  }

  if (typeof config[userConfigName] === 'string') {
    config[configName] = config[userConfigName];
  } else {
    config[configName] = defaultValue;
  }
};

export const setArrayConfig = (config: any, configName: string, defaultValue?: any[]) => {
  const userConfigName = getUserConfigName(config, configName);

  if (typeof config[userConfigName] === 'function') {
    config[userConfigName] = config[userConfigName]();
  }

  if (!Array.isArray(config[configName])) {
    if (Array.isArray(defaultValue)) {
      config[configName] = defaultValue.slice();
    } else {
      config[configName] = [];
    }
  }
};

const getUserConfigName = (config: d.Config, correctConfigName: string) => {
  const userConfigNames = Object.keys(config);

  for (const userConfigName of userConfigNames) {
    if (userConfigName.toLowerCase() === correctConfigName.toLowerCase()) {
      if (userConfigName !== correctConfigName) {
        config.logger.warn(`config "${userConfigName}" should be "${correctConfigName}"`);
        return userConfigName;
      }
      break;
    }
  }

  return correctConfigName;
};
