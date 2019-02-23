import * as d from '@declarations';
import { writeLazyChunk } from './write-lazy-chunk';
import { writeLazyModule } from './write-lazy-entry-module';
import { sortBy } from '@utils';


export async function generateLazyModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistLazy[], rollupResults: d.RollupResult[]) {
  const entryComponetsResults = rollupResults.filter(rollupResult => {
    return rollupResult.isComponent;
  });

  const chunkResults = rollupResults.filter(rollupResult => {
    return !rollupResult.isComponent && !rollupResult.isAppCore;
  });

  const outputResults = await Promise.all([
    Promise.all(entryComponetsResults.map(rollupResult => {
      return generateLazyEntryModule(config, compilerCtx, buildCtx, outputTargets, buildCtx.entryModules, rollupResult);
    })),
    Promise.all(chunkResults.map(rollupResult => {
      return writeLazyChunk(config, compilerCtx, buildCtx, outputTargets, rollupResult);
    }))
  ]);

  const bundleModules = outputResults[0];
  return bundleModules;
}


async function generateLazyEntryModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistLazy[], entryModules: d.EntryModule[], rollupResult: d.RollupResult): Promise<d.BundleModule> {
  const entryModule = entryModules.find(entryModule => entryModule.entryKey === rollupResult.entryKey);

  const outputs = sortBy(await Promise.all(entryModule.modeNames.map(modeName => {
    return writeLazyModule(config, compilerCtx, buildCtx, outputTargets, entryModule, rollupResult.code, modeName);
  })), o => o.modeName);

  return {
    entryKey: rollupResult.entryKey,
    modeNames: entryModule.modeNames.slice(),
    cmps: entryModule.cmps,
    outputs
  };
}
