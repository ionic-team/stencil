import * as d from '../../declarations';
import { Plugin } from 'rollup';


export function stencilHydratePlugin(config: d.Config): Plugin {
  return {
    name: 'stencil-hydrate-plugin',
    resolveId(id: string) {
      if (id === '@stencil/core/platform') {
        return {
          id: config.sys.path.join(config.sys.compiler.distDir, 'hydrate', 'platform.mjs'),
          moduleSideEffects: false
        };
      }
      if (id === '@stencil/core/runtime') {
        return {
          id: config.sys.path.join(config.sys.compiler.distDir, 'runtime', 'index.mjs'),
          moduleSideEffects: false
        };
      }
      if (id === '@stencil/core/utils') {
        return {
          id: config.sys.path.join(config.sys.compiler.distDir, 'utils', 'index.mjs'),
          moduleSideEffects: false
        };
      }
      if (id === '@stencil/core') {
        return {
          id: config.sys.path.join(config.sys.compiler.distDir, 'hydrate', 'platform.mjs'),
          moduleSideEffects: false
        };
      }
      return null;
    }
  };
}
