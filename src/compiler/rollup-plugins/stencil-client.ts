import * as d from '../../declarations';


export function stencilClientPlugin(config: d.Config) {
  return {
    name: 'stencilClientEntryPointPlugin',
    resolveId(id: string) {
      if (id === '@stencil/core/platform') {
        return config.sys.path.join(config.sys.compiler.distDir, 'client', 'index.mjs');
      }
      return null;
    }
  };
}
