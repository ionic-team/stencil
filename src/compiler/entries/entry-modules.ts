import type * as d from '../../declarations';
import { catchError, sortBy } from '@utils';
import { generateComponentBundles } from './component-bundles';

export function generateEntryModules(config: d.Config, buildCtx: d.BuildCtx) {
  // figure out how modules and components connect
  try {
    const bundles = generateComponentBundles(config, buildCtx);
    buildCtx.entryModules = bundles.map(createEntryModule);
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  buildCtx.debug(`generateEntryModules, ${buildCtx.entryModules.length} entryModules`);
}

function createEntryModule(cmps: d.ComponentCompilerMeta[]): d.EntryModule {
  // generate a unique entry key based on the components within this entry module
  cmps = sortBy(cmps, (c) => c.tagName);
  const entryKey = cmps.map((c) => c.tagName).join('.') + '.entry';

  return {
    cmps,
    entryKey,
  };
}
