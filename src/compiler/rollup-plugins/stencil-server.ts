import { sys } from '@sys';


export function stencilServerPlugin() {
  return {
    resolveId(id: string) {
      if (id === '@stencil/core/platform') {
        return sys.path.join(sys.compiler.distDir, 'server', 'index.mjs');
      }
      if (id === '@stencil/core/mock-doc') {
        return sys.path.join(sys.compiler.distDir, 'mock-doc', 'index.js');
      }
      if (id === '@stencil/core/runtime') {
        return sys.path.join(sys.compiler.distDir, 'runtime', 'index.mjs');
      }
      if (id === '@stencil/core/utils') {
        return sys.path.join(sys.compiler.distDir, 'utils', 'index.mjs');
      }
      return null;
    }
  };
}
