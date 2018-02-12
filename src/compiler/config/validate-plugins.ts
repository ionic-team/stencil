import { Config } from '../../declarations';
import styleMinifyPlugin from '../style/style-minify-plugin';
import styleSassPlugin from '../style/style-sass-plugin';


export function validatePlugins(config: Config) {
  config.plugins = (config.plugins || []).filter(p => !!p);

  if (!config.plugins.some(p => p.name === 'styleSassPlugin')) {
    config.plugins.push(styleSassPlugin());
  }

  if (!config.plugins.some(p => p.name === 'styleMinifyPlugin')) {
    config.plugins.push(styleMinifyPlugin());
  }
}
