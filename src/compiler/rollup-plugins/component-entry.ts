import * as d from '../../declarations';
import { updateToLazyComponent } from '../component-lazy/update-to-lazy-component';
import { updateToNativeComponent } from '../component-native/update-to-native-component';
import { Plugin } from 'rollup';


export const componentEntryPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModules: d.EntryModule[]): Plugin => {
  const entrys = new Map<string, d.EntryModule>();

  return {
    name: 'componentEntryPlugin',

    resolveId(id: string) {
      if (typeof id === 'string') {
        const entryModule = entryModules.find(entryModule => entryModule.entryKey === id);
        if (entryModule != null) {
          entrys.set(id, entryModule);
          return {
            id,
          };
        }
      }

      return null;
    },

    async load(id: string) {
      const entryModule = entrys.get(id);
      if (entryModule != null) {
        const modules = await Promise.all(
          build.lazyLoad
            ? entryModule.cmps.map(cmp => updateToLazyComponent(config, compilerCtx, buildCtx, cmp))
            : entryModule.cmps.map(cmp => updateToNativeComponent(config, compilerCtx, buildCtx, cmp))
        );

        return modules
          .map(lazyModule => lazyModule.exportLine)
          .join('\n');
      }
      return null;
    }
  };
};
