import * as d from '@declarations';
import { sys } from '@sys';


export function stencilDependenciesPlugin(_config: d.Config, appCoreEntryFilePath: string) {

  return {
    resolveId(id: string) {
      if (id === '@stencil/core') {
        return appCoreEntryFilePath;
      }

      if (id === '@stencil/core/platform') {
        const clientPlatform = 'index.mjs';
        return sys.path.join(sys.compiler.distDir, 'client', clientPlatform);
      }

      return null;
    }
  };
}
