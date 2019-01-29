import { sys } from '@sys';


export function stencilDependenciesPlugin(appCoreEntryFilePath: string) {

  return {
    resolveId(id: string) {
      if (id === '@stencil/core/app') {
        return appCoreEntryFilePath;
      }
      if (id === '@stencil/core/platform') {
        return sys.path.join(sys.compiler.distDir, 'client', 'index.mjs');
      }
      if (id === '@stencil/core/runtime') {
        return sys.path.join(sys.compiler.distDir, 'runtime', 'index.mjs');
      }
      if (id === '@stencil/core/utils') {
        return sys.path.join(sys.compiler.distDir, 'utils', 'index.mjs');
      }
      return null;
    },

    name: 'stencilDependenciesPlugin'
  };
}
