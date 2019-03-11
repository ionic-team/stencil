import * as d from '@declarations';
import { sortBy } from '@utils';
import { updateToLazyComponent } from '../component-lazy/update-to-lazy-component';
import { updateToNativeComponent } from '../component-native/update-to-native-component';


export function componentEntryPlugin(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModules: d.EntryModule[]) {
  const entrys = new Map<string, d.EntryModule>();

  return {
    resolveId(id: string) {
      if (typeof id === 'string') {
        const entryModule = entryModules.find(entryModule => entryModule.entryKey === id);
        if (entryModule != null) {
          entrys.set(id, entryModule);
          return id;
        }
      }

      return null;
    },

    async load(id: string) {
      const entryModule = entrys.get(id);
      if (entryModule != null) {
        const modules = await Promise.all(
          build.lazyLoad
            ? entryModule.cmps.map(cmp => updateToLazyComponent(config, compilerCtx, buildCtx, build, cmp))
            : entryModule.cmps.map(cmp => updateToNativeComponent(config, compilerCtx, buildCtx, build, cmp))
        );

        return sortBy(modules, m => m.cmp.tagName)
          .map(lazyModule => lazyModule.exportLine)
          .join('\n');
      }
      return null;
    },

    name: 'componentEntryPlugin'
  };
}
