import * as d from '../../declarations';

export function getPluginOutputTypeNames(config: d.Config) {
  return config.plugins
    .filter(isOutputPlugin)
    .map(plugin => plugin.name);
}

export function isOutputPlugin(plugin: d.Plugin) {
  return (
    typeof plugin === 'object' &&
    typeof plugin.name === 'string' &&
    typeof plugin.validate === 'function' &&
    typeof plugin.createOutput === 'function'
  );
}
