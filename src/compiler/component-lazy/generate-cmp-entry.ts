import * as d from '@declarations';
import { updateToLazyComponent } from './update-to-lazy-component';


export async function generateComponentEntry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModule: d.EntryModule) {
  const promises = entryModule.cmps.map(cmp => {
    return updateToLazyComponent(config, compilerCtx, buildCtx, build, cmp);
  });

  const lazyModules = (await Promise.all(promises)).sort((a, b) => {
    if (a.tagName < b.tagName) return -1;
    if (a.tagName > b.tagName) return 1;
    return 0;
  });

  const lazyModuleContent = lazyModules.map(lazyModule => {
    return lazyModule.exportLine;
  }).join('\n');

  return lazyModuleContent;
}
