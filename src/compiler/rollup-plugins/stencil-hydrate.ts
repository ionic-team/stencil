import * as d from '../../declarations';
import { Plugin } from 'rollup';


export function stencilHydratePlugin(config: d.Config): Plugin {
  return {
    name: 'stencil-hydrate-plugin',
    resolveId(id: string) {
      if (id === '@stencil/core') {
        return {
          id: config.sys.path.join(config.sys.compiler.packageDir, 'internal', 'hydrate', 'index.mjs'),
        };
      }
      return null;
    }
  };
}
