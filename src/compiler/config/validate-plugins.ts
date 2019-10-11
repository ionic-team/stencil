import * as d from '../../declarations';
import { setArrayConfig } from './config-utils';
import { buildWarn } from '@utils';
import { Plugin } from 'rollup';


export function validatePlugins(config: d.Config, diagnostics: d.Diagnostic[]) {
  setArrayConfig(config, 'plugins');
  const hasResolveNode = config.plugins.some(p => p.name === 'node-resolve');
  const hasCommonjs = config.plugins.some(p => p.name === 'commonjs');
  if (hasCommonjs) {
    const warn = buildWarn(diagnostics);
    warn.messageText = `Using the user defined "rollup-plugin-commonjs" plugin instead of the default defined in Stencil.`;
  }
  if (hasResolveNode) {
    const warn = buildWarn(diagnostics);
    warn.messageText = `Using the user defined "rollup-plugin-node-resolve" plugin instead of the default defined in Stencil.`;
  }
  config.rollupPlugins = getRollupPlugins(config.plugins);;
  config.plugins = getPlugins(config.plugins);
}

function getPlugins(plugins: any[]): d.Plugin[] {
  return plugins.filter(plugin => {
    return !!(plugin && typeof plugin === 'object' && plugin.pluginType);
  });
}

function getRollupPlugins(plugins: any[]): Plugin[] {
  return plugins.filter(plugin => {
    return !!(plugin && typeof plugin === 'object' && !plugin.pluginType);
  });
}

