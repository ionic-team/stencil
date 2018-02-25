import { Config } from '../../declarations';


export function validatePlugins(config: Config) {
  config.plugins = (config.plugins || []).filter(p => !!p);
}
