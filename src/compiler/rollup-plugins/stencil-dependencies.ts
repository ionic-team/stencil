import * as d from '@declarations';
import { sys } from '@sys';


export function stencilDependenciesPlugin(_config: d.Config, appCoreEntryFilePath: string) {

  return {
    resolveId(id: string) {
      if (id === '@core-entrypoint') {
        return id;
      }

      if (id === '@stencil/core/app') {
        return appCoreEntryFilePath;
      }

      if (id === '@stencil/core/platform') {
        const clientPlatform = 'index.mjs';
        return sys.path.join(sys.compiler.distDir, 'client', clientPlatform);
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
