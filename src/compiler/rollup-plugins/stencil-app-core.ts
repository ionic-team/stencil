
export function stencilAppCorePlugin(core: string) {
  return {
    resolveId(id: string) {
      if (id === '@stencil/core/app') {
        return id;
      }
      return null;
    },
    load(id: string) {
      if (id === '@stencil/core/app') {
        return core || DEFAULT_CORE;
      }
      return null;
    }
  };
}

export const DEFAULT_CORE = `
import '@global-scripts';
export * from '@stencil/core/platform';
`;
