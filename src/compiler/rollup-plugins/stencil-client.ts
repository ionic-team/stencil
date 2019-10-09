import * as d from '../../declarations';
import { Plugin } from 'rollup';


export function stencilClientPlugin(config: d.Config): Plugin {
  return {
    name: 'stencilClientEntryPointPlugin',
    resolveId(id) {
      if (id === '@stencil/core/internal/client') {
        return config.sys.path.join(config.sys.compiler.packageDir, 'internal', 'client', 'index.mjs');
      }
      return null;
    },
    resolveImportMeta(prop, {format}) {
      if (prop === 'url' && format === 'es') {
        return '""';
      }
      return null;
    }
  };
}
