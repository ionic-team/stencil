import * as d from '../../declarations';
import { setArrayConfig } from './config-utils';
import { buildWarn } from '@utils';
import { Plugin } from 'rollup';


export function validatePlugins(config: d.Config, diagnostics: d.Diagnostic[]) {
  setArrayConfig(config, 'plugins');
  const rollupPlugins = getRollupPlugins(config.plugins);
  const hasResolveNode = config.plugins.some(p => p.name === 'node-resolve');
  const hasCommonjs = config.plugins.some(p => p.name === 'commonjs');
  if (hasCommonjs) {
    const warn = buildWarn(diagnostics);
    warn.messageText = `Stencil already uses "rollup-plugin-commonjs", please remove it from your "stencil.config.ts" plugins.
    You can configure the commonjs settings using the "commonjs" property in "stencil.config.ts`;
  }
  if (hasResolveNode) {
    const warn = buildWarn(diagnostics);
    warn.messageText = `Stencil already uses "rollup-plugin-commonjs", please remove it from your "stencil.config.ts" plugins.
    You can configure the commonjs settings using the "commonjs" property in "stencil.config.ts`;
  }
  config.rollupPlugins = rollupPlugins.filter(({name}) => name !== 'node-resolve' && name !== 'commonjs');
  config.plugins = getPlugins(config.plugins);
}

function getPlugins(plugins: any[]): Plugin[] {
  return plugins.filter(plugin => {
    return !!(plugin && typeof plugin === 'object');
  });
}

function getRollupPlugins(plugins: any[]): Plugin[] {
  return plugins.filter(plugin => {
    return !!(plugin && typeof plugin === 'object' && !plugin.pluginType);
  });
}

