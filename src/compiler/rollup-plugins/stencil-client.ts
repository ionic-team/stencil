import { sys } from '@sys';


export function stencilClientPlugin() {
  return {
    name: 'stencilClientEntryPointPlugin',
    resolveId(id: string) {
      if (id === '@stencil/core/platform') {
        return sys.path.join(sys.compiler.distDir, 'client', 'index.mjs');
      }
      return null;
    }
  };
}
