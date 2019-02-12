import * as d from '@declarations';
import { normalizePath } from '@utils';


export function globalScriptsPlugin(config: d.Config, compilerCtx: d.CompilerCtx) {
  const paths: string[] = [];
  if (config.globalScript) {
    const mod = compilerCtx.moduleMap.get(config.globalScript);
    if (mod && mod.jsFilePath) {
      paths.push(mod.jsFilePath);
    }
  }
  // TODO: dependencies
  // paths.push(
  //   ...compilerCtx.collections.map(collection => collection.global.jsFilePath)
  // );
  return {
    resolveId(id: string) {
      if (id === '@global-scripts') {
        return id;
      }
      return null;
    },

    load(id: string) {
      if (id === '@global-scripts') {
        return paths
          .map(path => `import '${normalizePath(path)}';`)
          .join('\n');
      }
      return null;
    },
    name: 'globalScriptsPlugin'
  };
}
