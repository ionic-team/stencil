import { Plugin } from 'rollup';

export function stencilExternalRuntimePlugin(externalRuntime: string): Plugin {
  return {
    name: 'stencilExternalRuntimePlugin',
    resolveId(id: string) {
      if (externalRuntime !== undefined && id === '@stencil/core') {
        return { id: externalRuntime, external: true, moduleSideEffects: false };
      }
      return null;
    }
  };
}
