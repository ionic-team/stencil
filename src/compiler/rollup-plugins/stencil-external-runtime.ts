
export function stencilExternalRuntimePlugin(externalRuntime: string) {
  return {
    name: 'stencilExternalRuntimePlugin',
    resolveId(id: string) {
      if (externalRuntime !== undefined && id === '@stencil/core') {
        return { id: externalRuntime, external: true };
      }
      return null;
    }
  };
}
