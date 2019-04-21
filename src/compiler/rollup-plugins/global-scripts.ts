import * as d from '../../declarations';
import { normalizePath } from '@utils';


export function globalScriptsPlugin(config: d.Config, compilerCtx: d.CompilerCtx) {
  const globalPaths: string[] = [];

  if (typeof config.globalScript === 'string') {
    const mod = compilerCtx.moduleMap.get(config.globalScript);
    if (mod != null && mod.jsFilePath) {
      globalPaths.push(normalizePath(mod.jsFilePath));
    }
  }

  compilerCtx.collections.forEach(collection => {
    if (collection.global != null && typeof collection.global.jsFilePath === 'string') {
      globalPaths.push(normalizePath(collection.global.jsFilePath));
    }
  });

  return {
    name: 'globalScriptsPlugin',
    resolveId(id: string) {
      if (id === GLOBAL_ID) {
        return id;
      }
      return null;
    },
    load(id: string) {
      if (id === GLOBAL_ID) {
        return globalPaths
          .map(path => `import '${path}';`)
          .join('\n');
      }
      return null;
    }
  };
}

const GLOBAL_ID = '@stencil/core/global-scripts';

