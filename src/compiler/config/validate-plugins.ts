import { ValidatedConfig } from '../../declarations';


export function validatePlugins(config: ValidatedConfig) {
  config.plugins = (config.plugins || []).filter(p => !!p);
}
