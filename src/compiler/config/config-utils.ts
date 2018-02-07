import { Config } from '../../declarations';


export function setBooleanConfig(config: any, configName: string, defaultValue: boolean) {
  const userConfigName = getUserConfigName(config, configName);

  if (typeof config[userConfigName] === 'function') {
    config[userConfigName] = !!config[userConfigName]();
  }

  if (typeof config[userConfigName] === 'boolean') {
    config[configName] = config[userConfigName];

  } else {
    config[configName] = defaultValue;
  }
}


export function setNumberConfig(config: any, configName: string, defaultValue: number) {
  const userConfigName = getUserConfigName(config, configName);

  if (typeof config[userConfigName] === 'function') {
    config[userConfigName] = config[userConfigName]();
  }

  if (typeof config[userConfigName] === 'number') {
    config[configName] = config[userConfigName];

  } else {
    config[configName] = defaultValue;
  }
}


export function setStringConfig(config: any, configName: string, defaultValue: string) {
  const userConfigName = getUserConfigName(config, configName);

  if (typeof config[userConfigName] === 'function') {
    config[userConfigName] = config[userConfigName]();
  }

  if (typeof config[userConfigName] === 'string') {
    config[configName] = config[userConfigName];

  } else {
    config[configName] = defaultValue;
  }
}


export function setArrayConfig(config: any, configName: string) {
  const userConfigName = getUserConfigName(config, configName);

  if (typeof config[userConfigName] === 'function') {
    config[userConfigName] = config[userConfigName]();
  }

  if (!Array.isArray(config[configName])) {
    config[configName] = [];
  }
}


function getUserConfigName(config: Config, correctConfigName: string) {
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
}
