import * as d from '@declarations';
import { updateToLazyComponent } from './update-to-lazy-component';
import { sortBy } from '@utils';


export async function generateComponentEntry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModule: d.EntryModule) {
  const lazyModules = await Promise.all(
    entryModule.cmps.map(cmp => updateToLazyComponent(config, compilerCtx, buildCtx, build, cmp))
  );

  return sortBy(lazyModules, m => m.tagName)
    .map(lazyModule => lazyModule.exportLine)
    .join('\n');
}
