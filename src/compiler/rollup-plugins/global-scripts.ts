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
        const imports = globalPaths
          .map((path, i) => `import global${i} from '${path}';`);

        return [
          ...imports,
          'export default function() {',
          ...globalPaths.map((_, i) => `  global${i}();`),
          '}'
        ].join('\n');
      }
      return null;
    },
    transform(code, id) {
      if (globalPaths.includes(normalizePath(id))) {
        const program = this.parse(code, {});
        const needsDefault = !program.body.some(s => s.type === 'ExportDefaultDeclaration');
        const defaultExport = needsDefault
          ? '\nexport default function(){}'
          : '';
        return INJECT_CONTEXT + code + defaultExport;
      }
      return null;
    }
  };
}

const INJECT_CONTEXT = `import { Context } from '@stencil/core';\n`;
const GLOBAL_ID = '@stencil/core/global-scripts';

