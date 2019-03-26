import * as d from '../../declarations';
import { isOutputPlugin } from './output-plugin-utils';

export function validatePluginOutputs(config: d.Config) {
  const outputPlugins = config.plugins.filter(isOutputPlugin);

  config.outputTargets.forEach(outputTarget => {
    const outputPlugin = outputPlugins.find(plugin => plugin.name === outputTarget.type);
    if (outputPlugin) {
      outputTarget = outputPlugin.validate(outputTarget, config);
    }
  });
}
