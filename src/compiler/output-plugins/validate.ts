import * as d from '../../declarations';
import { isOutputPlugin } from './output-plugin-utils';


export function validatePluginOutputs(config: d.Config) {
  const outputPlugins = config.plugins.filter(isOutputPlugin);

  config.outputTargets = config.outputTargets.map(outputTarget => {
    const outputPlugin = outputPlugins.find(plugin => plugin.name === outputTarget.type);
    if (outputPlugin) {
      return outputPlugin.validate(outputTarget, config);
    }
    return outputTarget;
  });
}
