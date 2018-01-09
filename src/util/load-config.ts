import { BuildConfig, StencilSystem } from './interfaces';


export function loadConfig(sys: StencilSystem, config: string | BuildConfig) {
  if (!config || Array.isArray(config) || typeof config === 'function' || typeof config === 'number' || typeof config === 'boolean') {
    throw new Error(`Invalid config: ${config}. Config must be either a file path or a config object.`);
  }

  if (typeof config === 'string') {
    return sys.loadConfigFile(config);
  }

  // looks like it's already a build config object
  if (!config.sys) {
    config.sys = sys;
  }
  return (config as BuildConfig);
}
