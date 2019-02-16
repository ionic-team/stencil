import { sys } from '@sys';


export function stencilServerEntryPointPlugin() {
  return {
    resolveId(id: string) {
      if (id === '@core-entrypoint') {
        return id;
      }

      if (id === '@stencil/core/platform') {
        return sys.path.join(sys.compiler.distDir, 'server', 'index.mjs');
      }
      return null;
    },
    load(id: string) {
      if (id === '@core-entrypoint') {
        return SERVER_ENTRY;
      }
      return null;
    }
  };
}

const SERVER_ENTRY = `
import '@stencil/core/app';
export { hydrateDocumentSync, renderToStringSync } from '@stencil/core/platform';
`;
