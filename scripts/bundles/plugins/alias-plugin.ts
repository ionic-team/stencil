import { Plugin } from 'rollup';
import { BuildOptions } from '../../utils/options';
import { join } from 'path';


export function aliasPlugin(opts: BuildOptions): Plugin {

  const alias = new Map([
    ['@app-data', '@stencil/core/internal/app-data'],
    ['@app-globals', '@stencil/core/internal/app-globals'],
    ['@hydrate-factory', '@stencil/core/hydrate-factory'],
    ['@mock-doc', '@stencil/core/mock-doc'],
    ['@platform', '@stencil/core/internal/platform'],
    ['@runtime', '@stencil/core/internal/runtime'],
    ['@testing', '@stencil/core/testing'],
  ]);

  // ensure we use the same one
  const helperResolvers = new Set([
    'is-resolvable',
    'path-is-absolute',
    'util',
  ]);

  // ensure we use the same one
  const nodeResolvers = new Map([
    ['source-map', join(opts.nodeModulesDir, 'source-map', 'source-map.js')],
  ]);

  const empty = new Set([
    // we never use chalk, but many projects still pull it in
    'chalk',
  ]);

  return {
    name: 'aliasPlugin',
    resolveId(id) {
      const externalId = alias.get(id);
      if (externalId) {
        return {
          id: externalId,
          external: true,
        };
      }
      if (id === '@utils') {
        return join(opts.transpiledDir, 'utils', 'index.js');
      }
      if (helperResolvers.has(id)) {
        return join(opts.bundleHelpersDir, `${id}.js`);
      }
      if (empty.has(id)) {
        return join(opts.bundleHelpersDir, 'empty.js');
      }
      if (nodeResolvers.has(id)) {
        return nodeResolvers.get(id);
      }
      return null;
    }
  }
}
