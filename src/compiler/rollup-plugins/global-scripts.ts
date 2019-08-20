import * as d from '../../declarations';
import { buildError, normalizePath } from '@utils';
import { Plugin } from 'rollup';


export function hasGlobalScriptPaths(config: d.Config, compilerCtx: d.CompilerCtx) {
  if (typeof config.globalScript === 'string') {
    const mod = compilerCtx.moduleMap.get(config.globalScript);
    if (mod != null && mod.jsFilePath) {
      return true;
    }
  }

  return compilerCtx.collections.some(collection => {
    return (collection.global != null && typeof collection.global.jsFilePath === 'string');
  });
}


export function globalScriptsPlugin(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin {
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
        return {
          id,
          moduleSideEffects: true
        };
      }
      return null;
    },
    load(id) {
      if (id === GLOBAL_ID) {
        const imports = globalPaths
          .map((path, i) => `import global${i} from '${path}';`);

        return [
          ...imports,
          `const globals = () => {`,
          ...globalPaths.map((_, i) => `  global${i}();`),
          `};`,
          `export default globals;`
        ].join('\n');
      }
      return null;
    },
    transform(code, id) {
      id = normalizePath(id);
      if (globalPaths.includes(id)) {
        const output = [
          INJECT_CONTEXT
        ];

        const program = this.parse(code, {});
        const needsDefault = !program.body.some(s => s.type === 'ExportDefaultDeclaration');

        if (needsDefault) {
          const diagnostic = buildError(buildCtx.diagnostics);
          diagnostic.header = `Global Script`;
          diagnostic.absFilePath = id;
          diagnostic.messageText = `The code to be executed should be placed within a default function that is exported by the global script. Ensure all of the code in the global script is wrapped in the function() that is exported.`;

          output.push(`export const fallbackGlobalFn = () => {}`);
          output.push(`export default fallbackGlobalFn;`);

        } else {
          output.push(code);
        }

        return output.join('\n');
      }
      return null;
    }
  };
}

const INJECT_CONTEXT = `import { Context } from '@stencil/core';\n`;
const GLOBAL_ID = '@stencil/core/global-scripts';

