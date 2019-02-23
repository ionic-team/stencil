import { sys } from '@sys';


export function stencilServerPlugin() {
  return {
    resolveId(id: string) {
      if (id === '@stencil/core/platform') {
        return sys.path.join(sys.compiler.distDir, 'server', 'index.mjs');
      }
      return null;
    }
  };
}

// const SERVER_ENTRY = `
// import '@stencil/core/app';
// export { hydrateDocumentSync, renderToStringSync } from '@stencil/core/platform';
// `;
