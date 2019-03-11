import * as d from '@declarations';


export function stencilServerPlugin(config: d.Config) {
  return {
    resolveId(id: string) {
      if (id === '@stencil/core/platform') {
        return config.sys.path.join(config.sys.compiler.distDir, 'server', 'index.mjs');
      }
      if (id === '@stencil/core/mock-doc') {
        return config.sys.path.join(config.sys.compiler.distDir, 'mock-doc', 'index.js');
      }
      if (id === '@stencil/core/runtime') {
        return config.sys.path.join(config.sys.compiler.distDir, 'runtime', 'index.mjs');
      }
      if (id === '@stencil/core/utils') {
        return config.sys.path.join(config.sys.compiler.distDir, 'utils', 'index.mjs');
      }
      return null;
    }
  };
}
