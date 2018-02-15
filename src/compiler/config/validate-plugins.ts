import { Config } from '../../declarations';
import styleMinifyPlugin from '../style/style-minify-plugin';


export function validatePlugins(config: Config) {
  config.plugins = (config.plugins || []).filter(p => !!p);

  if (!config.plugins.some(p => p.name === 'styleMinifyPlugin')) {
    config.plugins.push(styleMinifyPlugin());
  }
}
