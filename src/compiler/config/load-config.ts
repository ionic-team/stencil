import { Config } from '../../declarations';


export function loadConfig(config: string | Config) {
  if (!config || Array.isArray(config) || typeof config === 'function' || typeof config === 'number' || typeof config === 'boolean') {
    throw new Error(`Invalid config: ${config}. Config must be either a file path or a config object.`);
  }

  if (typeof config === 'string') {
    return sys.loadConfigFile(config);
  }

  return (config as Config);
}
