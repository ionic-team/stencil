

export function stencilAppCorePlugin(appCoreEntryFilePath: string) {
  return {
    resolveId(id: string) {
      if (id === '@stencil/core/app') {
        return appCoreEntryFilePath;
      }

      return null;
    }
  };
}
