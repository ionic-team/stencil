import { RawConfig } from '../../declarations';


export function validatePlugins(config: RawConfig) {
  config.plugins = (config.plugins || []).filter(p => !!p);
}
