import * as d from '@declarations';
import { sys } from '@sys';


export function stencilDependenciesPlugin(config: d.Config, appCoreEntryFilePath: string) {

  return {
    resolveId(id: string) {
      if (id === '@stencil/core/app') {
        return appCoreEntryFilePath;
      }

      if (id === '@stencil/core/platform') {
        const clientPlatform = config.minifyJs ? 'index.min.mjs' : 'index.mjs';
        return sys.path.join(sys.compiler.distDir, 'client', clientPlatform);
      }

      return null;
    }
  };
}
