import * as d from '../../declarations';
import { OutputChunk, Plugin } from 'rollup';


function sortBundles(a: OutputChunk, b: OutputChunk) {
  if (a.isEntry && !b.isEntry) {
    return -1;
  }
  if (b.isEntry) {
    return 1;
  }

  const nameA = a.fileName.toUpperCase();
  const nameB = b.fileName.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

export function statsPlugin(buildCtx: d.BuildCtx) {
  const plugin: Plugin = {
    name: 'stats-plugin',
    generateBundle(options, bundle) {
      options;
      const modules = Object.keys(bundle)
        .map(b => bundle[b])
        .sort(sortBundles)
        .map((b: OutputChunk) => {
          return {
            id: b.fileName,
            isEntry: b.isEntry,
            imports: b.imports.filter(i => !!i),
            exports: b.exports,
            modules: Object.keys(b.modules).map(m => ({
              filename: m,
              exports: b.modules[m].renderedExports
            }))
          };
        });

      buildCtx.rollupResults = {
        modules: modules
      };
    }
  };

  return plugin;
}
