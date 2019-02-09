import * as d from '@declarations';
import { writeLazyChunk } from './write-lazy-chunk';
import { writeLazyModule } from './write-lazy-entry-module';


export async function generateLazyModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], rollupResults: d.RollupResult[]) {
  const entryCompononetResults = rollupResults.filter(rollupResult => {
    return rollupResult.isEntry && !rollupResult.isAppCore;
  });

  const chunkResults = rollupResults.filter(rollupResult => {
    return !rollupResult.isEntry && !rollupResult.isAppCore;
  });

  const outputResults = await Promise.all([
    Promise.all(entryCompononetResults.map(rollupResult => {
      return generateLazyEntryModule(config, compilerCtx, buildCtx, outputTargets, buildCtx.entryModules, rollupResult);
    })),
    Promise.all(chunkResults.map(rollupResult => {
      return writeLazyChunk(config, compilerCtx, buildCtx, outputTargets, rollupResult);
    }))
  ]);

  const bundleModules = outputResults[0];
  return bundleModules;
}


async function generateLazyEntryModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], entryModules: d.EntryModule[], rollupResult: d.RollupResult) {
  const entryModule = entryModules.find(entryModule => entryModule.entryKey === rollupResult.entryKey);

  const bundleModule: d.BundleModule = {
    entryKey: rollupResult.entryKey,
    modeNames: entryModule.modeNames.slice(),
    cmps: entryModule.cmps,
    outputs: await Promise.all(entryModule.modeNames.map(modeName => {
      return writeLazyModule(config, compilerCtx, buildCtx, outputTargets, entryModule, rollupResult.code, modeName);
    }))
  };

  bundleModule.outputs.sort((a, b) => {
    if (a.modeName < b.modeName) return -1;
    if (a.modeName > b.modeName) return 1;
    return 0;
  });

  return bundleModule;
}
