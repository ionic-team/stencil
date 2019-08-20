import * as d from '../../declarations';
import { Plugin } from 'rollup';


export function stencilClientPlugin(config: d.Config): Plugin {
  return {
    name: 'stencilClientEntryPointPlugin',
    resolveId(id: string) {
      if (id === '@stencil/core/platform') {
        return {
          id: config.sys.path.join(config.sys.compiler.distDir, 'client', 'index.mjs'),
          moduleSideEffects: false
        };
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
