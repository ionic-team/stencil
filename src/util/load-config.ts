import { BuildConfig, StencilSystem } from './interfaces';


export function loadConfig(sys: StencilSystem, config: string | BuildConfig) {
  if (!config || Array.isArray(config) || typeof config === 'function' || typeof config === 'number' || typeof config === 'boolean') {
    throw new Error(`Invalid config: ${config}. Config must be either a file path or a config object.`);
  }

  if (typeof config === 'string') {
    return loadConfigFile(sys, config);
  }

  // looks like it's already a build config object
  if (!config.sys) {
    config.sys = sys;
  }
  return (config as BuildConfig);
}


export function loadConfigFile(sys: StencilSystem, configPath: string) {
  let config: BuildConfig;

  if (!sys.path.isAbsolute(configPath)) {
    throw new Error(`Stencil configuration file "${configPath}" must be an absolute path.`);
  }

  try {
    const fileStat = sys.fs.statSync(configPath);
    if (fileStat.isDirectory()) {
      // this is only a directory, so let's just assume we're looking for in stencil.config.js
      // otherwise they could pass in an absolute path if it was somewhere else
      configPath = sys.path.join(configPath, 'stencil.config.js');
    }

    // the passed in config was a string, so it's probably a path to the config we need to load
    const configFileData = require(configPath);
    if (!configFileData.config) {
      throw new Error(`Invalid Stencil configuration file "${configPath}". Missing "config" property.`);
    }

    config = configFileData.config;
    config.configPath = configPath;

    if (!config.rootDir && configPath) {
      config.rootDir = sys.path.dirname(configPath);
    }

  } catch (e) {
    throw new Error(`Error reading Stencil configuration file "${configPath}". ` + e);
  }

  if (!config.sys) {
    config.sys = sys;
  }

  return config;
}
