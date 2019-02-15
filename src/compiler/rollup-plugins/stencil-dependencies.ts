import { sys } from '@sys';


export function stencilDependenciesPlugin(corePlatform: 'client' | 'server', appCoreEntryFilePath: string) {

  return {
    resolveId(id: string) {
      if (id === '@core-entrypoint') {
        return id;
      }

      if (id === '@stencil/core/app') {
        return appCoreEntryFilePath;
      }

      if (id === '@stencil/core/platform') {
        const platformEntry = 'index.mjs';
        return sys.path.join(sys.compiler.distDir, corePlatform, platformEntry);
      }
      return null;
    },
    load(id: string) {
      if (id === '@core-entrypoint') {
        return `import '@stencil/core/app';`;
      }
      return null;
    }
  };
}
