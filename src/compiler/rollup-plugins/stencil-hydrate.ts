import * as d from '../../declarations';


export function stencilHydratePlugin(config: d.Config) {
  return {
    resolveId(id: string) {
      if (id === '@stencil/core/platform') {
        return config.sys.path.join(config.sys.compiler.distDir, 'hydrate', 'platform.mjs');
      }
      if (id === '@stencil/core/runtime') {
        return config.sys.path.join(config.sys.compiler.distDir, 'runtime', 'index.mjs');
      }
      if (id === '@stencil/core/utils') {
        return config.sys.path.join(config.sys.compiler.distDir, 'utils', 'index.mjs');
      }
      if (id === '@stencil/core') {
        return config.sys.path.join(config.sys.compiler.distDir, 'hydrate', 'platform.mjs');
      }
      return null;
    }
  };
}
