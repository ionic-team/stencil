import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { Plugin } from 'rollup';


export function globalScriptsPlugin(config: d.Config, compilerCtx: d.CompilerCtx): Plugin {
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
    resolveId(id) {
      if (id === GLOBAL_ID) {
        return id;
      }
      return null;
    },
    load(id) {
      if (id === GLOBAL_ID) {
        return globalPaths
          .map(path => `import '${path}';`)
          .join('\n');
      }
      return null;
    },
    transform(code, id) {
      if (globalPaths.includes(id)) {
        return INJECT_CONTEXT + code;
      }
      return null;
    }
  };
}

const INJECT_CONTEXT = `import { Context } from '@stencil/core';\n`;
const GLOBAL_ID = '@stencil/core/global-scripts';

