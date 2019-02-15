import * as d from '@declarations';
import { generateComponentEntry } from '../component-lazy/generate-cmp-entry';


export function componentEntryPlugin(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModules: d.EntryModule[]) {
  const entrys = new Map<string, d.EntryModule>();

  return {
    resolveId(id: string) {
      if (build.lazyLoad && typeof id === 'string') {
        const entryModule = entryModules.find(entryModule => {
          return entryModule.entryKey === id;
        });

        if (entryModule != null) {
          entrys.set(id, entryModule);
          return id;
        }
      }

      return null;
    },

    load(id: string) {
      if (build.lazyLoad) {
        const entryModule = entrys.get(id);
        if (entryModule != null) {
          return generateComponentEntry(compilerCtx, buildCtx, build, entryModule);
        }
      }

      return null;
    },

    name: 'componentEntryPlugin'
  };
}
