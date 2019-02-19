import { sys } from '@sys';


export function stencilClientEntryPointPlugin(entry: string | undefined) {
  return {
    name: 'stencilClientEntryPointPlugin',
    resolveId(id: string) {
      if (id === '@core-entrypoint') {
        return id;
      }

      if (id === '@stencil/core/platform') {
        return sys.path.join(sys.compiler.distDir, 'client', 'index.mjs');
      }
      return null;
    },
    load(id: string) {
      if (id === '@core-entrypoint') {
        return entry || `import '@stencil/core/app';`;
      }
      return null;
    }
  };
}
